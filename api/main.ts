import { app, setupPromise } from "../server/index";

export default async function handler(req: any, res: any) {
  const startTime = Date.now();
  console.log(`[Vercel Global Handler] request started: ${req.method} ${req.url}`);
  
  try {
    // Wait for the initialization promise with a relative timeout
    // Using a Promise.race to ensure we don't hang Vercel indefinitely
    await Promise.race([
      setupPromise,
      new Promise((_, reject) => setTimeout(() => reject(new Error("Setup timeout (15s)")), 15000))
    ]);
    
    console.log(`[Vercel Global Handler] setupPromise resolved in ${Date.now() - startTime}ms`);
    
    // Pass the request to the Express application
    return app(req, res);
  } catch (err) {
    console.error("[Vercel Global Handler] CRITICAL INITIALIZATION ERROR:", err);
    
    if (!res.headersSent) {
      // If setup failed (likely DB), provide a fallback diagnostic even without Express
      if (req.url?.includes("/api/diag")) {
         return res.status(200).json({
           status: "RECOVERY_MODE",
           message: "Main app failed to initialize, but connectivity is OK.",
           error: err instanceof Error ? err.message : String(err),
           timestamp: new Date().toISOString(),
           hint: "Database connection likely failing. Check DATABASE_URL."
         });
      }

      res.status(500).json({ 
        error: "Internal Server Error during initialization",
        details: err instanceof Error ? err.message : String(err),
        timestamp: new Date().toISOString()
      });
    }
  }
}
