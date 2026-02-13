'use client';

import { useQuery } from '@tanstack/react-query';
import { getForecast } from '@/services/weather';
import styles from './ForecastStrip.module.css';

interface ForecastStripProps {
    locationName: string;
    units: 'metric' | 'imperial' | 'standard';
}

export default function ForecastStrip({ locationName, units }: ForecastStripProps) {
    const { data: forecast, isLoading } = useQuery({
        queryKey: ['forecast', locationName, units],
        queryFn: () => getForecast(locationName, units),
        enabled: !!locationName,
    });

    if (isLoading) {
        return <div className="text-center py-8 text-[var(--text-muted)]">Loading forecast...</div>;
    }

    if (!forecast) {
        return <div className="text-center py-8 text-red-500">Unable to load forecast data.</div>;
    }

    // Process forecast to get daily highlights (simplified)
    // The API returns 3-hour intervals. We'll pick one midday slot per day for simplicity here.
    const dailyForecasts = forecast.list.filter((item: any) => item.dt_txt.includes('12:00:00')).slice(0, 7);

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.tabs}>
                    <div className={styles.tab}>Today</div>
                    <div className={`${styles.tab} ${styles.activeTab}`}>Week</div>
                </div>
            </div>

            <div className={styles.grid}>
                {dailyForecasts.map((day: any) => {
                    const date = new Date(day.dt * 1000);
                    const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
                    const iconUrl = `https://openweathermap.org/img/wn/${day.weather[0].icon}.png`;

                    return (
                        <div key={day.dt} className={styles.card}>
                            <div className={styles.day}>{dayName}</div>
                            <img src={iconUrl} alt={day.weather[0].description} className={styles.icon} />
                            <div className={styles.temps}>
                                <span className={styles.maxTemp}>{Math.round(day.main.temp_max)}°</span>
                                <span className={styles.minTemp}>{Math.round(day.main.temp_min)}°</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
