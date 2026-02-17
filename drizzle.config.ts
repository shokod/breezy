import type { Config } from 'drizzle-kit';

export default {
    schema: './database/schema.ts',
    out: './database/migrations',
    dialect: 'sqlite',
    dbCredentials: {
        url: 'file:./data/sqlite.db',
    },
} satisfies Config;
