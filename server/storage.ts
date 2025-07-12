import { users, codeExplanations, type User, type InsertUser, type CodeExplanation, type InsertCodeExplanation } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createCodeExplanation(codeExplanation: InsertCodeExplanation & { explanation: string; detectedLanguage: string; responseTime: number }): Promise<CodeExplanation>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async createCodeExplanation(codeExplanation: InsertCodeExplanation & { explanation: string; detectedLanguage: string; responseTime: number }): Promise<CodeExplanation> {
    const [explanation] = await db
      .insert(codeExplanations)
      .values(codeExplanation)
      .returning();
    return explanation;
  }
}

export const storage = new DatabaseStorage();
