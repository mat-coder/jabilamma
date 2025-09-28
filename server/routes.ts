import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { GoogleGenerativeAI } from "@google/generative-ai";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Gemini model instance
let gemini: any = null;

// Mock content generator
function generateMockContent(contentType: string, language: string, context?: any): string {
  const mockContent = {
    lyrics: {
      hindi: `तेरे इश्क में पागल हूँ मैं...`,
      tamil: `அழகிக பாடல்கள் உலகில்...`,
      telugu: `నీ ప్రేమలో పాడిపోయాను...`,
      bengali: `তোমার ভালোবাসার গান...`,
      marathi: `प्रेमाचे शब्द गात जातो...`
    },
    dialogue: {
      hindi: `पिता: "बेटा, जिंदगी में सफलता पाने के लिए मेहनत करनी पड़ती है।" ...`,
      tamil: `தந்தை: "மகனே, வாழ்க்கையில் வேலை..."`,
      telugu: `తాత: "కొడుకు, జీవితంలో విజయం..."`,
      bengali: `বাবা: "মা, জীবনে সফল হতে হলে..."`,
      marathi: `वडिल: "मुलगा, जीवनात यशस्वी..."`,
    }
  };

  return (
    mockContent[contentType as keyof typeof mockContent]?.[
      language as keyof typeof mockContent.lyrics
    ] || "Mock content generated successfully!"
  );
}

// Initialize Gemini client
function initializeGemini(): any {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    console.log("🔍 Checking Gemini API key...");
    console.log("API key exists:", !!apiKey);

    if (apiKey) {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      console.log("✅ Gemini client initialized successfully");
      return model;
    } else {
      console.log("❌ Gemini API key not found - using mock responses");
      return null;
    }
  } catch (error) {
    console.log(
      "❌ Gemini client initialization failed - using mock responses:",
      error instanceof Error ? error.message : String(error)
    );
    return null;
  }
}

export async function registerRoutes(app: Express, geminiClient?: any): Promise<Server> {
  // Initialize Gemini if not provided
  gemini = geminiClient ?? initializeGemini();

  // ======================
  // AUTH ROUTES
  // ======================

  app.post("/api/auth/register", async (req, res) => {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
      }

      const existingUser = await storage.getUserByUsername(username);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await storage.createUser({ username, password: hashedPassword });

      const token = jwt.sign(
        { userId: user.id, username: user.username },
        process.env.JWT_SECRET || "fallback-secret",
        { expiresIn: "7d" }
      );

      res.json({
        message: "User created successfully",
        token,
        user: { id: user.id, username: user.username, credits: user.credits },
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
      }

      const user = await storage.getUserByUsername(username);
      if (!user) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      const token = jwt.sign(
        { userId: user.id, username: user.username },
        process.env.JWT_SECRET || "fallback-secret",
        { expiresIn: "7d" }
      );

      res.json({
        message: "Login successful",
        token,
        user: { id: user.id, username: user.username, credits: user.credits },
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // ======================
  // CONTENT GENERATION
  // ======================

  app.post("/api/generate", async (req, res) => {
    try {
      const { contentType, language, context, userId } = req.body;

      if (!contentType || !language || !userId) {
        return res.status(400).json({ message: "Content type, language, and user ID are required" });
      }

      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (user.credits <= 0) {
        return res.status(400).json({ message: "Insufficient credits" });
      }

      let prompt = "";
      if (contentType === "lyrics") {
        prompt = `Write original song lyrics in ${language}.`;
        if (context?.theme) prompt += ` Theme: ${context.theme}.`;
        if (context?.mood) prompt += ` Mood: ${context.mood}.`;
        if (context?.topic) prompt += ` Topic: ${context.topic}.`;
        prompt += " Make it poetic and engaging.";
      } else if (contentType === "dialogue") {
        prompt = `Write a sample dialogue in ${language}.`;
        if (context?.scenario) prompt += ` Scenario: ${context.scenario}.`;
        if (context?.characters) prompt += ` Characters: ${context.characters}.`;
        if (context?.situation) prompt += ` Situation: ${context.situation}.`;
        prompt += " Make it natural and conversational.";
      }

      let generatedContent = "";

      if (gemini) {
        try {
          console.log("Attempting to generate content with Gemini...");
          console.log("Prompt:", prompt);

          // ✅ Correct Gemini usage
          const result = await gemini.generateContent(prompt);
          generatedContent = result.response.text();
          console.log("Gemini generation successful:", generatedContent.length);
        } catch (error) {
          console.error("Gemini API error:", error);
          generatedContent = generateMockContent(contentType, language, context);
        }
      } else {
        generatedContent = generateMockContent(contentType, language, context);
      }

      await storage.createContentGeneration({
        userId,
        contentType,
        language,
        context,
        generatedContent,
      });

      await storage.updateUserCredits(userId, user.credits - 1);

      res.json({
        content: generatedContent,
        creditsRemaining: user.credits - 1,
      });
    } catch (error) {
      console.error("Content generation error:", error);
      res.status(500).json({ message: "Failed to generate content" });
    }
  });

  // ======================
  // USER UTILITIES
  // ======================

  app.get("/api/user/credits/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const user = await storage.getUser(userId);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({ credits: user.credits });
    } catch (error) {
      console.error("Get credits error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/user/history/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const history = await storage.getUserContentGenerations(userId);
      res.json({ history });
    } catch (error) {
      console.error("Get history error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
