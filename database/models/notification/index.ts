import DBModel from "../../../src/libs/database/model_instance";
import { serial, mysqlTable, varchar, timestamp, json, boolean } from "drizzle-orm/mysql-core";

export const TABLE_NAME = 'notifications';

export const notification = mysqlTable(TABLE_NAME, {
    id: serial('id').primaryKey(),
    user: varchar('model_uuid', { length: 255 }),
    model: varchar('model', { length: 400 }).notNull(),
    type: varchar('type', { length: 400 }).notNull(),
    data: json('data'),
    read: boolean('read').default(false),
    created_at: timestamp('created_at').defaultNow(),
    updated_at: timestamp('updated_at').defaultNow().onUpdateNow(),
});

export const NOTIFICATION = async () => await new DBModel(TABLE_NAME, notification).getModel();