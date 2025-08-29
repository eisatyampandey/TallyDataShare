import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import multer from "multer";
import * as XLSX from "xlsx";
import { insertDataFileSchema, insertDataTableSchema, insertReportSchema } from "@shared/schema";
import { z } from "zod";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
      'application/vnd.ms-excel', // .xls
      'text/csv' // .csv
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only Excel and CSV files are allowed.'));
    }
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Get dashboard metrics
  app.get("/api/dashboard/metrics", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const metrics = await storage.getUserMetrics(userId);
      res.json(metrics);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch metrics" });
    }
  });

  // Get recent activity
  app.get("/api/dashboard/activity", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const files = await storage.getDataFilesByUser(userId);
      const recentFiles = files
        .sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime())
        .slice(0, 10)
        .map(file => ({
          id: file.id,
          filename: file.originalName,
          status: file.status,
          timestamp: file.uploadedAt,
          recordCount: file.recordCount,
        }));
      res.json(recentFiles);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch activity" });
    }
  });

  // Upload file
  app.post("/api/files/upload", isAuthenticated, upload.single("file"), async (req: any, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const userId = req.user.claims.sub;
      const fileData = insertDataFileSchema.parse({
        userId,
        filename: req.file.filename || req.file.originalname,
        originalName: req.file.originalname,
        fileSize: req.file.size,
        mimeType: req.file.mimetype,
      });

      const dataFile = await storage.createDataFile(fileData);

      // Process file asynchronously
      processFileAsync(dataFile.id, req.file.buffer);

      res.json(dataFile);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid file data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to upload file" });
    }
  });

  // Get file processing status
  app.get("/api/files/:id/status", isAuthenticated, async (req, res) => {
    try {
      const file = await storage.getDataFile(req.params.id);
      if (!file) {
        return res.status(404).json({ message: "File not found" });
      }
      res.json({ status: file.status, recordCount: file.recordCount, errorMessage: file.errorMessage });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch file status" });
    }
  });

  // Get data tables
  app.get("/api/tables", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const tables = await storage.getDataTablesByUser(userId);
      const tablesWithFileInfo = await Promise.all(
        tables.map(async (table) => {
          const file = await storage.getDataFile(table.fileId);
          return {
            ...table,
            fileName: file?.originalName || "Unknown",
            fileStatus: file?.status || "unknown",
          };
        })
      );
      res.json(tablesWithFileInfo);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch tables" });
    }
  });

  // Get specific table data
  app.get("/api/tables/:id", isAuthenticated, async (req, res) => {
    try {
      const table = await storage.getDataTable(req.params.id);
      if (!table) {
        return res.status(404).json({ message: "Table not found" });
      }
      res.json(table);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch table" });
    }
  });

  // Export table data
  app.get("/api/tables/:id/export", isAuthenticated, async (req, res) => {
    try {
      const { format = "xlsx" } = req.query;
      const table = await storage.getDataTable(req.params.id);
      
      if (!table) {
        return res.status(404).json({ message: "Table not found" });
      }

      const headers = table.headers as string[];
      const data = table.data as any[][];

      if (format === "csv") {
        const csvContent = [headers, ...data].map(row => row.join(",")).join("\n");
        res.setHeader("Content-Type", "text/csv");
        res.setHeader("Content-Disposition", `attachment; filename="${table.name}.csv"`);
        res.send(csvContent);
      } else {
        // Excel export
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.aoa_to_sheet([headers, ...data]);
        XLSX.utils.book_append_sheet(wb, ws, "Data");
        
        const buffer = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetL.sheet");
        res.setHeader("Content-Disposition", `attachment; filename="${table.name}.xlsx"`);
        res.send(buffer);
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to export table" });
    }
  });

  // Generate report
  app.post("/api/reports", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const reportData = insertReportSchema.parse({
        ...req.body,
        userId,
      });

      const report = await storage.createReport(reportData);
      res.json(report);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid report data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create report" });
    }
  });

  // Get reports
  app.get("/api/reports", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const reports = await storage.getReportsByUser(userId);
      res.json(reports);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch reports" });
    }
  });

  async function processFileAsync(fileId: string, buffer: Buffer) {
    const startTime = Date.now();
    
    try {
      await storage.updateDataFileStatus(fileId, "processing");

      // Parse the file based on its type
      const workbook = XLSX.read(buffer, { type: "buffer" });
      const sheetNames = workbook.SheetNames;

      let totalRecords = 0;

      for (const sheetName of sheetNames) {
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

        if (jsonData.length > 0) {
          const headers = jsonData[0] as string[];
          const data = jsonData.slice(1) as any[][];

          const tableData = insertDataTableSchema.parse({
            fileId,
            name: sheetName,
            description: `Data from sheet: ${sheetName}`,
            headers,
            data,
            recordCount: data.length,
          });

          await storage.createDataTable(tableData);
          totalRecords += data.length;
        }
      }

      const processingTime = (Date.now() - startTime) / 1000;
      await storage.updateDataFileStatus(fileId, "completed", processingTime, totalRecords);
    } catch (error) {
      console.error("File processing error:", error);
      await storage.updateDataFileStatus(
        fileId,
        "error",
        undefined,
        undefined,
        error instanceof Error ? error.message : "Unknown processing error"
      );
    }
  }

  const httpServer = createServer(app);
  return httpServer;
}
