import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { insertMotorcycleSchema } from "@shared/schema";
import { z } from "zod";
import { setupAuth, registerAuthRoutes } from "./replit_integrations/auth";
import multer from "multer";
import path from "path";
import fs from "fs";
import nodemailer from "nodemailer";

// Configure Multer for local file storage
const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      const uploadDir = path.join(process.cwd(), "attached_assets");
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + path.extname(file.originalname));
    },
  }),
});


export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Setup Auth FIRST
  await setupAuth(app);
  registerAuthRoutes(app);

  // Middleware to check if user is admin
  const isAdmin = (req: any, res: any, next: any) => {
    if (!req.isAuthenticated() || (req.user as any).role !== "admin") {
      return res.status(403).send("Forbidden");
    }
    next();
  };

  // Serve attached assets
  app.use("/assets", (req, res, next) => {
      const filePath = path.join(process.cwd(), "attached_assets", req.path);
      if (fs.existsSync(filePath)) {
          res.sendFile(filePath);
      } else {
          next();
      }
  });

  // Products


  app.get(api.products.get.path, async (req, res) => {
    const product = await storage.getProduct(Number(req.params.id));
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  });

  // Product Creation with Image Upload
  app.post(api.products.create.path, isAdmin, upload.array("images"), async (req, res) => {
    try {
      const files = req.files as Express.Multer.File[];
      if (!files || files.length === 0) {
        return res.status(400).json({ message: "En az bir görsel gereklidir" });
      }

      // Construct file URLs
      const imageUrls = files.map(file => `/assets/${file.filename}`);
      const primaryImageUrl = imageUrls[0]; // Use first image as main/thumbnail

      // Parse body (it comes as text fields due to multipart)
      const inputData = {
        name: req.body.name,
        description: req.body.description,
        price: Number(req.body.price),
        stock: Number(req.body.stock),
        categoryId: Number(req.body.categoryId),
        brand: req.body.brand || "",
        model: req.body.model || "",
        year: req.body.year ? Number(req.body.year) : undefined,
        isFeatured: req.body.isFeatured === "true",
        imageUrl: primaryImageUrl,
        images: JSON.stringify(imageUrls), 
      };

      const product = await storage.createProduct(inputData);
      res.status(201).json(product);
    } catch (err) {
      console.error("POST /api/products Error:", err);
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      res.status(500).json({ message: err instanceof Error ? err.message : "Internal Server Error" });
    }
  });

  // Categories
  app.get(api.categories.list.path, async (req, res) => {
    const categories = await storage.getCategories();
    res.json(categories);
  });



  // Messages - Unified Route (DB + Email)
  app.post(api.messages.create.path, async (req, res) => {
    try {
      const input = api.messages.create.input.parse(req.body);
      
      // 1. Save to Database
      const message = await storage.createMessage(input);

      // 2. Send Email Notification
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'asimoto0671@gmail.com',
          pass: 'BURAYA_GMAIL_UYGULAMA_SIFRESI_GELECEK' // Standart şifre değil, Google "Uygulama Şifresi"
        }
      });

      const mailOptions = {
        from: input.email,
        to: 'asimoto0671@gmail.com',
        subject: `Yeni Mesaj: ${input.name}`,
        text: `İsim: ${input.name}\nE-posta: ${input.email}\nTelefon: ${input.phone}\nMesaj: ${input.message}`
      };

      // Non-blocking email send (don't fail the request if mail fails, just log it)
      transporter.sendMail(mailOptions).catch(console.error);

      res.status(201).json(message);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });



  // Admin: Get All Messages
  app.get("/api/messages", isAdmin, async (req, res) => {
    const messages = await storage.getMessages();
    res.json(messages);
  });

  app.get("/api/products", async (req, res) => {
    const categoryId = req.query.categoryId ? Number(req.query.categoryId) : undefined;
    const brand = req.query.brand as string | undefined;
    const search = req.query.q as string | undefined;
    const sort = req.query.sort as string | undefined;
    const minPrice = req.query.minPrice ? Number(req.query.minPrice) : undefined;
    const maxPrice = req.query.maxPrice ? Number(req.query.maxPrice) : undefined;

    const products = await storage.getProducts(categoryId, brand, search, sort, minPrice, maxPrice);
    res.json(products);
  });

  app.get("/api/products/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });
    
    const product = await storage.getProduct(id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    
    res.json(product);
  });



  app.put("/api/products/:id", isAdmin, upload.array("images"), async (req, res) => {
    const id = parseInt(req.params.id as string);
    console.log("PUT Product ID:", id);
    console.log("PUT Body:", req.body);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });

    try {
       const files = req.files as Express.Multer.File[];
       let imageUrls: string[] | undefined;
       let primaryImageUrl: string | undefined;

       if (files && files.length > 0) {
         imageUrls = files.map(file => `/assets/${file.filename}`);
         primaryImageUrl = imageUrls[0];
       }

       // Explicitly construct inputData to avoid polluting with req.body garbage
       const inputData: any = {
         name: req.body.name,
         description: req.body.description,
         price: req.body.price ? Number(req.body.price) : undefined,
         stock: req.body.stock ? Number(req.body.stock) : undefined,
         categoryId: req.body.categoryId ? Number(req.body.categoryId) : undefined,
         brand: req.body.brand, // Allow empty string
         model: req.body.model, // Allow empty string
         year: req.body.year ? Number(req.body.year) : undefined,
         isFeatured: req.body.isFeatured === "true"
       };

       // Handle images update logic
       if (imageUrls) {
          inputData.images = JSON.stringify(imageUrls);
          inputData.imageUrl = primaryImageUrl;
       }
       
       // If existing images are sent as string (e.g. kept from frontend), we might need to handle them.
       // For now, let's assume if new files are uploaded, they replace the old ones or strict append logic is handled by frontend sending existing + new? 
       // Simplest for now: if new files, replace. If no new files, keep existing (undefined in update) unless explicitly cleared (not handled here yet).

       const updatedProduct = await storage.updateProduct(id, inputData);
       if (!updatedProduct) return res.status(404).json({ message: "Product not found" });

       res.json(updatedProduct);
    } catch (err) {
      console.error("PUT /api/products/:id Error:", err);
      try {
         const fs = await import('fs');
         const path = await import('path');
         const logPath = '/Users/yusuferkan/Downloads/Asi-Moto-Store/error.json';
         const errorLog = {
            timestamp: new Date().toISOString(),
            error: err instanceof Error ? err.message : String(err),
            // @ts-ignore
            stack: err.stack,
            // @ts-ignore
            zodErrors: err instanceof z.ZodError ? err.errors : null,
            body: req.body,
            files: req.files
         };
         fs.writeFileSync(logPath, JSON.stringify(errorLog, null, 2));
      } catch (logErr) {
         console.error("Failed to write log file:", logErr);
      }

      if (err instanceof z.ZodError) {
        console.error("Zod Error Details:", JSON.stringify(err.errors, null, 2));
        const errorMessage = `Zod Error: ${err.errors[0].path.join('.')} - ${err.errors[0].message}`;
        return res.status(400).json({ message: errorMessage });
      }
      throw err;
    }
  });

  app.delete("/api/products/:id", isAdmin, async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });
    
    try {
      await storage.deleteProduct(id);
      res.status(204).send();
    } catch (err) {
      res.status(500).json({ message: "Failed to delete product" });
    }
  });

  // Motorcycles API
  
  // GET /api/motorcycles 
  app.get("/api/motorcycles", async (req, res) => {
    const filters = {
      brand: req.query.brand as string,
      type: req.query.type as string,
      minPrice: req.query.minPrice ? Number(req.query.minPrice) : undefined,
      maxPrice: req.query.maxPrice ? Number(req.query.maxPrice) : undefined,
      minYear: req.query.minYear ? Number(req.query.minYear) : undefined,
      maxYear: req.query.maxYear ? Number(req.query.maxYear) : undefined, 
      minKm: req.query.minKm ? Number(req.query.minKm) : undefined,
      maxKm: req.query.maxKm ? Number(req.query.maxKm) : undefined,
      city: req.query.city as string,
    };

    const motos = await storage.getMotorcycles(filters);
    res.json(motos);
  });

  // GET /api/motorcycles/:id
  app.get("/api/motorcycles/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });
    
    const moto = await storage.getMotorcycle(id);
    if (!moto) return res.status(404).json({ message: "Motorcycle not found" });
    
    res.json(moto);
  });

  // POST /api/motorcycles (Admin only)
  app.post("/api/motorcycles", isAdmin, upload.array("images"), async (req, res) => {
    try {
      const files = req.files as Express.Multer.File[];
      const imageUrls = files.map(file => `/assets/${file.filename}`);
      
      const inputData = {
        brand: req.body.brand,
        model: req.body.model,
        price: Number(req.body.price),
        city: req.body.city,
        district: req.body.district,
        neighborhood: req.body.neighborhood,
        type: req.body.type,
        year: Number(req.body.year),
        km: Number(req.body.km),
        engineVolume: req.body.engineVolume,
        color: req.body.color,
        heavyDamage: req.body.heavyDamage === "true",
        description: req.body.description,
        images: JSON.stringify(imageUrls),
      };

      // Log input data for debugging
      const fs = await import('fs');
      fs.writeFileSync('debug_input.json', JSON.stringify(inputData, null, 2));

      // Explicitly parse with Zod to catch validation errors
      const validatedData = insertMotorcycleSchema.parse(inputData);

      const moto = await storage.createMotorcycle(validatedData);
      res.status(201).json(moto);
    } catch (err) {
      console.error("POST /api/motorcycles Error:", err);
      // Log error to file
      const fs = await import('fs');
      fs.writeFileSync('debug_error.json', JSON.stringify({
        error: err,
        message: err instanceof Error ? err.message : String(err),
        isZod: err instanceof z.ZodError,
        zodErrors: err instanceof z.ZodError ? err.errors : null
      }, null, 2));

      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: `${err.errors[0].path.join('.')} - ${err.errors[0].message}`,
          field: err.errors[0].path.join('.'),
        });
      }
      res.status(500).json({ message: err instanceof Error ? err.message : "Failed to create motorcycle listing" });
    }
  });
  
  // PUT /api/motorcycles/:id (Admin only)
  app.put("/api/motorcycles/:id", isAdmin, upload.array("images"), async (req, res) => {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });

    try {
      const files = req.files as Express.Multer.File[];
      let imageUrls: string[] | undefined;

      if (files && files.length > 0) {
        imageUrls = files.map(file => `/assets/${file.filename}`);
      }

      const inputData: any = {
        brand: String(req.body.brand),
        model: String(req.body.model),
        price: req.body.price ? Number(req.body.price) : undefined,
        city: String(req.body.city),
        district: String(req.body.district),
        neighborhood: String(req.body.neighborhood),
        type: String(req.body.type),
        year: req.body.year ? Number(req.body.year) : undefined,
        km: req.body.km ? Number(req.body.km) : undefined,
        engineVolume: String(req.body.engineVolume),
        color: String(req.body.color),
        heavyDamage: String(req.body.heavyDamage) === "true",
        description: String(req.body.description),
      };

      if (imageUrls) {
        inputData.images = JSON.stringify(imageUrls);
      }

      // If existing images are kept, we need to handle them. 
      // For now, if new files are uploaded, they replace old ones.
      // If we want to append or remove specific ones, frontend needs to send the current list.
      // Let's check if 'existingImages' is sent
      if (req.body.existingImages) {
          let existing: string[] = [];
          try {
              const parsed = JSON.parse(req.body.existingImages as string);
              if (Array.isArray(parsed)) {
                  existing = parsed;
              } else {
                  existing = [parsed];
              }
          } catch (e) {
              const val = req.body.existingImages as string;
              existing = [val];
          }
           if (imageUrls) {
               // Append new images to existing ones
               const combined = [...existing, ...imageUrls];
               inputData.images = JSON.stringify(combined);
           } else {
               // Just keep existing
               inputData.images = JSON.stringify(existing);
           }
      }


      const updatedMoto = await storage.updateMotorcycle(id, inputData);
      if (!updatedMoto) return res.status(404).json({ message: "Motorcycle not found" });

      res.json(updatedMoto);
    } catch (err) {
      console.error("PUT /api/motorcycles/:id Error:", err);
      res.status(500).json({ message: "Failed to update motorcycle" });
    }
  });

  // DELETE /api/motorcycles/:id (Admin only)
  app.delete("/api/motorcycles/:id", isAdmin, async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });
    
    try {
      await storage.deleteMotorcycle(id);
      res.status(204).send();
    } catch (err) {
      res.status(500).json({ message: "Failed to delete motorcycle" });
    }
  });

  return httpServer;
}

async function seedDatabase() {
  const categories = await storage.getCategories();
  if (categories.length === 0) {
    // 1. Yedek Parça
    await storage.createCategory({
      name: "Yedek Parça",
      slug: "yedek-parca",
      imageUrl: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=500&auto=format&fit=crop"
    });
    // 2. Elektronik Ekipman
    await storage.createCategory({
      name: "Elektronik Ekipman",
      slug: "elektronik-ekipman",
      imageUrl: "https://images.unsplash.com/photo-1558981285-6f0c94958bb6?w=500&auto=format&fit=crop"
    });
    // 3. Jant & Lastik
    await storage.createCategory({
      name: "Jant & Lastik",
      slug: "jant-lastik",
      imageUrl: "https://images.unsplash.com/photo-1589756823695-278bc923f962?w=500&auto=format&fit=crop"
    });
  }

  // Seed Admin User
  const adminUsername = "asimotoibrahim71";
  const oldAdminUsername = "admin@asimoto.com";
  const oldAdminUsername2 = "asimotoibrahim12";
  
  // Check for admin by new username or old default username
  let existingAdmin = await storage.getUserByUsername(adminUsername);
  if (!existingAdmin) {
    existingAdmin = await storage.getUserByUsername(oldAdminUsername2);
  }
  if (!existingAdmin) {
    existingAdmin = await storage.getUserByUsername(oldAdminUsername);
  }
  
  // START TEMPORARY HASH GENERATION (Normally would import)
  const { scrypt, randomBytes } = await import("crypto");
  const { promisify } = await import("util");
  const scryptAsync = promisify(scrypt);
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync("asi20moto26", salt, 64)) as Buffer;
  const hash = `${buf.toString("hex")}.${salt}`;
  // END TEMPORARY
    
  if (existingAdmin) {
    // Update existing admin
    await storage.upsertUser({
      ...existingAdmin,
      username: adminUsername,
      password: hash,
      role: "admin",
      firstName: "Admin",
      lastName: "User",
      profileImageUrl: `https://ui-avatars.com/api/?name=Admin+User&background=0D8ABC&color=fff`
    });
    console.log(`Admin updated: ${adminUsername}`);
  } else {
    // Create new admin
    await storage.upsertUser({
      username: adminUsername,
      email: "admin@asimoto.com", // Keeping email as fallback/required field
      password: hash,
      role: "admin",
      firstName: "Admin",
      lastName: "User",
      profileImageUrl: `https://ui-avatars.com/api/?name=Admin+User&background=0D8ABC&color=fff`
    });
    console.log(`Admin created: ${adminUsername}`);
  }
}
