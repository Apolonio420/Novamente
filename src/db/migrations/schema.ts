import { sql } from "drizzle-orm";
import { integer, sqliteTable, text, real } from "drizzle-orm/sqlite-core";

export const runs = sqliteTable("runs", {
  run_id: text("run_id").notNull().primaryKey(),
  user_id: text("user_id").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).default(
    sql`(strftime('%s', 'now'))`,
  ),
  image_url: text("image_url"),
  inputs: text("inputs", { mode: "json" }).$type<Record<string, any>>(),
  live_status: text("live_status"),
  progress: real("progress"),
  deployment_id: text("deployment_id"),
}); 