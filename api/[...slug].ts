import type { Request, Response } from "express";
import { app, setupPromise } from "../server/index";

export default async function handler(req: Request, res: Response) {
  try {
    // Wait for the database and routes to be fully initialized
    await setupPromise;
    
    // Pass the request to the Express application
    return app(req, res);
  } catch (err) {
    console.error("Critical error in Vercel function handler:", err);
    res.status(500).json({ error: "Internal Server Error during initialization" });
  }
}

