import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from '@/../database/schema';

let _db: ReturnType<typeof drizzle<typeof schema>> | null = null;

function getDb() {
    if (!_db) {
        const client = createClient({ url: 'file:./data/sqlite.db' });
        _db = drizzle(client, { schema });
    }
    return _db;
}

export const db = new Proxy({} as ReturnType<typeof drizzle<typeof schema>>, {
    get(_, prop) {
        return (getDb() as unknown as Record<string | symbol, unknown>)[prop];
    },
});

export type DBSchema = typeof schema;
