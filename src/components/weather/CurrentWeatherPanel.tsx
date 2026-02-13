'use client';

import { useState } from 'react';
import styles from './CurrentWeatherPanel.module.css';
import { WeatherData } from '@/services/weather';
import { Search, MapPin, CloudRain, Cloud } from 'lucide-react';

interface CurrentWeatherPanelProps {
    weather: WeatherData;
    locationName: string;
    units: 'metric' | 'imperial' | 'standard';
    onSearch: (query: string) => void;
}

export default function CurrentWeatherPanel({ weather, locationName, units, onSearch }: CurrentWeatherPanelProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const tempUnit = units === 'metric' ? '°C' : units === 'imperial' ? '°F' : 'K';

    // Format date: "Monday, 16:00"
    const date = new Date(weather.dt * 1000);
    const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
    const timeString = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    // Weather icon URL
    const iconUrl = `https://openweathermap.org/img/wn/${weather.icon}@4x.png`;

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && searchQuery.trim()) {
            onSearch(searchQuery.trim());
            setSearchQuery('');
        }
    };

    return (
        <div className={styles.panel}>
            <div className={styles.search}>
                <Search size={18} />
                <input
                    type="text"
                    placeholder="Search for places ..."
                    className={styles.searchInput}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
            </div>

            <div className={styles.weatherIconContainer}>
                <img src={iconUrl} alt={weather.description} className={styles.weatherIcon} />
            </div>

            <div className={styles.temperature}>
                {Math.round(weather.temp)}<span style={{ fontSize: '0.5em', verticalAlign: 'top' }}>{tempUnit}</span>
            </div>

            <div className={styles.meta}>
                <div className={styles.date}>{dayName}, <span className={styles.time}>{timeString}</span></div>
            </div>

            <div className={styles.conditions}>
                <div className={styles.conditionRow}>
                    <Cloud size={20} />
                    <span className="capitalize">{weather.description}</span>
                </div>
            </div>

            <div className={styles.cityImage} style={{
                backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.6), transparent), url('https://images.unsplash.com/photo-1449824913929-3637a4f9aa59?q=80&w=1200&auto=format&fit=crop')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
            }}>
                <div className={styles.cityLabel}>{locationName}</div>
            </div>
        </div>
    );
}
