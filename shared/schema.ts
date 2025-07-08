import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const codeExplanations = pgTable("code_explanations", {
  id: serial("id").primaryKey(),
  code: text("code").notNull(),
  language: text("language").notNull(),
  explanation: text("explanation").notNull(),
  detectedLanguage: text("detected_language"),
  responseTime: integer("response_time"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertCodeExplanationSchema = createInsertSchema(codeExplanations).pick({
  code: true,
  language: true,
});

export const explainCodeSchema = z.object({
  code: z.string().min(1, "Code is required").max(10000, "Code must be less than 10,000 characters"),
  language: z.string().min(1, "Language is required"),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type CodeExplanation = typeof codeExplanations.$inferSelect;
export type InsertCodeExplanation = z.infer<typeof insertCodeExplanationSchema>;
export type ExplainCodeRequest = z.infer<typeof explainCodeSchema>;
