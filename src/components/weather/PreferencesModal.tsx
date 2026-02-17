'use client';

import { createPortal } from 'react-dom';
import { useEffect, useState } from 'react';
import styles from './PreferencesModal.module.css';
import { usePreferences, useUpdatePreferences } from '@/hooks/useWeather';

interface PreferencesModalProps {
    onClose: () => void;
}

export default function PreferencesModal({ onClose }: PreferencesModalProps) {
    const [mounted, setMounted] = useState(false);
    const { data: preferences } = usePreferences();
    const updateMutation = useUpdatePreferences();

    const [units, setUnits] = useState(preferences?.units || 'metric');
    const [interval, setInterval] = useState(preferences?.refreshIntervalMinutes || 30);

    useEffect(() => {
        setMounted(true);
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    useEffect(() => {
        if (preferences) {
            setUnits(preferences.units);
            setInterval(preferences.refreshIntervalMinutes);
        }
    }, [preferences]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateMutation.mutate(
            { units, refreshIntervalMinutes: Number(interval) },
            {
                onSuccess: () => {
                    onClose();
                }
            }
        );
    };

    if (!mounted) return null;

    return createPortal(
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <header className={styles.header}>
                    <h2>Settings</h2>
                    <button onClick={onClose} className={styles.closeBtn}>&times;</button>
                </header>

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.formGroup}>
                        <label htmlFor="units">Units</label>
                        <select
                            id="units"
                            value={units}
                            onChange={(e) => setUnits(e.target.value as 'metric' | 'imperial' | 'standard')}
                            className={styles.select}
                        >
                            <option value="metric">Metric (°C, m/s)</option>
                            <option value="imperial">Imperial (°F, mph)</option>
                            <option value="standard">Standard (K, m/s)</option>
                        </select>
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="interval">Refresh Interval</label>
                        <select
                            id="interval"
                            value={interval}
                            onChange={(e) => setInterval(Number(e.target.value))}
                            className={styles.select}
                        >
                            <option value="15">Every 15 minutes</option>
                            <option value="30">Every 30 minutes</option>
                            <option value="60">Every hour</option>
                            <option value="120">Every 2 hours</option>
                            <option value="360">Every 6 hours</option>
                        </select>
                    </div>

                    <div className={styles.actions}>
                        <button type="button" onClick={onClose} className={styles.cancelBtn}>
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className={styles.saveBtn}
                            disabled={updateMutation.isPending}
                        >
                            {updateMutation.isPending ? 'Saving...' : 'Save Preferences'}
                        </button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    );
}
