import DBModel from "../../../src/libs/database/model_instance";
import { serial, mysqlTable, varchar, json, timestamp, text, bigint } from "drizzle-orm/mysql-core";

export const TABLE_NAME = 'media';

export const media = mysqlTable(TABLE_NAME, {
    id: serial('id').primaryKey(),
    type: varchar('type', { length: 255 }).notNull(),
    model: text('model').notNull(),
    model_id: bigint('model_id', { mode: 'number', unsigned: true }),
    model_uuid: varchar('model_uuid', { length: 36 }),
    media: json('media'),
    created_at: timestamp('created_at').defaultNow(),
    updated_at: timestamp('updated_at').defaultNow().onUpdateNow(),
});

export const MEDIA = async () => await new DBModel(TABLE_NAME, media).getModel();