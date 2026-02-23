import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { serveStatic } from "./static";
import { createServer } from "http";

const app = express();
export { app };
const httpServer = createServer(app);

declare module "http" {
  interface IncomingMessage {
    rawBody: unknown;
  }
}

app.use(
  express.json({
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    },
  }),
);

app.use(express.urlencoded({ extended: false }));

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

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

      log(logLine);
    }
  });

  next();
});

log("Server environment: " + process.env.NODE_ENV);
log("Vercel environment: " + process.env.VERCEL);

const setupPromise = (async () => {
    try {
        log("Starting server setup...");
        await registerRoutes(httpServer, app);
        
        app.use((err: any, _req: Request, res: Response, next: NextFunction) => {
            const status = err.status || err.statusCode || 500;
            const message = err.message || "Internal Server Error";
            console.error("Internal Server Error:", err);
            if (res.headersSent) return next(err);
            return res.status(status).json({ message });
        });

        if (process.env.NODE_ENV === "production" || process.env.VERCEL) {
            log("Configuring static file serving (production)");
            serveStatic(app);
        } else {
            log("Configuring Vite (development)");
            const { setupVite } = await import("./vite");
            await setupVite(httpServer, app);
        }
        log("Server setup successfully completed");
        return app;
    } catch (error) {
        console.error("Critical: Server setup failed!", error);
        throw error;
    }
})();

const handler = async (req: Request, res: Response) => {
  log(`Request received: ${req.method} ${req.url}`);
  try {
      await setupPromise;
      return app(req, res);
  } catch (error) {
      console.error("Handler error:", error);
      res.status(500).send("Internal Server Error: Server Setup Failed");
  }
};

export default handler;

// Vercel CJS compatibility — ensures module.exports = handler
// when bundled with format: "cjs"
if (typeof module !== "undefined") {
  module.exports = handler;
}

if (process.env.NODE_ENV !== "production" && !process.env.VERCEL) {
  (async () => {
    await setupPromise;
    const port = parseInt(process.env.PORT || "5000", 10);
    httpServer.listen(port, "0.0.0.0", () => {
      log(`serving on port ${port}`);
    });
  })();
}
