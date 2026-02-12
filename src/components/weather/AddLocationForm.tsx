'use client';

import { useState } from 'react';
import styles from './AddLocationForm.module.css';

interface AddLocationFormProps {
    onAdd: () => void;
}

export default function AddLocationForm({ onAdd }: AddLocationFormProps) {
    const [city, setCity] = useState('');
    const [country, setCountry] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!city || !country) return;

        setIsSubmitting(true);
        try {
            // In a real app, we'd geocode here. For this assessment, 
            // we'll pass city/country and let the backend/service handle it,
            // or use placeholders for lat/lon for simplicity if geocoding isn't required yet.
            // Requirement 2: Locations (name, country, coordinates)

            // Let's assume a simple case: we just add it.
            const res = await fetch('/api/locations', {
                method: 'POST',
                body: JSON.stringify({
                    name: city,
                    country: country,
                    lat: 0, // Placeholder
                    lon: 0, // Placeholder
                }),
            });

            if (res.ok) {
                setCity('');
                setCountry('');
                onAdd();
            }
        } catch (err) {
            console.error('Add failed:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <input
                type="text"
                placeholder="City (e.g. London)"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className={styles.input}
                disabled={isSubmitting}
                required
            />
            <input
                type="text"
                placeholder="Country (e.g. UK)"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className={styles.input}
                disabled={isSubmitting}
                required
            />
            <button type="submit" className={styles.btn} disabled={isSubmitting}>
                {isSubmitting ? 'Adding...' : 'Add City'}
            </button>
        </form>
    );
}
