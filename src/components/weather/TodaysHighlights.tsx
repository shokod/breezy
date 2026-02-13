'use client';

import styles from './TodaysHighlights.module.css';
import { WeatherData } from '@/services/weather';
import { Wind, Sunrise, Sunset, Droplets, Eye, Activity } from 'lucide-react';

interface WeatherDisplayData {
    windSpeed?: number | null;
    humidity?: number | null;
    [key: string]: any; // Allow other props
}

interface TodaysHighlightsProps {
    weather: WeatherDisplayData;
    units: 'metric' | 'imperial' | 'standard';
}

export default function TodaysHighlights({ weather, units }: TodaysHighlightsProps) {
    const speedUnit = units === 'imperial' ? 'mph' : 'km/h';
    const windSpeed = units === 'imperial' ? Math.round(weather.windSpeed || 0) : Math.round((weather.windSpeed || 0) * 3.6); // Convert m/s to km/h for metric

    // Mock data for missing API fields to match design
    const uvIndex = 5;
    const sunrise = "6:35 AM";
    const sunset = "5:42 PM";
    const visibility = 5.2;
    const airQuality = 105;

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Today's Highlights</h2>

            <div className={styles.grid}>
                {/* UV Index */}
                <div className={styles.card}>
                    <div className={styles.cardTitle}>UV Index</div>
                    {/* Gauge placeholder */}
                    <div className="relative h-24 flex items-center justify-center">
                        <div className="w-32 h-16 border-t-8 border-l-8 border-r-8 border-[var(--gray-200)] rounded-t-full absolute top-4"></div>
                        <div className="w-32 h-16 border-t-8 border-l-8 border-r-8 border-[var(--primary)] rounded-t-full absolute top-4 clip-half" style={{ clipPath: 'polygon(0 0, 50% 0, 50% 100%, 0 100%)' }}></div>
                        <span className={styles.value} style={{ marginTop: '2rem' }}>{uvIndex}</span>
                    </div>
                </div>

                {/* Wind Status */}
                <div className={styles.card}>
                    <div className={styles.cardTitle}>Wind Status</div>
                    <div className={styles.value}>
                        {windSpeed} <span className={styles.unit}>{speedUnit}</span>
                    </div>
                    <div className={styles.status}>
                        <div className={styles.statusIcon}>
                            <Wind size={14} />
                        </div>
                        <span>SW</span>
                    </div>
                </div>

                {/* Sunrise & Sunset */}
                <div className={styles.card}>
                    <div className={styles.cardTitle}>Sunrise & Sunset</div>
                    <div className="flex flex-col gap-4 mt-2">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600">
                                <Sunrise size={20} />
                            </div>
                            <div>
                                <div className="font-semibold text-[var(--text-primary)]">{sunrise}</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                                <Sunset size={20} />
                            </div>
                            <div>
                                <div className="font-semibold text-[var(--text-primary)]">{sunset}</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Humidity */}
                <div className={styles.card}>
                    <div className={styles.cardTitle}>Humidity</div>
                    <div className="flex justify-between items-end">
                        <div className={styles.value}>
                            {weather.humidity}<span className={styles.unit}>%</span>
                        </div>
                        <div className="h-20 w-8 bg-[var(--gray-100)] rounded-full relative overflow-hidden">
                            <div className="absolute bottom-0 left-0 right-0 bg-blue-500 rounded-full" style={{ height: `${weather.humidity}%` }}></div>
                        </div>
                    </div>
                    <div className={styles.status}>
                        <span>Normal</span>
                        <Droplets size={16} className="ml-2 text-blue-500" />
                    </div>
                </div>

                {/* Visibility */}
                <div className={styles.card}>
                    <div className={styles.cardTitle}>Visibility</div>
                    <div className={styles.value}>
                        {visibility} <span className={styles.unit}>km</span>
                    </div>
                    <div className={styles.status}>
                        <span>Average</span>
                        <Eye size={16} className="ml-2 text-[var(--text-secondary)]" />
                    </div>
                </div>

                {/* Air Quality */}
                <div className={styles.card}>
                    <div className={styles.cardTitle}>Air Quality</div>
                    <div className={styles.value}>{airQuality}</div>
                    <div className={styles.status}>
                        <span>Unhealthy</span>
                        <Activity size={16} className="ml-2 text-red-500" />
                    </div>
                </div>
            </div>
        </div>
    );
}
