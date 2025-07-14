import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import dotenv from "dotenv";
// Load environment variables from .env file
dotenv.config();
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    // Skip Vite setup for local development with Node.js v18 compatibility issues
    if (process.platform === "win32" || process.env.SKIP_VITE === "true") {
      log("Skipping Vite setup - serving simple HTML interface", "express");

      // Serve a simple HTML page for testing
      app.get("*", (req, res) => {
        res.send(`
          <!DOCTYPE html>
          <html lang="en">
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Code Explainer - Local Development</title>
              <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
              <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
              <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
              <style>
                body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 20px; }
                .container { max-width: 800px; margin: 0 auto; }
                textarea { width: 100%; height: 200px; font-family: monospace; }
                button { background: #007bff; color: white; border: none; padding: 10px 20px; cursor: pointer; }
                .result { margin-top: 20px; padding: 15px; background: #f8f9fa; border-radius: 5px; }
              </style>
            </head>
            <body>
              <div class="container">
                <h1>Code Explainer - Local Development</h1>
                <p>API is running on localhost:5000</p>
                <div>
                  <textarea id="codeInput" placeholder="Enter your code here..."></textarea>
                  <br><br>
                  <button onclick="explainCode()">Explain Code</button>
                </div>
                <div id="result" class="result" style="display: none;"></div>
              </div>
              
              <script>
                async function explainCode() {
                  const code = document.getElementById('codeInput').value;
                  const result = document.getElementById('result');
                  
                  if (!code.trim()) {
                    alert('Please enter some code to analyze');
                    return;
                  }
                  
                  result.innerHTML = 'Analyzing code...';
                  result.style.display = 'block';
                  
                  try {
                    const response = await fetch('/api/explain-code', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ code, language: 'javascript' })
                    });
                    
                    const data = await response.json();
                    
                    if (data.error) {
                      result.innerHTML = '<strong>Error:</strong> ' + data.error;
                    } else {
                      result.innerHTML = 
                        '<h3>Explanation:</h3>' +
                        '<p>' + data.explanation + '</p>' +
                        '<h4>Key Points:</h4>' +
                        '<ul>' + data.keyPoints.map(point => '<li>' + point + '</li>').join('') + '</ul>' +
                        (data.complexityAnalysis ? 
                          '<h4>Complexity Analysis:</h4>' +
                          '<p><strong>Time:</strong> ' + data.complexityAnalysis.timeComplexity + '</p>' +
                          '<p><strong>Space:</strong> ' + data.complexityAnalysis.spaceComplexity + '</p>' +
                          '<p>' + data.complexityAnalysis.analysis + '</p>' : '');
                    }
                  } catch (error) {
                    result.innerHTML = '<strong>Error:</strong> Failed to connect to API';
                  }
                }
              </script>
            </body>
          </html>
        `);
      });
    } else {
      try {
        await setupVite(app, server);
      } catch (error) {
        log("Vite setup failed, running in API-only mode", "express");
        app.get("*", (req, res) => {
          res.send(`
            <html>
              <head><title>Code Explainer API</title></head>
              <body>
                <h1>Code Explainer API Running</h1>
                <p>API is available at <a href="/api">/api</a></p>
                <p>For full frontend, fix the Vite configuration.</p>
              </body>
            </html>
          `);
        });
      }
    }
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on port 5000
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = 5000;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
})();
