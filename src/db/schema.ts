import { sql } from "drizzle-orm";
import { text, sqliteTable, integer } from "drizzle-orm/sqlite-core";

export const runs = sqliteTable('runs', {
	run_id: text('run_id').primaryKey(),
	user_id: text('user_id').notNull(),
	deployment_id: text('deployment_id').notNull(),
	live_status: text('live_status').notNull(),
	image_url: text('image_url'),
	inputs: text('inputs', { mode: 'json' }).$type<{
		prompt: string;
		height: string;
		width: string;
		lora: string;
		lora_strength: string;
	}>(),
	created_at: integer('created_at', { mode: 'timestamp' })
		.default(sql`CURRENT_TIMESTAMP`)
});

// Exportar el tipo Run basado en la tabla
export type Run = typeof runs.$inferSelect;
  