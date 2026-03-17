export default async function handler(req: any, res: any) {
  const startTime = Date.now();
  console.log(`[Vercel Handler] Request: ${req.method} ${req.url}`);

  try {
    // Stage 1: Dynamic Import with Error Capture
    console.log("[Vercel Handler] Stage 1: Importing server modules...");
    let server;
    try {
      // Use relative path with dynamic import to satisfy ESM and avoid eval-time crashes
      server = await import("../server/index.js").catch(() => import("../server/index"));
    } catch (importErr: any) {
      console.error("[Vercel Handler] IMPORT ERROR:", importErr);
      return res.status(500).json({
        stage: "IMPORT_FAILED",
        error: importErr.message,
        stack: importErr.stack,
        cwd: process.cwd(),
        hint: "Check /api/diag/fs to see where the server folder actually is."
      });
    }

    const { app, setupPromise } = server;

    // Stage 2: Await Setup with Timeout
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
        hint: "Server initialization is hanging."
      });
    }

    return app(req, res);

  } catch (globalErr: any) {
    console.error("[Vercel Handler] GLOBAL ERROR:", globalErr);
    res.status(500).json({ stage: "GLOBAL", error: globalErr.message });
  }
}
