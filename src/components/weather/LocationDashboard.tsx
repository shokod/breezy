'use client';

import { useState, useEffect } from 'react';
import styles from './LocationDashboard.module.css';
import { useLocations, usePreferences, useSyncWeather } from '@/hooks/useWeather';
import type { Location } from '@/../database/schema';
import WeatherCard, { ExtendedLocation } from './WeatherCard';
import AddLocationForm from './AddLocationForm';
import SyncButton from './SyncButton';
import PreferencesModal from './PreferencesModal';

export default function LocationDashboard() {
    const { data: locations, isLoading: locationsLoading, isError } = useLocations();
    const { data: preferences } = usePreferences();
    const syncMutation = useSyncWeather();
    const [showSettings, setShowSettings] = useState(false);

    // Background Sync
    useEffect(() => {
        if (!preferences?.refreshIntervalMinutes) return;

        const intervalMs = preferences.refreshIntervalMinutes * 60 * 1000;
        const intervalId = setInterval(() => {
            syncMutation.mutate();
        }, intervalMs);

        return () => clearInterval(intervalId);
    }, [preferences?.refreshIntervalMinutes, syncMutation]);

    if (locationsLoading) return <div className={styles.loading}>Loading your weather...</div>;
    if (isError) return <div className={styles.error}>Failed to load locations.</div>;

    const units = preferences?.units || 'metric';

    return (
        <div className={styles.container}>
            <div className={styles.actions}>
                <button
                    className={styles.settingsBtn}
                    onClick={() => setShowSettings(true)}
                    title="Settings"
                >
                    ⚙️
                </button>
                <AddLocationForm />
                <SyncButton />
            </div>

            <div className={styles.grid}>
                {!locations || locations.length === 0 ? (
                    <div className={styles.empty}>No locations tracked yet. Add one above!</div>
                ) : (
                    locations.map((loc: ExtendedLocation) => (
                        <WeatherCard key={loc.id} location={loc} units={units} />
                    ))
                )}
            </div>

            {showSettings && <PreferencesModal onClose={() => setShowSettings(false)} />}
        </div>
    );
}
