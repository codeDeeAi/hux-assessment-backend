import DBModel from "../../../src/libs/database/model_instance";
import { serial, mysqlTable, varchar, json, timestamp } from "drizzle-orm/mysql-core";

export const TABLE_NAME = 'currencies';

export const currency = mysqlTable(TABLE_NAME, {
    id: serial('id').primaryKey(),
    iso: varchar('iso', { length: 3 }).notNull().unique(),
    name: varchar('name', { length: 400 }).notNull().unique(),
    details: json('details'),
    created_at: timestamp('created_at').defaultNow(),
    updated_at: timestamp('updated_at').defaultNow().onUpdateNow(),
});

export const CURRENCY = async () => await new DBModel(TABLE_NAME, currency).getModel();