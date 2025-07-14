import { users, codeExplanations, type User, type InsertUser, type CodeExplanation, type InsertCodeExplanation } from "@shared/schema";
// Comment out database imports for local development
// import { db } from "./db";
// import { eq } from "drizzle-orm";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createCodeExplanation(codeExplanation: InsertCodeExplanation & { explanation: string; detectedLanguage: string; responseTime: number }): Promise<CodeExplanation>;
}

// Use in-memory storage for local development
export class MemoryStorage implements IStorage {
  private users: User[] = [];
  private codeExplanations: CodeExplanation[] = [];
  private nextUserId = 1;
  private nextCodeExplanationId = 1;

  async getUser(id: number): Promise<User | undefined> {
    return this.users.find(user => user.id === id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return this.users.find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const user: User = {
      id: this.nextUserId++,
      username: insertUser.username,
      password: insertUser.password,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.users.push(user);
    return user;
  }

  async createCodeExplanation(codeExplanation: InsertCodeExplanation & { explanation: string; detectedLanguage: string; responseTime: number }): Promise<CodeExplanation> {
    const explanation: CodeExplanation = {
      id: this.nextCodeExplanationId++,
      code: codeExplanation.code,
      language: codeExplanation.language,
      explanation: codeExplanation.explanation,
      detectedLanguage: codeExplanation.detectedLanguage,
      responseTime: codeExplanation.responseTime,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.codeExplanations.push(explanation);
    return explanation;
  }
}

export const storage = new MemoryStorage();
