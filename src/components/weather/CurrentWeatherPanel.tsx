import { useState } from 'react';
import styles from './CurrentWeatherPanel.module.css';
import { WeatherData } from '@/services/weather';
import { Search, MapPin, CloudRain, Cloud, Star, Trash2 } from 'lucide-react';

interface WeatherDisplayData {
    temp: number;
    description: string;
    icon: string;
    dt?: number;
    timestamp?: Date | string;
    windSpeed?: number | null;
    humidity?: number | null;
    feelsLike?: number | null;
    pressure?: number | null;
}

interface CurrentWeatherPanelProps {
    weather: WeatherDisplayData;
    locationName: string;
    isFavorite: boolean;
    units: 'metric' | 'imperial' | 'standard';
    onSearch: (query: string) => void;
    onToggleFavorite: () => void;
    onDelete: () => void;
}

export default function CurrentWeatherPanel({
    weather,
    locationName,
    isFavorite,
    units,
    onSearch,
    onToggleFavorite,
    onDelete
}: CurrentWeatherPanelProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const tempUnit = units === 'metric' ? '°C' : units === 'imperial' ? '°F' : 'K';

    // Format date: "Monday, 16:00"
    // weather.dt might be undefined if coming from DB snapshot which uses timestamp
    // weather.timestamp comes from DB.
    const dateObj = weather.dt ? new Date(weather.dt * 1000) : new Date(weather.timestamp || Date.now());
    const isValidDate = !isNaN(dateObj.getTime());

    // Fallback to now if invalid (shouldn't happen with valid DB data)
    const finalDate = isValidDate ? dateObj : new Date();

    const dayName = finalDate.toLocaleDateString('en-US', { weekday: 'long' });
    const timeString = finalDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

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
            <div className={styles.topBar}>
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
                <div className={styles.actions}>
                    <button
                        onClick={onToggleFavorite}
                        className={`${styles.actionBtn} ${isFavorite ? styles.favorite : ''}`}
                        aria-label="Toggle favorite"
                    >
                        <Star size={20} fill={isFavorite ? "currentColor" : "none"} />
                    </button>
                    <button
                        onClick={onDelete}
                        className={`${styles.actionBtn} ${styles.delete}`}
                        aria-label="Delete location"
                    >
                        <Trash2 size={20} />
                    </button>
                </div>
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
