import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, jsonb, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  credits: integer("credits").default(25).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const contentGenerations = pgTable("content_generations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  contentType: text("content_type").notNull(), // 'lyrics' or 'dialogue'
  language: text("language").notNull(),
  context: jsonb("context"),
  generatedContent: text("generated_content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertContentGenerationSchema = createInsertSchema(contentGenerations).pick({
  userId: true,
  contentType: true,
  language: true,
  context: true,
  generatedContent: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type ContentGeneration = typeof contentGenerations.$inferSelect;
export type InsertContentGeneration = z.infer<typeof insertContentGenerationSchema>;
