import { type User, type InsertUser, type DataFile, type InsertDataFile, type DataTable, type InsertDataTable, type Report, type InsertReport } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

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

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private dataFiles: Map<string, DataFile>;
  private dataTables: Map<string, DataTable>;
  private reports: Map<string, Report>;

  constructor() {
    this.users = new Map();
    this.dataFiles = new Map();
    this.dataTables = new Map();
    this.reports = new Map();

    // Create a default user for demo purposes
    const defaultUser: User = {
      id: "default-user",
      username: "demo",
      password: "demo123",
      email: "demo@tallysync.com",
      fullName: "Demo User",
      createdAt: new Date(),
    };
    this.users.set(defaultUser.id, defaultUser);
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id, createdAt: new Date() };
    this.users.set(id, user);
    return user;
  }

  async getDataFile(id: string): Promise<DataFile | undefined> {
    return this.dataFiles.get(id);
  }

  async getDataFilesByUser(userId: string): Promise<DataFile[]> {
    return Array.from(this.dataFiles.values()).filter(file => file.userId === userId);
  }

  async createDataFile(insertDataFile: InsertDataFile): Promise<DataFile> {
    const id = randomUUID();
    const dataFile: DataFile = {
      ...insertDataFile,
      id,
      uploadedAt: new Date(),
      processedAt: null,
      status: "pending",
      processingTime: null,
      recordCount: 0,
      errorMessage: null,
    };
    this.dataFiles.set(id, dataFile);
    return dataFile;
  }

  async updateDataFileStatus(
    id: string,
    status: string,
    processingTime?: number,
    recordCount?: number,
    errorMessage?: string
  ): Promise<DataFile | undefined> {
    const dataFile = this.dataFiles.get(id);
    if (!dataFile) return undefined;

    const updatedFile: DataFile = {
      ...dataFile,
      status,
      processedAt: status === "completed" || status === "error" ? new Date() : dataFile.processedAt,
      processingTime: processingTime ?? dataFile.processingTime,
      recordCount: recordCount ?? dataFile.recordCount,
      errorMessage: errorMessage ?? dataFile.errorMessage,
    };

    this.dataFiles.set(id, updatedFile);
    return updatedFile;
  }

  async getDataTable(id: string): Promise<DataTable | undefined> {
    return this.dataTables.get(id);
  }

  async getDataTablesByFile(fileId: string): Promise<DataTable[]> {
    return Array.from(this.dataTables.values()).filter(table => table.fileId === fileId);
  }

  async getDataTablesByUser(userId: string): Promise<DataTable[]> {
    const userFiles = await this.getDataFilesByUser(userId);
    const fileIds = userFiles.map(file => file.id);
    return Array.from(this.dataTables.values()).filter(table => fileIds.includes(table.fileId));
  }

  async createDataTable(insertDataTable: InsertDataTable): Promise<DataTable> {
    const id = randomUUID();
    const dataTable: DataTable = {
      ...insertDataTable,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true,
    };
    this.dataTables.set(id, dataTable);
    return dataTable;
  }

  async updateDataTable(id: string, updates: Partial<DataTable>): Promise<DataTable | undefined> {
    const dataTable = this.dataTables.get(id);
    if (!dataTable) return undefined;

    const updatedTable: DataTable = {
      ...dataTable,
      ...updates,
      updatedAt: new Date(),
    };

    this.dataTables.set(id, updatedTable);
    return updatedTable;
  }

  async getReport(id: string): Promise<Report | undefined> {
    return this.reports.get(id);
  }

  async getReportsByUser(userId: string): Promise<Report[]> {
    return Array.from(this.reports.values()).filter(report => report.userId === userId);
  }

  async createReport(insertReport: InsertReport): Promise<Report> {
    const id = randomUUID();
    const report: Report = {
      ...insertReport,
      id,
      generatedAt: new Date(),
      filePath: null,
    };
    this.reports.set(id, report);
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

export const storage = new MemStorage();
