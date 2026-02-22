import express, { type Express } from "express";
import fs from "fs";
import path from "path";

export function serveStatic(app: Express) {
  const rootDir = process.cwd();
  // We now build directly to the root 'public' folder
  let distPath = path.resolve(rootDir, "public");
  
  if (!fs.existsSync(distPath)) {
      // Fallback for local testing or old structure
      distPath = path.resolve(rootDir, "dist", "public");
  }

  if (!fs.existsSync(distPath)) {
      // Relative fallback
      distPath = path.resolve(__dirname, "..", "public");
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
