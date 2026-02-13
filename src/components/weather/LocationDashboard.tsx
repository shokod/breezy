'use client';

import { useState, useEffect } from 'react';
import styles from './LocationDashboard.module.css';
import { useLocations, usePreferences, useSyncWeather, useUpdateLocation, useDeleteLocation, ExtendedLocation } from '@/hooks/useWeather';
import AppShell from '../layout/AppShell';
import CurrentWeatherPanel from './CurrentWeatherPanel';
import ForecastStrip from './ForecastStrip';
import TodaysHighlights from './TodaysHighlights';
import PreferencesModal from './PreferencesModal';
import AddLocationModal from './AddLocationModal';

export default function LocationDashboard() {
    const { data: locations, isLoading: locationsLoading, isError } = useLocations();
    const { data: preferences } = usePreferences();
    const syncMutation = useSyncWeather();
    const updateMutation = useUpdateLocation();
    const deleteMutation = useDeleteLocation();

    // UI State
    const [selectedLocationId, setSelectedLocationId] = useState<number | null>(null);
    const [showSettings, setShowSettings] = useState(false);
    const [showAddLocation, setShowAddLocation] = useState(false);
    const [addLocationInitialCity, setAddLocationInitialCity] = useState('');

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

    const selectedLocation = locations?.find((l: ExtendedLocation) => l.id === selectedLocationId);
    const hasLocations = locations && locations.length > 0;

    return (
        <AppShell
            locations={locations || []}
            selectedLocationId={selectedLocationId}
            onSelectLocation={setSelectedLocationId}
            onAddLocation={() => setShowAddLocation(true)}
            onOpenSettings={() => setShowSettings(true)}
            units={units}
        >
            {locationsLoading ? (
                <div className={styles.loading}>Loading Breezy...</div>
            ) : isError ? (
                <div className={styles.error}>Failed to load locations.</div>
            ) : hasLocations && selectedLocation && selectedLocation.latestWeather ? (
                <div className={styles.dashboardGrid}>
                    <div className={styles.leftPanel}>
                        <CurrentWeatherPanel
                            weather={selectedLocation.latestWeather}
                            locationName={selectedLocation.name}
                            isFavorite={selectedLocation.isFavorite}
                            units={units}
                            onSearch={(query) => {
                                setAddLocationInitialCity(query);
                                setShowAddLocation(true);
                            }}
                            onToggleFavorite={() => {
                                updateMutation.mutate({
                                    id: selectedLocation.id,
                                    isFavorite: !selectedLocation.isFavorite
                                });
                            }}
                            onDelete={() => {
                                if (confirm(`Remove ${selectedLocation.name}?`)) {
                                    const nextId = locations?.find((l: ExtendedLocation) => l.id !== selectedLocation.id)?.id || null;
                                    deleteMutation.mutate(selectedLocation.id, {
                                        onSuccess: () => setSelectedLocationId(nextId)
                                    });
                                }
                            }}
                        />
                    </div>
                    <div className={styles.rightPanel}>
                        <ForecastStrip
                            location={selectedLocation}
                            units={units}
                        />
                        <TodaysHighlights
                            weather={selectedLocation.latestWeather}
                            units={units}
                        />
                    </div>
                </div>
            ) : (
                <div className={styles.emptyState}>
                    <h1>Welcome to Breezy</h1>
                    <p>Add your first city to get started.</p>
                    <button onClick={() => setShowAddLocation(true)} className={styles.btnPrimary}>
                        + Add City
                    </button>
                    {hasLocations && !selectedLocation?.latestWeather && (
                        <button onClick={() => syncMutation.mutate()} className={styles.btn} style={{ marginTop: '1rem' }}>
                            Force Sync Data
                        </button>
                    )}
                </div>
            )}

            {showSettings && <PreferencesModal onClose={() => setShowSettings(false)} />}
            {showAddLocation && (
                <AddLocationModal
                    onClose={() => {
                        setShowAddLocation(false);
                        setAddLocationInitialCity('');
                    }}
                    initialCity={addLocationInitialCity}
                />
            )}
        </AppShell>
    );
}
