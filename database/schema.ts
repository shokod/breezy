import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';

export const locations = sqliteTable('locations', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    name: text('name').notNull(),
    country: text('country').notNull(),
    lat: real('lat').notNull(),
    lon: real('lon').notNull(),
    isFavorite: integer('is_favorite', { mode: 'boolean' }).default(false).notNull(),
    createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()).notNull(),
});

export const weatherSnapshots = sqliteTable('weather_snapshots', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    locationId: integer('location_id')
        .notNull()
        .references(() => locations.id, { onDelete: 'cascade' }),
    temp: real('temp').notNull(),
    feelsLike: real('feels_like'),
    description: text('description').notNull(),
    icon: text('icon').notNull(),
    humidity: integer('humidity'),
    windSpeed: real('wind_speed'),
    pressure: integer('pressure'),
    timestamp: integer('timestamp', { mode: 'timestamp' }).$defaultFn(() => new Date()).notNull(),
});

export const userPreferences = sqliteTable('user_preferences', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    units: text('units', { enum: ['metric', 'imperial', 'standard'] }).default('metric').notNull(),
    refreshIntervalMinutes: integer('refresh_interval_minutes').default(30).notNull(),
    lastGlobalSyncAt: integer('last_global_sync_at', { mode: 'timestamp' }),
});

export type Location = typeof locations.$inferSelect;
export type NewLocation = typeof locations.$inferInsert;
export type WeatherSnapshot = typeof weatherSnapshots.$inferSelect;
export type NewWeatherSnapshot = typeof weatherSnapshots.$inferInsert;
export type UserPreference = typeof userPreferences.$inferSelect;
