'use client';

import { useState } from 'react';
import styles from './WeatherCard.module.css';
import { useUpdateLocation, useDeleteLocation, ExtendedLocation } from '@/hooks/useWeather';
import ForecastModal from './ForecastModal';
import type { Location, WeatherSnapshot } from '@/../database/schema';

interface WeatherCardProps {
    location: ExtendedLocation;
    units: 'metric' | 'imperial' | 'standard';
}

export default function WeatherCard({ location, units }: WeatherCardProps) {
    const [showForecast, setShowForecast] = useState(false);
    const updateMutation = useUpdateLocation();
    const deleteMutation = useDeleteLocation();
    const weather = location.latestWeather;

    const toggleFavorite = () => {
        updateMutation.mutate({
            id: location.id,
            isFavorite: !location.isFavorite
        });
    };

    const removeLocation = () => {
        if (confirm(`Remove ${location.name}?`)) {
            deleteMutation.mutate(location.id);
        }
    };

    const getTempUnit = () => {
        switch (units) {
            case 'imperial': return '°F';
            case 'standard': return 'K';
            default: return '°C';
        }
    };

    const getSpeedUnit = () => {
        switch (units) {
            case 'imperial': return 'mph';
            default: return 'm/s';
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
                    disabled={updateMutation.isPending}
                    aria-label="Toggle favorite"
                >
                    {location.isFavorite ? '★' : '☆'}
                </button>
            </div>

            {weather ? (
                <div className={styles.weatherInfo}>
                    <div className={styles.tempSection}>
                        <span className={styles.temp}>{Math.round(weather.temp)}{getTempUnit()}</span>
                        <img
                            src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
                            alt={weather.description}
                            className={styles.icon}
                        />
                    </div>
                    <p className={styles.description}>{weather.description}</p>
                    <div className={styles.details}>
                        <span>Humidity: {weather.humidity}%</span>
                        <span>Wind: {weather.windSpeed}{getSpeedUnit()}</span>
                    </div>
                    <button
                        className={styles.forecastBtn}
                        onClick={() => setShowForecast(true)}
                    >
                        View 5-Day Forecast
                    </button>
                </div>
            ) : (
                <div className={styles.noWeather}>
                    No sync data. Click "Refresh All" to fetch weather.
                </div>
            )}

            <div className={styles.footer}>
                <button
                    onClick={removeLocation}
                    className={styles.deleteBtn}
                    disabled={deleteMutation.isPending}
                >
                    {deleteMutation.isPending ? 'Removing...' : 'Remove'}
                </button>
            </div>

            {showForecast && (
                <ForecastModal
                    locationId={location.id}
                    locationName={location.name}
                    units={units}
                    onClose={() => setShowForecast(false)}
                />
            )}
        </div>
    );
}
