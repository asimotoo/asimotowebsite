import express, { type Express } from "express";
import fs from "fs";
import path from "path";

export function serveStatic(app: Express) {
  const rootDir = process.cwd();
  console.log(`[static] rootDir: ${rootDir}`);
  console.log(`[static] __dirname: ${__dirname}`);
  
  // Try multiple potential paths for the build directory
  const pathsToTry = [
    path.resolve(rootDir, "dist"),
    path.resolve(rootDir, "client", "dist"),
    path.resolve(__dirname, "dist"), // Relative to bundled server in Vercel
    path.resolve(__dirname, "..", "dist"),
    path.resolve(__dirname, "..", "public"),
  ];

  let distPath = "";
  for (const p of pathsToTry) {
    if (fs.existsSync(p) && fs.existsSync(path.join(p, "index.html"))) {
      distPath = p;
      console.log(`[static] Found build directory at: ${distPath}`);
      break;
    }
  }

  if (!distPath) {
    console.error("[static] CRITICAL: Could not find build directory with index.html in any expected location.");
    console.error(`[static] Paths searched: ${pathsToTry.join(", ")}`);
    // Fallback to first path but it will likely fail
    distPath = pathsToTry[0];
  }

  app.use(express.static(distPath));

  // Catch-all route for SPA
  app.get("*", (req, res) => {
    const indexPath = path.resolve(distPath, "index.html");
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      console.error(`[static] 404 fallback failed: index.html not found at ${indexPath}`);
      res.status(404).send("Application shell not found. Please check build logs.");
    }
  });
}
