import { app, setupPromise } from "../server/index";

export default async function handler(req: any, res: any) {
  const startTime = Date.now();
  console.log(`[Vercel Global Handler] request started: ${req.method} ${req.url}`);
  
  try {
    // Wait for the initialization promise (routes, auth setup, etc.)
    await setupPromise;
    console.log(`[Vercel Global Handler] setupPromise resolved in ${Date.now() - startTime}ms`);
    
    // Pass the request to the Express application
    return app(req, res);
  } catch (err) {
    console.error("[Vercel Global Handler] CRITICAL INITIALIZATION ERROR:", err);
    
    if (!res.headersSent) {
      res.status(500).json({ 
        error: "Internal Server Error during initialization",
        details: err instanceof Error ? err.message : String(err),
        timestamp: new Date().toISOString()
      });
    }
  }
}
