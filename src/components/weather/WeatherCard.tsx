'use client';

import { useState } from 'react';
import styles from './WeatherCard.module.css';
import type { Location } from '../../../database/schema';

interface WeatherCardProps {
    location: Location;
    onDelete: () => void;
    onUpdate: () => void;
}

export default function WeatherCard({ location, onDelete, onUpdate }: WeatherCardProps) {
    const [isDeleting, setIsDeleting] = useState(false);

    const toggleFavorite = async () => {
        try {
            await fetch(`/api/locations/${location.id}`, {
                method: 'PATCH',
                body: JSON.stringify({ isFavorite: !location.isFavorite }),
            });
            onUpdate();
        } catch (err) {
            console.error('Failed to toggle favorite:', err);
        }
    };

    const removeLocation = async () => {
        if (!confirm(`Remove ${location.name}?`)) return;
        setIsDeleting(true);
        try {
            const res = await fetch(`/api/locations/${location.id}`, { method: 'DELETE' });
            if (res.ok) onDelete();
        } catch (err) {
            console.error('Failed to delete:', err);
        } finally {
            setIsDeleting(false);
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
                    aria-label="Toggle favorite"
                >
                    {location.isFavorite ? '★' : '☆'}
                </button>
            </div>

            <div className={styles.footer}>
                <button
                    onClick={removeLocation}
                    className={styles.deleteBtn}
                    disabled={isDeleting}
                >
                    {isDeleting ? 'Removing...' : 'Remove'}
                </button>
            </div>
        </div>
    );
}
