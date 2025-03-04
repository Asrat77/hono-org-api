import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "../models/position";
import * as dotenv from "dotenv";

dotenv.config();

const client = postgres({
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 5432,
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "password",
  database: process.env.DB_NAME || "postgres",
});

export const db = drizzle(client, { schema });