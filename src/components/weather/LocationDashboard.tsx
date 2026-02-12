'use client';

import styles from './LocationDashboard.module.css';
import WeatherCard from './WeatherCard';
import AddLocationForm from './AddLocationForm';
import SyncButton from './SyncButton';
import { useLocations } from '@/hooks/useWeather';
import type { Location } from '@/../database/schema';

export default function LocationDashboard() {
    const { data: locations, isLoading, isError } = useLocations();

    if (isLoading) return <div className={styles.loading}>Loading your weather...</div>;
    if (isError) return <div className={styles.error}>Failed to load locations.</div>;

    return (
        <div className={styles.container}>
            <div className={styles.actions}>
                <AddLocationForm />
                <SyncButton />
            </div>

            <div className={styles.grid}>
                {!locations || locations.length === 0 ? (
                    <div className={styles.empty}>No locations tracked yet. Add one above!</div>
                ) : (
                    locations.map((loc: Location) => (
                        <WeatherCard key={loc.id} location={loc} />
                    ))
                )}
            </div>
        </div>
    );
}
