import styles from './WeatherHero.module.css';
import { WeatherData } from '@/services/weather';

interface WeatherHeroProps {
    locationName: string;
    weather: WeatherData;
    units: 'metric' | 'imperial' | 'standard';
}

export default function WeatherHero({ locationName, weather, units }: WeatherHeroProps) {
    const getTempUnit = () => {
        switch (units) {
            case 'imperial': return '°F';
            case 'standard': return 'K';
            default: return '°C';
        }
    };

    const formatDate = (weather: WeatherData & { timestamp?: string | Date }) => {
        let date = new Date();
        if (weather.dt) {
            date = new Date(weather.dt * 1000);
        } else if (weather.timestamp) {
            date = new Date(weather.timestamp);
        }

        if (isNaN(date.getTime())) return 'Update required';

        return date.toLocaleDateString(undefined, {
            weekday: 'long',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className={styles.hero}>
            <h1 className={styles.location}>{locationName}</h1>
            <div className={styles.date}>{formatDate(weather)}</div>

            <div className={styles.content}>
                <img
                    src={`https://openweathermap.org/img/wn/${weather.icon}@4x.png`}
                    alt={weather.description}
                    className={styles.icon}
                />
                <div className={styles.tempContainer}>
                    <span className={styles.temp}>
                        {Math.round(weather.temp)}°
                    </span>
                    <span className={styles.condition}>
                        {weather.description}
                    </span>
                </div>
            </div>

            <div className={styles.highLow}>
                <span>Feels like {Math.round(weather.feelsLike)}{getTempUnit()}</span>
                {/* Min/Max not in base snapshot, but feelsLike is good enough for now */}
            </div>
        </div>
    );
}
