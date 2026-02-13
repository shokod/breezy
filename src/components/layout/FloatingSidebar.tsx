import { useState } from 'react';
import styles from './FloatingSidebar.module.css';
import { ExtendedLocation } from '@/hooks/useWeather';
import { Cloud, MapPin, Plus, Settings } from 'lucide-react';

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
                <Cloud size={28} color="var(--primary)" />
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
                        <MapPin size={18} />
                        <span style={{ flex: 1 }}>{loc.name}</span>
                        {loc.latestWeather && (
                            <span className={styles.temp}>
                                {Math.round(loc.latestWeather.temp)}{getTempUnit()}
                            </span>
                        )}
                    </div>
                ))}
            </div>

            <div className={styles.footer}>
                <button className={styles.actionBtn} onClick={onAddLocation}>
                    <Plus size={20} />
                    <span>Add City</span>
                </button>
                <button className={styles.actionBtn} onClick={onOpenSettings}>
                    <Settings size={20} />
                    <span>Settings</span>
                </button>
            </div>
        </aside>
    );
}
