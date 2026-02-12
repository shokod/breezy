'use client';

import { useQuery } from '@tanstack/react-query';
import styles from './ForecastModal.module.css';
import type { ForecastData } from '@/services/weather';

interface ForecastModalProps {
    locationId: number;
    locationName: string;
    onClose: () => void;
}

export default function ForecastModal({ locationId, locationName, onClose }: ForecastModalProps) {
    const { data, isLoading, isError } = useQuery<ForecastData>({
        queryKey: ['forecast', locationId],
        queryFn: async () => {
            const res = await fetch(`/api/locations/${locationId}/forecast`);
            if (!res.ok) throw new Error('Failed to fetch forecast');
            return res.json();
        },
    });

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <header className={styles.header}>
                    <h2>5-Day Forecast: {locationName}</h2>
                    <button onClick={onClose} className={styles.closeBtn}>&times;</button>
                </header>

                {isLoading && <div className={styles.loading}>Loading forecast...</div>}
                {isError && <div className={styles.error}>Could not load forecast data.</div>}

                {data && (
                    <div className={styles.list}>
                        {data.list.map((item, index) => (
                            <div key={index} className={styles.item}>
                                <span className={styles.date}>
                                    {new Date(item.dt * 1000).toLocaleDateString([], { weekday: 'short', hour: '2-digit' })}
                                </span>
                                <img
                                    src={`https://openweathermap.org/img/wn/${item.icon}.png`}
                                    alt={item.description}
                                    className={styles.icon}
                                />
                                <span className={styles.temp}>{Math.round(item.temp)}°</span>
                                <span className={styles.desc}>{item.description}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
