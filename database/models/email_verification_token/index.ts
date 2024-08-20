import DBModel from "../../../src/libs/database/model_instance";
import { serial, mysqlTable, varchar, timestamp, text, datetime } from "drizzle-orm/mysql-core";

export const TABLE_NAME = 'email_verification_tokens';

export const email_verification_token = mysqlTable(TABLE_NAME, {
    id: serial('id').primaryKey(),
    user: varchar('model_uuid', {  length: 36 }),
    code: varchar('code', { length: 100 }).notNull().unique(),
    token: text('token').notNull(),
    expires_at: datetime('expires_at').notNull(),
    created_at: timestamp('created_at').defaultNow(),
    updated_at: timestamp('updated_at').defaultNow().onUpdateNow(),
});

export const EMAIL_VERIFICATION_TOKEN = async () => await new DBModel(TABLE_NAME, email_verification_token).getModel();