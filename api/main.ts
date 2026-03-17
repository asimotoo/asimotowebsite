import { app, setupPromise } from "../server/index";

export default async function handler(req: any, res: any) {
  const startTime = Date.now();
  console.log(`[Vercel Handler] Request: ${req.method} ${req.url}`);

  try {
    // Stage 1: Await Setup with Timeout
    // We use Promise.race to prevent the function from timing out silently
    try {
      await Promise.race([
        setupPromise,
        new Promise((_, reject) => setTimeout(() => reject(new Error("Server setup timeout (15s)")), 15000))
      ]);
    } catch (setupErr: any) {
      console.error("[Vercel Handler] SETUP FAILURE:", setupErr);
      return res.status(500).json({
        stage: "SETUP_FAILED",
        error: setupErr.message,
        hint: "Server initialization took too long or failed. Check Vercel logs for Point 1, 2, 3 logs."
      });
    }

    // Stage 2: Pass to Express
    console.log(`[Vercel Handler] Routing to Express. Total setup time: ${Date.now() - startTime}ms`);
    return app(req, res);

  } catch (globalErr: any) {
    console.error("[Vercel Handler] GLOBAL ERROR:", globalErr);
    if (!res.headersSent) {
      res.status(500).json({
        stage: "GLOBAL_CATCH",
        error: globalErr.message,
        stack: globalErr.stack
      });
    }
  }
}
