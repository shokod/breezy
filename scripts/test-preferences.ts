
// @ts-nocheck
const fs = require('fs');
const path = require('path');

// Manually load .env.local
const envPath = path.resolve(__dirname, '../.env.local');
if (fs.existsSync(envPath)) {
    const envConfig = fs.readFileSync(envPath, 'utf8');
    envConfig.split('\n').forEach((line) => {
        const [key, value] = line.split('=');
        if (key && value) {
            process.env[key.trim()] = value.trim();
        }
    });
}

// Mock DB if needed or use real one. ideally we use the real one for integration test.
// We need to import the service.
// Since we are running with tsx, we can import ts files.
// We use relative paths to avoid tsconfig alias issues if tsx doesn't pick them up.

import { PreferencesService } from '../src/services/preferences';
import { db } from '../src/lib/db';
import { userPreferences } from '../database/schema';
import { eq } from 'drizzle-orm';

async function runTests() {
    console.log('Starting PreferencesService Tests...');

    try {
        // Test 1: Get Preferences (should create default if missing)
        console.log('Test 1: getPreferences');
        const prefs = await PreferencesService.getPreferences();
        console.log('Current Preferences:', prefs);

        if (!prefs) throw new Error('Failed to get preferences');
        if (prefs.units !== 'metric' && prefs.units !== 'imperial' && prefs.units !== 'standard') throw new Error('Invalid units');

        // Test 2: Update Preferences
        console.log('\nTest 2: updatePreferences');
        const newInterval = prefs.refreshIntervalMinutes === 30 ? 60 : 30;
        const newUnits = prefs.units === 'metric' ? 'imperial' : 'metric';

        const updated = await PreferencesService.updatePreferences({
            refreshIntervalMinutes: newInterval,
            units: newUnits
        });
        console.log('Updated Preferences:', updated);

        if (updated.refreshIntervalMinutes !== newInterval) throw new Error('Refresh interval update failed');
        if (updated.units !== newUnits) throw new Error('Units update failed');

        // Verify update persisted
        const verify = await PreferencesService.getPreferences();
        if (verify.refreshIntervalMinutes !== newInterval) throw new Error('Update not persisted');

        // Test 3: Validation Error
        console.log('\nTest 3: Validation Error Handling');
        try {
            await PreferencesService.updatePreferences({
                refreshIntervalMinutes: 1 // Too small, min is 5
            });
            throw new Error('Validation should have failed');
        } catch (e: any) {
            if (e.message.includes('Validation failed')) {
                console.log('Caught expected validation error:', e.message);
            } else {
                throw e;
            }
        }

        console.log('\nAll tests passed!');
    } catch (error) {
        console.error('Test Failed:', error);
        process.exit(1);
    }
}

runTests();
