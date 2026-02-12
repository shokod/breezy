import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from '@/../database/schema';

const client = createClient({ url: 'file:sqlite.db' });
export const db = drizzle(client, { schema });
export type DBSchema = typeof schema;
