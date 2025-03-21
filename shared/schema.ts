import { pgTable, text, serial, integer, boolean, timestamp, pgEnum, foreignKey } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Enumerações
export const roleEnum = pgEnum('role', ['user', 'admin']);
export const bookFormatEnum = pgEnum('book_format', ['epub', 'pdf', 'both']);
export const readingStatusEnum = pgEnum('reading_status', ['to_read', 'reading', 'completed']);

// Usuários
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  role: roleEnum('role').default('user').notNull(),
  avatarUrl: text("avatar_url"),
  bio: text("bio"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  name: true,
  role: true,
  avatarUrl: true,
  bio: true,
});

// Categorias
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  slug: text("slug").notNull().unique(),
  iconName: text("icon_name").notNull(),
  description: text("description"),
  bookCount: integer("book_count").default(0).notNull(),
});

export const insertCategorySchema = createInsertSchema(categories).pick({
  name: true,
  slug: true,
  iconName: true,
  description: true,
  bookCount: true,
});

// Autores
export const authors = pgTable("authors", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  bio: text("bio"),
  imageUrl: text("image_url"),
  birthYear: integer("birth_year"),
  deathYear: integer("death_year"),
  nationality: text("nationality"),
});

export const insertAuthorSchema = createInsertSchema(authors).pick({
  name: true,
  slug: true,
  bio: true,
  imageUrl: true,
  birthYear: true,
  deathYear: true,
  nationality: true,
});

// Livros
export const books = pgTable("books", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  authorId: integer("author_id").notNull(),
  categoryId: integer("category_id").notNull(),
  description: text("description").notNull(),
  coverUrl: text("cover_url").notNull(),
  epubUrl: text("epub_url"),
  pdfUrl: text("pdf_url"),
  format: bookFormatEnum('format').default('both').notNull(),
  pageCount: integer("page_count"),
  isbn: text("isbn"),
  publishYear: integer("publish_year"),
  language: text("language").default("pt-BR").notNull(),
  rating: integer("rating").default(0),
  ratingCount: integer("rating_count").default(0),
  downloadCount: integer("download_count").default(0),
  isFeatured: boolean("is_featured").default(false),
  isPublicDomain: boolean("is_public_domain").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertBookSchema = createInsertSchema(books).pick({
  title: true,
  slug: true,
  authorId: true,
  categoryId: true,
  description: true,
  coverUrl: true,
  epubUrl: true,
  pdfUrl: true,
  format: true,
  pageCount: true,
  isbn: true,
  publishYear: true,
  language: true,
  isFeatured: true,
  isPublicDomain: true,
});

// Lista de Leitura
export const readingList = pgTable("reading_list", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  bookId: integer("book_id").notNull(),
  status: readingStatusEnum("status").default("to_read").notNull(),
  addedAt: timestamp("added_at").defaultNow().notNull(),
  startedAt: timestamp("started_at"),
  finishedAt: timestamp("finished_at"),
});

export const insertReadingListSchema = createInsertSchema(readingList).pick({
  userId: true,
  bookId: true,
  status: true,
});

// Favoritos
export const favorites = pgTable("favorites", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  bookId: integer("book_id").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertFavoriteSchema = createInsertSchema(favorites).pick({
  userId: true,
  bookId: true,
});

// Histórico de leitura
export const readingHistory = pgTable("reading_history", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  bookId: integer("book_id").notNull(),
  progress: integer("progress").default(0).notNull(),
  lastReadAt: timestamp("last_read_at").defaultNow().notNull(),
  isCompleted: boolean("is_completed").default(false),
  totalTimeRead: integer("total_time_read").default(0), // em minutos
});

export const insertReadingHistorySchema = createInsertSchema(readingHistory).pick({
  userId: true,
  bookId: true,
  progress: true,
  isCompleted: true,
  totalTimeRead: true,
});

// Comentários
export const comments = pgTable("comments", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  bookId: integer("book_id").notNull(),
  content: text("content").notNull(),
  rating: integer("rating").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  isApproved: boolean("is_approved").default(true),
  helpfulCount: integer("helpful_count").default(0),
});

export const insertCommentSchema = createInsertSchema(comments).pick({
  userId: true,
  bookId: true,
  content: true,
  rating: true,
  isApproved: true,
});

// Configurações do site
export const siteSettings = pgTable("site_settings", {
  id: serial("id").primaryKey(),
  // Informações básicas
  siteName: text("site_name").notNull().default("Elexandria"),
  siteDescription: text("site_description").notNull().default("Sua biblioteca digital de livros em domínio público"),
  primaryColor: text("primary_color").notNull().default("#2563eb"),
  accentColor: text("accent_color").notNull().default("#3b82f6"),
  darkMode: boolean("dark_mode").default(true),
  logoUrl: text("logo_url"),
  faviconUrl: text("favicon_url"),

  // SEO
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  metaKeywords: text("meta_keywords"),
  ogImage: text("og_image"),

  // Configurações de Email
  emailFrom: text("email_from"),
  emailContact: text("email_contact"),

  // Redes Sociais
  facebookUrl: text("facebook_url"),
  twitterUrl: text("twitter_url"),
  instagramUrl: text("instagram_url"),

  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertSettingsSchema = createInsertSchema(siteSettings).pick({
  siteName: true,
  siteDescription: true,
  primaryColor: true,
  accentColor: true,
  darkMode: true,
  logoUrl: true,
  faviconUrl: true,
  metaTitle: true,
  metaDescription: true,
  metaKeywords: true,
  ogImage: true,
  emailFrom: true,
  emailContact: true,
  facebookUrl: true,
  twitterUrl: true,
  instagramUrl: true,
});

// Tipos exportados
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type Category = typeof categories.$inferSelect;

export type InsertAuthor = z.infer<typeof insertAuthorSchema>;
export type Author = typeof authors.$inferSelect;

export type InsertBook = z.infer<typeof insertBookSchema>;
export type Book = typeof books.$inferSelect;

export type InsertReadingList = z.infer<typeof insertReadingListSchema>;
export type ReadingList = typeof readingList.$inferSelect;

export type InsertFavorite = z.infer<typeof insertFavoriteSchema>;
export type Favorite = typeof favorites.$inferSelect;

export type InsertReadingHistory = z.infer<typeof insertReadingHistorySchema>;
export type ReadingHistory = typeof readingHistory.$inferSelect;

export type InsertComment = z.infer<typeof insertCommentSchema>;
export type Comment = typeof comments.$inferSelect;

export type InsertSettings = z.infer<typeof insertSettingsSchema>;
export type SiteSettings = typeof siteSettings.$inferSelect;