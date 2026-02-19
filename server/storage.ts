import { db } from "./db";
import {
  users, categories, products, messages,
  type User, type UpsertUser,
  type Category, type InsertCategory,
  type Product, type InsertProduct,
  type Motorcycle, type InsertMotorcycle,
  type Message, type InsertMessage,
  favorites, motorcycles, insertMotorcycleSchema // Added insertMotorcycleSchema
} from "@shared/schema";
import { eq, desc, sql } from "drizzle-orm";
import { authStorage, type IAuthStorage } from "./replit_integrations/auth/storage"; // Import auth storage

export interface IStorage extends IAuthStorage {
  // Categories
  getCategories(): Promise<Category[]>;
  getCategory(id: number): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;

  // Products
  // Products
  getProducts(categoryId?: number, brand?: string, search?: string, sort?: string, minPrice?: number, maxPrice?: number): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: number): Promise<void>;

  // Favorites
  getFavorites(userId: string): Promise<Product[]>;
  toggleFavorite(userId: string, productId: number): Promise<boolean>;

  // Messages
  createMessage(message: InsertMessage): Promise<Message>;
  getMessages(): Promise<Message[]>;

  // Motorcycles
  getMotorcycles(filters?: any): Promise<Motorcycle[]>;
  getMotorcycle(id: number): Promise<Motorcycle | undefined>;
  createMotorcycle(motorcycle: InsertMotorcycle): Promise<Motorcycle>;
  deleteMotorcycle(id: number): Promise<void>;
  updateMotorcycle(id: number, motorcycle: Partial<InsertMotorcycle>): Promise<Motorcycle | undefined>;
}

export class DatabaseStorage implements IStorage {
  // Auth methods delegated to authStorage
  getUser(id: string): Promise<User | undefined> {
    return authStorage.getUser(id);
  }
  upsertUser(user: UpsertUser): Promise<User> {
    return authStorage.upsertUser(user);
  }
  getUserByUsername(username: string): Promise<User | undefined> {
    return authStorage.getUserByUsername(username);
  }

  // Categories
  async getCategories(): Promise<Category[]> {
    return await db.select().from(categories);
  }
  async getCategory(id: number): Promise<Category | undefined> {
    const [category] = await db.select().from(categories).where(eq(categories.id, id));
    return category;
  }
  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const [category] = await db.insert(categories).values(insertCategory).returning();
    return category;
  }

  // Products
  async getProducts(categoryId?: number, brand?: string, search?: string, sort?: string, minPrice?: number, maxPrice?: number): Promise<Product[]> {
    let query = db.select().from(products);
    const conditions = [];

    if (categoryId) conditions.push(eq(products.categoryId, categoryId));
    if (brand) conditions.push(eq(products.brand, brand));
    if (search) conditions.push(sql`(${products.name} LIKE ${`%${search}%`} OR ${products.description} LIKE ${`%${search}%`})`);
    if (minPrice !== undefined) conditions.push(sql`${products.price} >= ${minPrice}`);
    if (maxPrice !== undefined) conditions.push(sql`${products.price} <= ${maxPrice}`);

    if (conditions.length > 0) {
      // @ts-ignore
      query = query.where(sql.join(conditions, sql` AND `));
    }
    
    if (sort === "newest") {
      // @ts-ignore
      query = query.orderBy(desc(products.id));
    } else if (sort === "oldest") {
      // @ts-ignore
      query = query.orderBy(products.id);
    } else if (sort === "price-asc") {
      // @ts-ignore
      query = query.orderBy(products.price);
    } else if (sort === "price-desc") {
      // @ts-ignore
      query = query.orderBy(desc(products.price));
    } else {
      // Default sort
      // @ts-ignore
      query = query.orderBy(desc(products.id));
    }
    
    return await query;
  }

  async getProduct(id: number): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product;
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const [product] = await db.insert(products).values(insertProduct).returning();
    return product;
  }

  async updateProduct(id: number, insertProduct: Partial<InsertProduct>): Promise<Product | undefined> {
    const [product] = await db.update(products)
      .set(insertProduct)
      .where(eq(products.id, id))
      .returning();
    return product;
  }

  async deleteProduct(id: number): Promise<void> {
    await db.delete(products).where(eq(products.id, id));
  }

  // Favorites
  async getFavorites(userId: string): Promise<Product[]> {
    return await db.select({
      id: products.id,
      name: products.name,
      description: products.description,
      price: products.price,
      imageUrl: products.imageUrl,
      categoryId: products.categoryId,
      brand: products.brand,
      model: products.model,
      year: products.year,
      isFeatured: products.isFeatured,
      stock: products.stock,
      images: products.images
    })
    .from(favorites)
    .innerJoin(products, eq(favorites.productId, products.id))
    .where(eq(favorites.userId, userId));
  }

  async toggleFavorite(userId: string, productId: number): Promise<boolean> {
    const [existing] = await db.select()
      .from(favorites)
      .where(sql`${favorites.userId} = ${userId} AND ${favorites.productId} = ${productId}`);
    
    if (existing) {
      await db.delete(favorites)
        .where(sql`${favorites.userId} = ${userId} AND ${favorites.productId} = ${productId}`);
      return false;
    } else {
      await db.insert(favorites).values({ userId, productId });
      return true;
    }
  }

  // Messages
  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const [message] = await db.insert(messages).values(insertMessage).returning();
    return message;
  }

  async getMessages(): Promise<Message[]> {
    return await db.select().from(messages).orderBy(desc(messages.createdAt));
  }

  // Motorcycles
  async getMotorcycles(filters?: any): Promise<Motorcycle[]> {
    let query = db.select().from(motorcycles);
    const conditions = [];

    if (filters) {
      if (filters.brand) conditions.push(eq(motorcycles.brand, filters.brand));
      if (filters.type) conditions.push(eq(motorcycles.type, filters.type));
      if (filters.minPrice) conditions.push(sql`${motorcycles.price} >= ${filters.minPrice}`);
      if (filters.maxPrice) conditions.push(sql`${motorcycles.price} <= ${filters.maxPrice}`);
      if (filters.minYear) conditions.push(sql`${motorcycles.year} >= ${filters.minYear}`);
      if (filters.maxYear) conditions.push(sql`${motorcycles.year} <= ${filters.maxYear}`);
      if (filters.minKm) conditions.push(sql`${motorcycles.km} >= ${filters.minKm}`);
      if (filters.maxKm) conditions.push(sql`${motorcycles.km} <= ${filters.maxKm}`);
      if (filters.city) conditions.push(eq(motorcycles.city, filters.city));
      // Add more filters as needed
    }

    if (conditions.length > 0) {
      // @ts-ignore
      query = query.where(sql.join(conditions, sql` AND `));
    }
    
    // Default sort by newest
    // @ts-ignore
    query = query.orderBy(desc(motorcycles.id));

    return await query;
  }

  async getMotorcycle(id: number): Promise<Motorcycle | undefined> {
    const [moto] = await db.select().from(motorcycles).where(eq(motorcycles.id, id));
    return moto;
  }

  async createMotorcycle(insertMotorcycle: InsertMotorcycle): Promise<Motorcycle> {
    const [moto] = await db.insert(motorcycles).values(insertMotorcycle).returning();
    return moto;
  }

  async deleteMotorcycle(id: number): Promise<void> {
    await db.delete(motorcycles).where(eq(motorcycles.id, id));
  }

  async updateMotorcycle(id: number, insertMotorcycle: Partial<InsertMotorcycle>): Promise<Motorcycle | undefined> {
    const [moto] = await db.update(motorcycles)
      .set(insertMotorcycle)
      .where(eq(motorcycles.id, id))
      .returning();
    return moto;
  }
}

export const storage = new DatabaseStorage();
