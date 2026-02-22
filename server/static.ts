import express, { type Express } from "express";
import fs from "fs";
import path from "path";

export function serveStatic(app: Express) {
  const rootDir = process.cwd();
  let distPath = path.resolve(rootDir, "dist", "public");
  
  if (!fs.existsSync(distPath)) {
      // Try relative to __dirname (useful for some bundling scenarios)
      distPath = path.resolve(__dirname, "..", "dist", "public");
  }

  if (!fs.existsSync(distPath)) {
      // Fallback to a plain 'public' directory at root if that was used
      distPath = path.resolve(rootDir, "public");
  }

  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  app.use(express.static(distPath));

  // fall through to index.html if the file doesn't exist
  app.use("/{*path}", (_req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}
