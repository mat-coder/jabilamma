import { type User, type InsertUser, type ContentGeneration, type InsertContentGeneration } from "@shared/schema";
import { randomUUID } from "crypto";

// In-memory storage for demo purposes
let users: Map<string, User> = new Map();
let contentGenerations: Map<string, ContentGeneration> = new Map();

// Initialize with demo user
const demoUser: User = {
  id: 'demo-user',
  username: 'demo',
  password: 'demo',
  credits: 25,
  createdAt: new Date(),
};
users.set(demoUser.id, demoUser);

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserCredits(id: string, credits: number): Promise<User | undefined>;
  createContentGeneration(generation: InsertContentGeneration): Promise<ContentGeneration>;
  getUserContentGenerations(userId: string): Promise<ContentGeneration[]>;
}

export class MemStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    return users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = {
      ...insertUser,
      id,
      credits: 25,
      createdAt: new Date()
    };
    users.set(id, user);
    return user;
  }

  async updateUserCredits(id: string, credits: number): Promise<User | undefined> {
    const user = users.get(id);
    if (user) {
      const updatedUser = { ...user, credits };
      users.set(id, updatedUser);
      return updatedUser;
    }
    return undefined;
  }

  async createContentGeneration(generation: InsertContentGeneration): Promise<ContentGeneration> {
    const id = randomUUID();
    const contentGeneration: ContentGeneration = {
      ...generation,
      id,
      createdAt: new Date(),
      context: generation.context || {},
    };
    contentGenerations.set(id, contentGeneration);
    return contentGeneration;
  }

  async getUserContentGenerations(userId: string): Promise<ContentGeneration[]> {
    return Array.from(contentGenerations.values()).filter(
      (generation) => generation.userId === userId,
    );
  }
}

export const storage = new MemStorage();
