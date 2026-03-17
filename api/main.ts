export default async function handler(req: any, res: any) {
  const startTime = Date.now();
  console.log(`[Vercel Handler] Request: ${req.method} ${req.url}`);

  try {
    // Stage 1: Dynamic Import with Error Capture
    console.log("[Vercel Handler] Stage 1: Importing server modules...");
    let server;
    try {
      server = await import("../server/index");
    } catch (importErr: any) {
      console.error("[Vercel Handler] IMPORT ERROR:", importErr);
      return res.status(500).json({
        stage: "IMPORT_FAILED",
        error: importErr.message,
        stack: importErr.stack,
        hint: "This usually means a missing dependency or a syntax error in server/index.ts or its imports."
      });
    }

    const { app, setupPromise } = server;

    // Stage 2: Await Setup with Timeout
    console.log("[Vercel Handler] Stage 2: Awaiting setupPromise...");
    try {
      await Promise.race([
        setupPromise,
        new Promise((_, reject) => setTimeout(() => reject(new Error("Setup timeout (15s)")), 15000))
      ]);
    } catch (setupErr: any) {
      console.error("[Vercel Handler] SETUP ERROR:", setupErr);
      return res.status(500).json({
        stage: "SETUP_FAILED",
        error: setupErr.message,
        stack: setupErr.stack,
        hint: "Server initialization (DB, Auth, etc.) is taking too long or failing."
      });
    }

    // Stage 3: Pass to Express
    console.log(`[Vercel Handler] Stage 3: Routing to Express. Total setup time: ${Date.now() - startTime}ms`);
    return app(req, res);

  } catch (globalErr: any) {
    console.error("[Vercel Handler] UNEXPECTED GLOBAL ERROR:", globalErr);
    if (!res.headersSent) {
      res.status(500).json({
        stage: "GLOBAL_CATCH",
        error: globalErr.message,
        stack: globalErr.stack
      });
    }
  }
}
