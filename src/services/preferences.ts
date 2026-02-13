import { db } from '@/lib/db';
import { userPreferences } from '@/../database/schema';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

export const preferencesSchema = z.object({
    units: z.enum(['metric', 'imperial', 'standard']).optional(),
    refreshIntervalMinutes: z.number().min(5).max(1440).optional(),
});

export type PreferencesInput = z.infer<typeof preferencesSchema>;

export class PreferencesService {
    static async getPreferences() {
        let prefs = await db.select().from(userPreferences).limit(1).get();

        if (!prefs) {
            const [newPrefs] = await db.insert(userPreferences).values({
                units: 'metric',
                refreshIntervalMinutes: 30,
            }).returning();
            prefs = newPrefs;
        }

        return prefs;
    }

    static async updatePreferences(data: PreferencesInput) {
        const result = preferencesSchema.safeParse(data);

        if (!result.success) {
            throw new Error('Validation failed: ' + JSON.stringify(result.error.flatten()));
        }

        let existing = await db.select().from(userPreferences).limit(1).get();
        let updatedPrefs;

        if (existing) {
            [updatedPrefs] = await db
                .update(userPreferences)
                .set(result.data)
                .where(eq(userPreferences.id, existing.id))
                .returning();
        } else {
            [updatedPrefs] = await db.insert(userPreferences).values({
                units: result.data.units || 'metric',
                refreshIntervalMinutes: result.data.refreshIntervalMinutes || 30,
            }).returning();
        }

        return updatedPrefs;
    }
}
