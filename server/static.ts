import express, { type Express } from "express";
import fs from "fs";
import path from "path";

export function serveStatic(app: Express) {
  const rootDir = process.cwd();
  // Case A: Running in Vercel. dist is the root, so public/ is at top level
  let distPath = path.resolve(rootDir, "public");
  
  if (!fs.existsSync(distPath)) {
      // Case B: Local dev or specific bundling. public is inside dist/
      distPath = path.resolve(rootDir, "dist", "public");
  }

  if (!fs.existsSync(distPath)) {
      // Case C: Bundle-relative resolution
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
