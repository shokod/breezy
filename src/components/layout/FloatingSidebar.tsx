import { useState } from 'react';
import styles from './FloatingSidebar.module.css';
import { ExtendedLocation } from '@/hooks/useWeather';

interface FloatingSidebarProps {
    locations: ExtendedLocation[];
    selectedLocationId: number | null;
    onSelectLocation: (id: number) => void;
    onAddLocation: () => void;
    onOpenSettings: () => void;
    units: 'metric' | 'imperial' | 'standard';
}

export default function FloatingSidebar({
    locations,
    selectedLocationId,
    onSelectLocation,
    onAddLocation,
    onOpenSettings,
    units
}: FloatingSidebarProps) {

    const getTempUnit = () => {
        switch (units) {
            case 'imperial': return '°F';
            case 'standard': return 'K';
            default: return '°C';
        }
    };

    return (
        <aside className={styles.sidebar}>
            <div className={styles.brand}>
                <span>Breezy</span>
            </div>

            <div className={styles.locationHelper}>Saved Locations</div>

            <div className={styles.locationsList}>
                {locations.map((loc) => (
                    <div
                        key={loc.id}
                        className={`${styles.locationItem} ${selectedLocationId === loc.id ? styles.active : ''}`}
                        onClick={() => onSelectLocation(loc.id)}
                    >
                        <span>{loc.name}</span>
                        {loc.latestWeather && (
                            <span className={styles.temp}>
                                {Math.round(loc.latestWeather.temp)}{getTempUnit()}
                            </span>
                        )}
                    </div>
                ))}
            </div>

            <div className={styles.footer}>
                <button className={`${styles.actionBtn} ${styles.footerBtn}`} onClick={onAddLocation}>
                    <span>+ Add Location</span>
                </button>
                <button className={styles.actionBtn} onClick={onOpenSettings}>
                    <span>⚙ Settings</span>
                </button>
            </div>
        </aside>
    );
}
