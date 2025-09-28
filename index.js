// server/index.ts
import "dotenv/config";
import { config } from "dotenv";
import { join } from "path";
import { GoogleGenerativeAI as GoogleGenerativeAI2 } from "@google/generative-ai";
import express2 from "express";
import cors from "cors";

// server/routes.ts
import { createServer } from "http";

// server/storage.ts
import { randomUUID } from "crypto";
var users = /* @__PURE__ */ new Map();
var contentGenerations = /* @__PURE__ */ new Map();
var demoUser = {
  id: "demo-user",
  username: "demo",
  password: "demo",
  credits: 25,
  createdAt: /* @__PURE__ */ new Date()
};
users.set(demoUser.id, demoUser);
var MemStorage = class {
  async getUser(id) {
    return users.get(id);
  }
  async getUserByUsername(username) {
    return Array.from(users.values()).find(
      (user) => user.username === username
    );
  }
  async createUser(insertUser) {
    const id = randomUUID();
    const user = {
      ...insertUser,
      id,
      credits: 25,
      createdAt: /* @__PURE__ */ new Date()
    };
    users.set(id, user);
    return user;
  }
  async updateUserCredits(id, credits) {
    const user = users.get(id);
    if (user) {
      const updatedUser = { ...user, credits };
      users.set(id, updatedUser);
      return updatedUser;
    }
    return void 0;
  }
  async createContentGeneration(generation) {
    const id = randomUUID();
    const contentGeneration = {
      ...generation,
      id,
      createdAt: /* @__PURE__ */ new Date(),
      context: generation.context || {}
    };
    contentGenerations.set(id, contentGeneration);
    return contentGeneration;
  }
  async getUserContentGenerations(userId) {
    return Array.from(contentGenerations.values()).filter(
      (generation) => generation.userId === userId
    );
  }
};
var storage = new MemStorage();

// server/routes.ts
import { GoogleGenerativeAI } from "@google/generative-ai";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
var gemini = null;
function generateMockContent(contentType, language, context) {
  const mockContent = {
    lyrics: {
      hindi: `\u0924\u0947\u0930\u0947 \u0907\u0936\u094D\u0915 \u092E\u0947\u0902 \u092A\u093E\u0917\u0932 \u0939\u0942\u0901 \u092E\u0948\u0902...`,
      tamil: `\u0B85\u0BB4\u0B95\u0BBF\u0B95 \u0BAA\u0BBE\u0B9F\u0BB2\u0BCD\u0B95\u0BB3\u0BCD \u0B89\u0BB2\u0B95\u0BBF\u0BB2\u0BCD...`,
      telugu: `\u0C28\u0C40 \u0C2A\u0C4D\u0C30\u0C47\u0C2E\u0C32\u0C4B \u0C2A\u0C3E\u0C21\u0C3F\u0C2A\u0C4B\u0C2F\u0C3E\u0C28\u0C41...`,
      bengali: `\u09A4\u09CB\u09AE\u09BE\u09B0 \u09AD\u09BE\u09B2\u09CB\u09AC\u09BE\u09B8\u09BE\u09B0 \u0997\u09BE\u09A8...`,
      marathi: `\u092A\u094D\u0930\u0947\u092E\u093E\u091A\u0947 \u0936\u092C\u094D\u0926 \u0917\u093E\u0924 \u091C\u093E\u0924\u094B...`
    },
    dialogue: {
      hindi: `\u092A\u093F\u0924\u093E: "\u092C\u0947\u091F\u093E, \u091C\u093F\u0902\u0926\u0917\u0940 \u092E\u0947\u0902 \u0938\u092B\u0932\u0924\u093E \u092A\u093E\u0928\u0947 \u0915\u0947 \u0932\u093F\u090F \u092E\u0947\u0939\u0928\u0924 \u0915\u0930\u0928\u0940 \u092A\u0921\u093C\u0924\u0940 \u0939\u0948\u0964" ...`,
      tamil: `\u0BA4\u0BA8\u0BCD\u0BA4\u0BC8: "\u0BAE\u0B95\u0BA9\u0BC7, \u0BB5\u0BBE\u0BB4\u0BCD\u0B95\u0BCD\u0B95\u0BC8\u0BAF\u0BBF\u0BB2\u0BCD \u0BB5\u0BC7\u0BB2\u0BC8..."`,
      telugu: `\u0C24\u0C3E\u0C24: "\u0C15\u0C4A\u0C21\u0C41\u0C15\u0C41, \u0C1C\u0C40\u0C35\u0C3F\u0C24\u0C02\u0C32\u0C4B \u0C35\u0C3F\u0C1C\u0C2F\u0C02..."`,
      bengali: `\u09AC\u09BE\u09AC\u09BE: "\u09AE\u09BE, \u099C\u09C0\u09AC\u09A8\u09C7 \u09B8\u09AB\u09B2 \u09B9\u09A4\u09C7 \u09B9\u09B2\u09C7..."`,
      marathi: `\u0935\u0921\u093F\u0932: "\u092E\u0941\u0932\u0917\u093E, \u091C\u0940\u0935\u0928\u093E\u0924 \u092F\u0936\u0938\u094D\u0935\u0940..."`
    }
  };
  return mockContent[contentType]?.[language] || "Mock content generated successfully!";
}
function initializeGemini() {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    console.log("\u{1F50D} Checking Gemini API key...");
    console.log("API key exists:", !!apiKey);
    if (apiKey) {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      console.log("\u2705 Gemini client initialized successfully");
      return model;
    } else {
      console.log("\u274C Gemini API key not found - using mock responses");
      return null;
    }
  } catch (error) {
    console.log(
      "\u274C Gemini client initialization failed - using mock responses:",
      error instanceof Error ? error.message : String(error)
    );
    return null;
  }
}
async function registerRoutes(app2, geminiClient) {
  gemini = geminiClient ?? initializeGemini();
  app2.post("/api/auth/register", async (req, res) => {
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
        user: { id: user.id, username: user.username, credits: user.credits }
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  app2.post("/api/auth/login", async (req, res) => {
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
        user: { id: user.id, username: user.username, credits: user.credits }
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  app2.post("/api/generate", async (req, res) => {
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
        generatedContent
      });
      await storage.updateUserCredits(userId, user.credits - 1);
      res.json({
        content: generatedContent,
        creditsRemaining: user.credits - 1
      });
    } catch (error) {
      console.error("Content generation error:", error);
      res.status(500).json({ message: "Failed to generate content" });
    }
  });
  app2.get("/api/user/credits/:userId", async (req, res) => {
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
  app2.get("/api/user/history/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const history = await storage.getUserContentGenerations(userId);
      res.json({ history });
    } catch (error) {
      console.error("Get history error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  base: "/jabilamma/",
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
import dotenv from "dotenv";
config({ path: join(process.cwd(), "server", ".env") });
dotenv.config();
console.log("\u{1F50D} Environment variables loaded:");
console.log("NODE_ENV:", process.env.NODE_ENV);
console.log("PORT:", process.env.PORT);
console.log("GEMINI_API_KEY exists:", !!process.env.GEMINI_API_KEY);
console.log("GEMINI_API_KEY preview:", process.env.GEMINI_API_KEY?.substring(0, 20) + "...");
var app = express2();
app.use(cors({
  origin: process.env.NODE_ENV === "production" ? "https://your-production-domain.com" : "http://localhost:5173",
  credentials: true
}));
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
function initializeGemini2() {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    console.log("\u{1F50D} Initializing Gemini client...");
    console.log("API key exists:", !!apiKey);
    if (apiKey) {
      const genAI = new GoogleGenerativeAI2(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      console.log("\u2705 Gemini client initialized successfully");
      return model;
    } else {
      console.log("\u274C Gemini API key not found");
      return null;
    }
  } catch (error) {
    console.log("\u274C Gemini client initialization failed:", error instanceof Error ? error.message : String(error));
    return null;
  }
}
(async () => {
  const geminiClient = initializeGemini2();
  const server = await registerRoutes(app, geminiClient);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = parseInt(process.env.PORT || "5000", 10);
  server.listen(port, "127.0.0.1", () => {
    log(`serving on port ${port}`);
  });
})();
