import path from "path";
import { mkdir, rm, readFile } from "fs/promises";
import { existsSync } from "fs";

const ROOT = process.cwd();
const DIST = path.join(ROOT, "dist");
const API_DIR = path.join(ROOT, "api");

// server deps to bundle to reduce openat(2) syscalls
// which helps cold start times
const allowlist = [
  "@google/generative-ai",
  "axios",
  "connect-pg-simple",
  "cors",
  "date-fns",
  "drizzle-orm",
  "drizzle-zod",
  "express",
  "express-rate-limit",
  "express-session",
  "jsonwebtoken",
  "memorystore",
  "multer",
  "nanoid",
  "nodemailer",
  "openai",
  "passport",
  "passport-local",
  "pg",
  "stripe",
  "uuid",
  "ws",
  "xlsx",
  "zod",
  "zod-validation-error",
];

async function buildAll() {
  console.log(`Building in: ${ROOT}`);

  // Clean build folders
  await rm(DIST, { recursive: true, force: true });
  await rm(API_DIR, { recursive: true, force: true });
  await mkdir(DIST, { recursive: true });
  await mkdir(API_DIR, { recursive: true });

  // 1. Build client → dist/ (flat, so dist/index.html is at top level)
  console.log("building client...");
  const { build: viteBuild } = await import("vite");
  await viteBuild({
    root: path.join(ROOT, "client"),
    configFile: path.join(ROOT, "vite.config.ts"),
    build: {
      outDir: DIST,
      emptyOutDir: true,
      rollupOptions: {
        input: path.join(ROOT, "client", "index.html"),
      },
    },
  });

  // 2. Build server → api/index.js (at project root, NOT inside dist)
  //    Vercel detects api/ at root as serverless functions
  console.log("building server...");
  const { build: esbuild } = await import("esbuild");
  const pkg = JSON.parse(await readFile(path.join(ROOT, "package.json"), "utf-8"));
  const allDeps = [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.devDependencies || {}),
  ];
  const externals = allDeps.filter((dep) => !allowlist.includes(dep));

  await esbuild({
    entryPoints: [path.join(ROOT, "server", "index.ts")],
    platform: "node",
    bundle: true,
    format: "cjs",
    outfile: path.join(API_DIR, "index.js"),
    define: {
      "process.env.NODE_ENV": '"production"',
    },
    minify: true,
    external: externals,
    logLevel: "info",
  });

  console.log("Build verification...");
  if (existsSync(DIST)) console.log("dist/ (static files) found!");
  if (existsSync(path.join(API_DIR, "index.js"))) console.log("api/index.js (serverless function) found!");
}

buildAll().catch((err) => {
  console.error(err);
  process.exit(1);
});
