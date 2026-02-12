'use client';

import styles from './WeatherCard.module.css';
import { useUpdateLocation, useDeleteLocation } from '@/hooks/useWeather';
import type { Location } from '@/../database/schema';

interface WeatherCardProps {
    location: Location;
}

export default function WeatherCard({ location }: WeatherCardProps) {
    const updateMutation = useUpdateLocation();
    const deleteMutation = useDeleteLocation();

    const toggleFavorite = () => {
        updateMutation.mutate({
            id: location.id,
            isFavorite: !location.isFavorite
        });
    };

    const removeLocation = () => {
        if (confirm(`Remove ${location.name}?`)) {
            deleteMutation.mutate(location.id);
        }
    };

    return (
        <div className={`${styles.card} ${location.isFavorite ? styles.favorite : ''}`}>
            <div className={styles.header}>
                <div>
                    <h3 className={styles.name}>{location.name}</h3>
                    <p className={styles.country}>{location.country}</p>
                </div>
                <button
                    onClick={toggleFavorite}
                    className={styles.favBtn}
                    disabled={updateMutation.isPending}
                >
                    {location.isFavorite ? '★' : '☆'}
                </button>
            </div>

            <div className={styles.footer}>
                <button
                    onClick={removeLocation}
                    className={styles.deleteBtn}
                    disabled={deleteMutation.isPending}
                >
                    {deleteMutation.isPending ? 'Removing...' : 'Remove'}
                </button>
            </div>
        </div>
    );
}
