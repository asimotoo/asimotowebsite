import path from "path";
import { mkdir, rm, readFile, readdir } from "fs/promises";
import { existsSync } from "fs";

const ROOT = process.cwd();
const DIST = path.join(ROOT, "dist");
const DIST_PUBLIC = path.join(DIST, "public");
const DIST_API = path.join(DIST, "api");

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
  console.log(`Target dist: ${DIST}`);

  await rm(DIST, { recursive: true, force: true });
  await mkdir(DIST, { recursive: true });
  await mkdir(DIST_PUBLIC, { recursive: true });
  await mkdir(DIST_API, { recursive: true });

  console.log("building client...");
  const { build: viteBuild } = await import("vite");
  await viteBuild({
    root: path.join(ROOT, "client"),
    configFile: path.join(ROOT, "vite.config.ts"),
    build: {
      outDir: DIST_PUBLIC,
      emptyOutDir: true,
      rollupOptions: {
        input: path.join(ROOT, "client", "index.html"),
      },
    },
  });

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
    outfile: path.join(DIST_API, "index.js"),
    define: {
      "process.env.NODE_ENV": '"production"',
    },
    minify: true,
    external: externals,
    logLevel: "info",
  });

  console.log("Build verification...");
  if (existsSync(DIST)) {
      console.log("dist directory found!");
  } else {
      console.error("CRITICAL: dist directory MISSING after build!");
  }
}

buildAll().catch((err) => {
  console.error(err);
  process.exit(1);
});
