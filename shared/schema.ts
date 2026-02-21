import { pgTable, text, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { users } from "./models/auth";
export * from "./models/auth";

export const categories = pgTable("categories", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  imageUrl: text("image_url").notNull(),
});

export const products = pgTable("products", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: integer("price").notNull(), // in cents/kurus
  imageUrl: text("image_url").notNull(), // Kept for backward compatibility/thumbnail
  images: text("images").notNull().default('[]'), // Stores JSON array of all media URLs
  categoryId: integer("category_id").references(() => categories.id),
  brand: text("brand").notNull().default(''), 
  model: text("model").notNull().default(''),
  year: integer("year"),
  isFeatured: boolean("is_featured").default(false),
  stock: integer("stock").default(0),
});

export const favorites = pgTable("favorites", {
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  productId: integer("product_id")
    .notNull()
    .references(() => products.id),
});

export const messages = pgTable("messages", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const motorcycles = pgTable("motorcycles", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  brand: text("brand").notNull(),
  model: text("model").notNull(),
  price: integer("price").notNull(), // in cents/kurus
  city: text("city").notNull(),
  district: text("district").notNull(),
  neighborhood: text("neighborhood").notNull(),
  listingDate: timestamp("listing_date").defaultNow(),
  type: text("type").notNull(), // SuperSport, Chopper, etc.
  year: integer("year").notNull(),
  km: integer("km").notNull(),
  engineVolume: text("engine_volume").notNull(),
  color: text("color").notNull(),
  heavyDamage: boolean("heavy_damage").default(false),
  description: text("description").notNull(),
  images: text("images").notNull().default('[]'),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertCategorySchema = createInsertSchema(categories);
export const insertProductSchema = createInsertSchema(products);
export const insertMotorcycleSchema = createInsertSchema(motorcycles).omit({
  createdAt: true,
});
export const insertMessageSchema = createInsertSchema(messages).omit({
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
