import { useState } from 'react';
import { useForecast } from '@/hooks/useWeather';
import type { WeatherData } from '@/services/weather';
import styles from './ForecastStrip.module.css';

interface ForecastStripProps {
    location: { name: string; lat: number; lon: number } | string;
    units: 'metric' | 'imperial' | 'standard';
}

export default function ForecastStrip({ location, units }: ForecastStripProps) {
    const { data: forecast, isLoading } = useForecast(location, units);

    const [activeTab, setActiveTab] = useState<'today' | 'week'>('week');

    if (isLoading) {
        return <div className="text-center py-8 text-[var(--text-muted)]">Loading forecast...</div>;
    }

    if (!forecast) {
        return <div className="text-center py-8 text-red-500">Unable to load forecast data.</div>;
    }

    // Process forecast
    // Week: Daily highlights (midday)
    const dailyForecasts = forecast.list.filter((item: WeatherData) => item.dt_txt?.includes('12:00:00')).slice(0, 7);

    // Today: Next 24 hours (8 x 3-hour intervals)
    const hourlyForecasts = forecast.list.slice(0, 8);

    const itemsToDisplay = activeTab === 'week' ? dailyForecasts : hourlyForecasts;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.tabs}>
                    <button
                        className={`${styles.tab} ${activeTab === 'today' ? styles.activeTab : ''}`}
                        onClick={() => setActiveTab('today')}
                    >
                        Today
                    </button>
                    <button
                        className={`${styles.tab} ${activeTab === 'week' ? styles.activeTab : ''}`}
                        onClick={() => setActiveTab('week')}
                    >
                        Week
                    </button>
                </div>
            </div>

            <div className={styles.grid}>
                {itemsToDisplay.length === 0 ? (
                    <div className="col-span-full text-center py-4 text-[var(--text-muted)]">
                        No forecast data available.
                    </div>
                ) : (
                    itemsToDisplay.map((item: WeatherData) => {
                        const date = new Date(item.dt * 1000);
                        // For "Today", show time. For "Week", show day name.
                        const label = activeTab === 'today'
                            ? date.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true })
                            : date.toLocaleDateString('en-US', { weekday: 'short' });

                        const iconUrl = `https://openweathermap.org/img/wn/${item.icon}.png`;

                        return (
                            <div key={item.dt} className={styles.card}>
                                <div className={styles.day}>{label}</div>
                                <img src={iconUrl} alt={item.description} className={styles.icon} />
                                <div className={styles.temps}>
                                    <span className={styles.maxTemp}>{Math.round(item.temp_max || item.temp)}°</span>
                                    {activeTab === 'week' && (
                                        <span className={styles.minTemp}>{Math.round(item.temp_min || item.temp)}°</span>
                                    )}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
