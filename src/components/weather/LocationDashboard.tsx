'use client';

import { useState, useEffect } from 'react';
import styles from './LocationDashboard.module.css';
import WeatherCard from './WeatherCard';
import AddLocationForm from './AddLocationForm';
import SyncButton from './SyncButton';
import type { Location } from '../../../database/schema';

export default function LocationDashboard() {
    const [locations, setLocations] = useState<Location[]>([]);
    const [loading, setLoading] = useState(true);
    const [lastSync, setLastSync] = useState<string | null>(null);

    const fetchLocations = async () => {
        try {
            const res = await fetch('/api/locations');
            if (res.ok) {
                const data = await res.json();
                setLocations(data);
            }
        } catch (error) {
            console.error('Failed to fetch locations:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLocations();
    }, []);

    if (loading) return <div className={styles.loading}>Loading your weather...</div>;

    return (
        <div className={styles.container}>
            <div className={styles.actions}>
                <AddLocationForm onAdd={fetchLocations} />
                <SyncButton onSync={fetchLocations} setLastSync={setLastSync} />
            </div>

            {lastSync && <div className={styles.syncInfo}>Last synced: {lastSync}</div>}

            <div className={styles.grid}>
                {locations.length === 0 ? (
                    <div className={styles.empty}>No locations tracked yet. Add one above!</div>
                ) : (
                    locations.map((loc) => (
                        <WeatherCard
                            key={loc.id}
                            location={loc}
                            onDelete={fetchLocations}
                            onUpdate={fetchLocations}
                        />
                    ))
                )}
            </div>
        </div>
    );
}
