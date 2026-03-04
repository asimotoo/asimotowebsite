import path from "path";
import { mkdir, rm, readFile, writeFile, cp } from "fs/promises";
import { existsSync } from "fs";

const ROOT = process.cwd();
const DIST = path.join(ROOT, "dist");
const API_DIR = path.join(ROOT, "api");

// Vercel Build Output API v3 paths
const VERCEL_OUTPUT = path.join(ROOT, ".vercel", "output");
const VERCEL_STATIC = path.join(VERCEL_OUTPUT, "static");
const VERCEL_FUNCTIONS = path.join(VERCEL_OUTPUT, "functions");

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
  await rm(VERCEL_OUTPUT, { recursive: true, force: true });
  await mkdir(DIST, { recursive: true });
  await mkdir(API_DIR, { recursive: true });

  // 1. Build client → dist/
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

  // 2. Build server → api/index.js
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

  // 3. Generate Vercel Build Output API v3

  console.log("generating Vercel Build Output API v3...");

  // Create output directories
  await mkdir(VERCEL_STATIC, { recursive: true });
  const funcDir = path.join(VERCEL_FUNCTIONS, "api", "index.func");
  await mkdir(funcDir, { recursive: true });

  // Copy static files (dist → .vercel/output/static)
  await cp(DIST, VERCEL_STATIC, { recursive: true });

  // Copy serverless function
  await cp(
    path.join(API_DIR, "index.js"),
    path.join(funcDir, "index.js")
  );

  // Copy dist/ into the function directory so Express can serve static files
  const funcDistDir = path.join(funcDir, "dist");
  await cp(DIST, funcDistDir, { recursive: true });

  // Write function config
  await writeFile(
    path.join(funcDir, ".vc-config.json"),
    JSON.stringify({
      runtime: "nodejs20.x",
      handler: "index.js",
      launcherType: "Nodejs",
    }, null, 2)
  );

  // Write output config
  await writeFile(
    path.join(VERCEL_OUTPUT, "config.json"),
    JSON.stringify({
      version: 3,
      routes: [
        // 1. API routes
        {
          src: "^/api/(.*)$",
          dest: "/api/index",
        },
        // 2. Static files check
        {
          handle: "filesystem"
        },
        // 3. SPA Fallback - all other routes go to the function
        {
          src: "^/(.*)$",
          dest: "/api/index",
        },
      ],
    }, null, 2)
  );

  console.log("Build verification...");
  if (existsSync(DIST)) console.log("✓ dist/ (static files) found!");
  if (existsSync(path.join(API_DIR, "index.js"))) console.log("✓ api/index.js (serverless function) found!");
  if (existsSync(path.join(VERCEL_OUTPUT, "config.json"))) console.log("✓ .vercel/output/config.json found!");
  if (existsSync(path.join(funcDir, "index.js"))) console.log("✓ .vercel/output/functions/api/index.func/index.js found!");
  if (existsSync(VERCEL_STATIC)) console.log("✓ .vercel/output/static/ found!");
}

buildAll().catch((err) => {
  console.error(err);
  process.exit(1);
});
