import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { explainCodeSchema } from "@shared/schema";
import { explainCode } from "./services/openai";

export async function registerRoutes(app: Express): Promise<Server> {
  // API route to explain code
  app.post("/api/explain-code", async (req, res) => {
    try {
      const startTime = Date.now();
      
      // Validate request body
      const validatedData = explainCodeSchema.parse(req.body);
      
      // Call OpenAI service
      const result = await explainCode(validatedData.code, validatedData.language);
      
      const responseTime = Date.now() - startTime;
      
      // Store the explanation (optional, for analytics)
      try {
        await storage.createCodeExplanation({
          code: validatedData.code,
          language: validatedData.language,
          explanation: JSON.stringify(result),
          detectedLanguage: result.detectedLanguage,
          responseTime,
        });
      } catch (storageError) {
        console.warn("Failed to store explanation:", storageError);
        // Continue without failing the request
      }
      
      res.json({
        ...result,
        responseTime: responseTime / 1000, // Convert to seconds
      });
    } catch (error) {
      console.error("Error in explain-code endpoint:", error);
      
      if (error instanceof Error) {
        if (error.message.includes("parse")) {
          res.status(400).json({ 
            error: "Invalid request data. Please check your code input and try again." 
          });
        } else if (error.message.includes("OpenAI") || error.message.includes("API")) {
          res.status(503).json({ 
            error: "AI service temporarily unavailable. Please try again in a moment." 
          });
        } else {
          res.status(500).json({ 
            error: "Failed to analyze code. Please try again." 
          });
        }
      } else {
        res.status(500).json({ 
          error: "An unexpected error occurred. Please try again." 
        });
      }
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
