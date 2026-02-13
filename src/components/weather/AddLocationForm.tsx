'use client';

import { useState } from 'react';
import styles from './AddLocationForm.module.css';
import { useAddLocation } from '@/hooks/useWeather';

interface AddLocationFormProps {
    onSuccess?: () => void;
    initialCity?: string;
}

export default function AddLocationForm({ onSuccess, initialCity = '' }: AddLocationFormProps) {
    const [city, setCity] = useState(initialCity);
    const [country, setCountry] = useState('');
    const addMutation = useAddLocation();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!city || !country) return;

        addMutation.mutate({ name: city, country }, {
            onSuccess: () => {
                setCity('');
                setCountry('');
                onSuccess?.();
            }
        });
    };

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <input
                type="text"
                placeholder="City (e.g. Harare)"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className={styles.input}
                disabled={addMutation.isPending}
                required
            />
            <input
                type="text"
                placeholder="Country (e.g. Zimbabwe)"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className={styles.input}
                disabled={addMutation.isPending}
                required
            />
            <button type="submit" className={styles.btn} disabled={addMutation.isPending}>
                {addMutation.isPending ? 'Adding...' : 'Add City'}
            </button>
        </form>
    );
}
