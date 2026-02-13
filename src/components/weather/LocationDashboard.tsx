'use client';

import { useState, useEffect } from 'react';
import styles from './LocationDashboard.module.css';
import { useLocations, usePreferences, useSyncWeather, ExtendedLocation } from '@/hooks/useWeather';
import AppShell from '../layout/AppShell';
import WeatherHero from './WeatherHero';
import WeatherDetails from './WeatherDetails';
import PreferencesModal from './PreferencesModal';
import AddLocationModal from './AddLocationModal';

export default function LocationDashboard() {
    const { data: locations, isLoading: locationsLoading, isError } = useLocations();
    const { data: preferences } = usePreferences();
    const syncMutation = useSyncWeather();

    // UI State
    const [selectedLocationId, setSelectedLocationId] = useState<number | null>(null);
    const [showSettings, setShowSettings] = useState(false);
    const [showAddLocation, setShowAddLocation] = useState(false);

    // Initial Selection
    useEffect(() => {
        if (locations && locations.length > 0 && selectedLocationId === null) {
            setSelectedLocationId(locations[0].id);
        }
    }, [locations, selectedLocationId]);

    // Background Sync
    useEffect(() => {
        if (!preferences?.refreshIntervalMinutes) return;

        const intervalMs = preferences.refreshIntervalMinutes * 60 * 1000;
        const intervalId = setInterval(() => {
            syncMutation.mutate();
        }, intervalMs);

        return () => clearInterval(intervalId);
    }, [preferences?.refreshIntervalMinutes, syncMutation]);

    const units = preferences?.units || 'metric';

    // Determine basic condition for background
    // If loading, we don't have a selected location yet, so let it be undefined (handled by AppShell/CSS)
    const selectedLocation = locations?.find((l: ExtendedLocation) => l.id === selectedLocationId);
    const hasLocations = locations && locations.length > 0;

    // Day/Night logic (placeholder)
    const isDay = true;
    const weatherCondition = selectedLocation?.latestWeather?.description;

    return (
        <AppShell
            locations={locations || []}
            selectedLocationId={selectedLocationId}
            onSelectLocation={setSelectedLocationId}
            onAddLocation={() => setShowAddLocation(true)}
            onOpenSettings={() => setShowSettings(true)}
            units={units}
        >
            <div className="mb-8 border-b border-[var(--card-border)] pb-6">
                <h1 className="text-3xl font-bold text-[var(--foreground)]">Breezy Weather</h1>
                <p className="text-[var(--text-secondary)]">Track and manage your favorite city forecasts</p>
            </div>

            {locationsLoading ? (
                <div className={styles.loading}>Loading Breezy...</div>
            ) : isError ? (
                <div className={styles.error}>Failed to load locations.</div>
            ) : hasLocations && selectedLocation ? (
                <>
                    {selectedLocation.latestWeather ? (
                        <>
                            <WeatherHero
                                locationName={selectedLocation.name}
                                weather={selectedLocation.latestWeather}
                                units={units}
                            />
                            <WeatherDetails
                                weather={selectedLocation.latestWeather}
                                units={units}
                            />
                        </>
                    ) : (
                        <div className={styles.emptyState}>
                            <h2>No Data Available</h2>
                            <p>Waiting for weather data to sync...</p>
                            <button onClick={() => syncMutation.mutate()} className={styles.btn}>
                                Try Syncing Now
                            </button>
                        </div>
                    )}
                </>
            ) : (
                <div className={styles.emptyState}>
                    <h1>Welcome to Breezy</h1>
                    <p>Add your first city to get started.</p>
                    <button onClick={() => setShowAddLocation(true)} className={styles.btnPrimary}>
                        + Add City
                    </button>
                </div>
            )}

            {showSettings && <PreferencesModal onClose={() => setShowSettings(false)} />}
            {showAddLocation && <AddLocationModal onClose={() => setShowAddLocation(false)} />}
        </AppShell>
    );
}
