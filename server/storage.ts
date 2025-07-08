import { users, type User, type InsertUser, type CodeExplanation, type InsertCodeExplanation } from "@shared/schema";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createCodeExplanation(codeExplanation: InsertCodeExplanation & { explanation: string; detectedLanguage: string; responseTime: number }): Promise<CodeExplanation>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private codeExplanations: Map<number, CodeExplanation>;
  currentId: number;
  currentExplanationId: number;

  constructor() {
    this.users = new Map();
    this.codeExplanations = new Map();
    this.currentId = 1;
    this.currentExplanationId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createCodeExplanation(codeExplanation: InsertCodeExplanation & { explanation: string; detectedLanguage: string; responseTime: number }): Promise<CodeExplanation> {
    const id = this.currentExplanationId++;
    const explanation: CodeExplanation = { 
      id,
      ...codeExplanation,
      createdAt: new Date()
    };
    this.codeExplanations.set(id, explanation);
    return explanation;
  }
}

export const storage = new MemStorage();
