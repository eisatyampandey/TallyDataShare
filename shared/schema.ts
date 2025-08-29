import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, jsonb, decimal, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  fullName: text("full_name").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const dataFiles = pgTable("data_files", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  filename: text("filename").notNull(),
  originalName: text("original_name").notNull(),
  fileSize: integer("file_size").notNull(),
  mimeType: text("mime_type").notNull(),
  uploadedAt: timestamp("uploaded_at").defaultNow(),
  processedAt: timestamp("processed_at"),
  status: text("status").notNull().default("pending"), // pending, processing, completed, error
  processingTime: decimal("processing_time"), // in seconds
  recordCount: integer("record_count").default(0),
  errorMessage: text("error_message"),
});

export const dataTables = pgTable("data_tables", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  fileId: varchar("file_id").references(() => dataFiles.id).notNull(),
  name: text("name").notNull(),
  description: text("description"),
  headers: jsonb("headers").notNull(), // array of column headers
  data: jsonb("data").notNull(), // array of rows
  recordCount: integer("record_count").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  isActive: boolean("is_active").default(true),
});

export const reports = pgTable("reports", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  tableId: varchar("table_id").references(() => dataTables.id).notNull(),
  name: text("name").notNull(),
  description: text("description"),
  reportType: text("report_type").notNull(), // summary, detailed, custom
  config: jsonb("config").notNull(), // report configuration and calculations
  generatedAt: timestamp("generated_at").defaultNow(),
  format: text("format").notNull(), // pdf, excel, csv
  filePath: text("file_path"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  fullName: true,
});

export const insertDataFileSchema = createInsertSchema(dataFiles).pick({
  userId: true,
  filename: true,
  originalName: true,
  fileSize: true,
  mimeType: true,
});

export const insertDataTableSchema = createInsertSchema(dataTables).pick({
  fileId: true,
  name: true,
  description: true,
  headers: true,
  data: true,
  recordCount: true,
});

export const insertReportSchema = createInsertSchema(reports).pick({
  userId: true,
  tableId: true,
  name: true,
  description: true,
  reportType: true,
  config: true,
  format: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertDataFile = z.infer<typeof insertDataFileSchema>;
export type DataFile = typeof dataFiles.$inferSelect;
export type InsertDataTable = z.infer<typeof insertDataTableSchema>;
export type DataTable = typeof dataTables.$inferSelect;
export type InsertReport = z.infer<typeof insertReportSchema>;
export type Report = typeof reports.$inferSelect;
