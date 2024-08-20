import DBModel from '../../../src/libs/database/model_instance';
import { mysqlTable, serial, text, varchar, timestamp, boolean } from 'drizzle-orm/mysql-core';

export const TABLE_NAME = 'admin_permissions';

export const admin_permission = mysqlTable(TABLE_NAME, {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  tag: varchar('tag', { length: 255 }).notNull(),
  identifier: varchar('identifier', { length: 400 }).unique(),
  description: text('description'),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow().onUpdateNow(),
});

export const ADMIN_PERMISSION = async () => await new DBModel(TABLE_NAME, admin_permission).getModel();