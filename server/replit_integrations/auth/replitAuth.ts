import { Strategy as LocalStrategy } from "passport-local";
import passport from "passport";
import session from "express-session";
import type { Express, RequestHandler } from "express";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { authStorage } from "./storage";

const scryptAsync = promisify(scrypt);

export async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

export async function comparePassword(stored: string, supplied: string) {
  const [hashed, salt] = stored.split(".");
  if (!hashed || !salt) {
    console.error("[auth] Invalid stored password format (missing salt)");
    return false;
  }
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}


import PostgresStoreFactory from "connect-pg-simple";
import MemoryStoreFactory from "memorystore";
import { pool } from "../../db";

const PostgresStore = PostgresStoreFactory(session);
const MemoryStore = MemoryStoreFactory(session);

export function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
  let sessionStore;

  if (process.env.NODE_ENV === "production" || process.env.VERCEL) {
    try {
      console.log("[auth] Initializing PostgresStore for sessions...");
      sessionStore = new PostgresStore({
        pool: pool,
      });
    } catch (err) {
      console.error("[auth] Failed to initialize PostgresStore, falling back to MemoryStore:", err);
      sessionStore = new MemoryStore({
        checkPeriod: 86400000 
      });
    }
  } else {
    sessionStore = new MemoryStore({
      checkPeriod: 86400000 // prune expired entries every 24h
    });
  }

  return session({
    secret: process.env.SESSION_SECRET || "asi20moto26",
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    name: "asimoto_sid", // Specific name for the cookie
    cookie: {
      httpOnly: true,
      secure: true, // Always true for https on Vercel
      sameSite: "lax",
      maxAge: sessionTtl,
      path: "/",
    },
  });

}

export function setupAuth(app: Express) {
  app.set("trust proxy", 1);
  app.use(getSession());
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        console.log(`[auth] Attempting login for user: ${username}`);
        const user = await authStorage.getUserByUsername(username);
        
        if (!user) {
          console.log(`[auth] Login failed: User ${username} not found.`);
          return done(null, false, { message: "Incorrect username." });
        }
        
        console.log(`[auth] User ${username} found. Comparing passwords...`);
        const isMatch = await comparePassword(user.password, password);
        
        if (!isMatch) {
          console.log(`[auth] Login failed: Incorrect password for user ${username}.`);
          return done(null, false, { message: "Incorrect password." });
        }
        
        console.log(`[auth] Login successful for user: ${username}, role: ${user.role}`);
        return done(null, user);
      } catch (err) {
        console.error(`[auth] CRITICAL ERROR during authentication:`, err);
        return done(err);
      }
    }),
  );


  passport.serializeUser((user: any, done) => done(null, user.id));
  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await authStorage.getUser(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });

  app.post("/api/register", async (req, res, next) => {
    try {
      const { username, password, firstName, lastName, phone, email, role } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: "Kullanıcı adı ve şifre gereklidir" });
      }

      const existingUser = await authStorage.getUserByUsername(username);
      
      if (existingUser) {
        return res.status(400).json({ message: "Bu e-posta adresi zaten kayıtlı" });
      }

      const hashedPassword = await hashPassword(password);
      const user = await authStorage.upsertUser({
        username,
        password: hashedPassword,
        role: role || "user",
        email: email || username,
        firstName: firstName || null,
        lastName: lastName || null,
        phone: phone || null,
      });

      req.login(user, (err) => {
        if (err) return next(err);
        res.status(201).json(user);
      });
    } catch (err) {
      console.error("Registration error:", err);
      next(err);
    }
  });

  app.post("/api/login", passport.authenticate("local"), (req, res) => {
    res.status(200).json(req.user);
  });

  app.post("/api/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.redirect("/");
    });
  });
}

export const isAuthenticated: RequestHandler = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Unauthorized" });
};
