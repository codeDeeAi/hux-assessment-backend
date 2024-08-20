import DBModel from "../../../src/libs/database/model_instance";
import { serial, mysqlTable, varchar, json, timestamp, text, boolean } from "drizzle-orm/mysql-core";

export const TABLE_NAME = 'personal_access_tokens';

export const personal_access_token = mysqlTable(TABLE_NAME, {
    id: serial('id').primaryKey(),
    identifier: varchar('identifier', { length: 255 }).notNull(),
    token: varchar('token', { length: 400 }).notNull().unique(),
    belongs_to: varchar('belongs_to', {  length: 36 }).notNull(),
    device_fingerprint: text('device_fingerprint'),
    abilities: json('abilities'),
    can_expire: boolean('can_expire').default(true),
    expires_at: timestamp('expires_at'),
    created_at: timestamp('created_at').defaultNow(),
    updated_at: timestamp('updated_at').defaultNow().onUpdateNow(),
});

export const PERSONAL_ACCESS_TOKEN = async () => await new DBModel(TABLE_NAME, personal_access_token).getModel();