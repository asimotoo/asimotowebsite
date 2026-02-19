import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { users } from "./models/auth";
export * from "./models/auth";

export const categories = sqliteTable("categories", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  imageUrl: text("image_url").notNull(),
});

export const products = sqliteTable("products", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: integer("price").notNull(), // in cents/kurus
  imageUrl: text("image_url").notNull(), // Kept for backward compatibility/thumbnail
  images: text("images").notNull().default('[]'), // Stores JSON array of all media URLs
  categoryId: integer("category_id").references(() => categories.id),
  brand: text("brand").notNull().default(''), // Default to empty string to prevent migration issues if possible, or just notNull if we strictly reseed
  model: text("model").notNull().default(''),
  year: integer("year"),
  isFeatured: integer("is_featured", { mode: "boolean" }).default(false),
  stock: integer("stock").default(0),
});

export const favorites = sqliteTable("favorites", {
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  productId: integer("product_id")
    .notNull()
    .references(() => products.id),
});

export const messages = sqliteTable("messages", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  message: text("message").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).default(new Date()),
});

export const motorcycles = sqliteTable("motorcycles", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  brand: text("brand").notNull(),
  model: text("model").notNull(),
  price: integer("price").notNull(), // in cents/kurus
  city: text("city").notNull(),
  district: text("district").notNull(),
  neighborhood: text("neighborhood").notNull(),
  listingDate: integer("listing_date", { mode: "timestamp" }).default(new Date()),
  type: text("type").notNull(), // SuperSport, Chopper, etc.
  year: integer("year").notNull(),
  km: integer("km").notNull(),
  engineVolume: text("engine_volume").notNull(),
  color: text("color").notNull(),
  heavyDamage: integer("heavy_damage", { mode: "boolean" }).default(false),
  description: text("description").notNull(),
  images: text("images").notNull().default('[]'),
  createdAt: integer("created_at", { mode: "timestamp" }).default(new Date()),
});

export const insertCategorySchema = createInsertSchema(categories).omit({
  id: true,
});
export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
});
export const insertMotorcycleSchema = createInsertSchema(motorcycles).omit({
  id: true,
  createdAt: true,
});
export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  createdAt: true,
});
export const insertFavoriteSchema = createInsertSchema(favorites);

export type Category = typeof categories.$inferSelect;
export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Motorcycle = typeof motorcycles.$inferSelect;
export type InsertMotorcycle = z.infer<typeof insertMotorcycleSchema>;
export type Message = typeof messages.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Favorite = typeof favorites.$inferSelect;
export type InsertFavorite = z.infer<typeof insertFavoriteSchema>;
