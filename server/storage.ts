import {
  users,
  dataFiles,
  dataTables,
  reports,
  type User,
  type UpsertUser,
  type DataFile,
  type InsertDataFile,
  type DataTable,
  type InsertDataTable,
  type Report,
  type InsertReport,
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;

  // Data file methods
  getDataFile(id: string): Promise<DataFile | undefined>;
  getDataFilesByUser(userId: string): Promise<DataFile[]>;
  createDataFile(dataFile: InsertDataFile): Promise<DataFile>;
  updateDataFileStatus(id: string, status: string, processingTime?: number, recordCount?: number, errorMessage?: string): Promise<DataFile | undefined>;

  // Data table methods
  getDataTable(id: string): Promise<DataTable | undefined>;
  getDataTablesByFile(fileId: string): Promise<DataTable[]>;
  getDataTablesByUser(userId: string): Promise<DataTable[]>;
  createDataTable(dataTable: InsertDataTable): Promise<DataTable>;
  updateDataTable(id: string, updates: Partial<DataTable>): Promise<DataTable | undefined>;

  // Report methods
  getReport(id: string): Promise<Report | undefined>;
  getReportsByUser(userId: string): Promise<Report[]>;
  createReport(report: InsertReport): Promise<Report>;

  // Analytics methods
  getUserMetrics(userId: string): Promise<{
    totalFiles: number;
    totalRecords: number;
    reportsGenerated: number;
    avgProcessingTime: number;
    successRate: number;
    errorRate: number;
  }>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async getDataFile(id: string): Promise<DataFile | undefined> {
    const [file] = await db.select().from(dataFiles).where(eq(dataFiles.id, id));
    return file || undefined;
  }

  async getDataFilesByUser(userId: string): Promise<DataFile[]> {
    const files = await db.select().from(dataFiles).where(eq(dataFiles.userId, userId));
    return files;
  }

  async createDataFile(insertDataFile: InsertDataFile): Promise<DataFile> {
    const [dataFile] = await db
      .insert(dataFiles)
      .values(insertDataFile)
      .returning();
    return dataFile;
  }

  async updateDataFileStatus(
    id: string,
    status: string,
    processingTime?: number,
    recordCount?: number,
    errorMessage?: string
  ): Promise<DataFile | undefined> {
    const [updatedFile] = await db
      .update(dataFiles)
      .set({
        status,
        processedAt: status === "completed" || status === "error" ? new Date() : undefined,
        processingTime: processingTime ? processingTime.toString() : undefined,
        recordCount: recordCount ?? undefined,
        errorMessage: errorMessage ?? undefined,
      })
      .where(eq(dataFiles.id, id))
      .returning();
    return updatedFile || undefined;
  }

  async getDataTable(id: string): Promise<DataTable | undefined> {
    const [table] = await db.select().from(dataTables).where(eq(dataTables.id, id));
    return table || undefined;
  }

  async getDataTablesByFile(fileId: string): Promise<DataTable[]> {
    const tables = await db.select().from(dataTables).where(eq(dataTables.fileId, fileId));
    return tables;
  }

  async getDataTablesByUser(userId: string): Promise<DataTable[]> {
    const result = await db
      .select({
        id: dataTables.id,
        fileId: dataTables.fileId,
        name: dataTables.name,
        description: dataTables.description,
        headers: dataTables.headers,
        data: dataTables.data,
        recordCount: dataTables.recordCount,
        createdAt: dataTables.createdAt,
        updatedAt: dataTables.updatedAt,
        isActive: dataTables.isActive,
      })
      .from(dataTables)
      .innerJoin(dataFiles, eq(dataTables.fileId, dataFiles.id))
      .where(eq(dataFiles.userId, userId));
    return result;
  }

  async createDataTable(insertDataTable: InsertDataTable): Promise<DataTable> {
    const [dataTable] = await db
      .insert(dataTables)
      .values(insertDataTable)
      .returning();
    return dataTable;
  }

  async updateDataTable(id: string, updates: Partial<DataTable>): Promise<DataTable | undefined> {
    const [updatedTable] = await db
      .update(dataTables)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(dataTables.id, id))
      .returning();
    return updatedTable || undefined;
  }

  async getReport(id: string): Promise<Report | undefined> {
    const [report] = await db.select().from(reports).where(eq(reports.id, id));
    return report || undefined;
  }

  async getReportsByUser(userId: string): Promise<Report[]> {
    const reportsList = await db.select().from(reports).where(eq(reports.userId, userId));
    return reportsList;
  }

  async createReport(insertReport: InsertReport): Promise<Report> {
    const [report] = await db
      .insert(reports)
      .values(insertReport)
      .returning();
    return report;
  }

  async getUserMetrics(userId: string): Promise<{
    totalFiles: number;
    totalRecords: number;
    reportsGenerated: number;
    avgProcessingTime: number;
    successRate: number;
    errorRate: number;
  }> {
    const userFiles = await this.getDataFilesByUser(userId);
    const userReports = await this.getReportsByUser(userId);

    const totalFiles = userFiles.length;
    const totalRecords = userFiles.reduce((sum, file) => sum + (file.recordCount || 0), 0);
    const reportsGenerated = userReports.length;

    const completedFiles = userFiles.filter(file => file.status === "completed");
    const errorFiles = userFiles.filter(file => file.status === "error");

    const avgProcessingTime = completedFiles.length > 0
      ? completedFiles.reduce((sum, file) => sum + (parseFloat(file.processingTime || "0")), 0) / completedFiles.length
      : 0;

    const successRate = totalFiles > 0 ? (completedFiles.length / totalFiles) * 100 : 0;
    const errorRate = totalFiles > 0 ? (errorFiles.length / totalFiles) * 100 : 0;

    return {
      totalFiles,
      totalRecords,
      reportsGenerated,
      avgProcessingTime,
      successRate,
      errorRate,
    };
  }
}

export const storage = new DatabaseStorage();
