import styles from './WeatherDetails.module.css';
import { WeatherData } from '@/services/weather';

interface WeatherDetailsProps {
    weather: WeatherData;
    units: 'metric' | 'imperial' | 'standard';
}

export default function WeatherDetails({ weather, units }: WeatherDetailsProps) {
    const getSpeedUnit = () => {
        switch (units) {
            case 'imperial': return 'mph';
            default: return 'm/s';
        }
    };

    return (
        <div className={styles.grid}>
            <div className={styles.card}>
                <div className={styles.icon}>💧</div>
                <div className={styles.label}>Humidity</div>
                <div className={styles.value}>
                    {weather.humidity}<span className={styles.unit}>%</span>
                </div>
            </div>

            <div className={styles.card}>
                <div className={styles.icon}>🌬️</div>
                <div className={styles.label}>Wind</div>
                <div className={styles.value}>
                    {Math.round(weather.windSpeed)}<span className={styles.unit}>{getSpeedUnit()}</span>
                </div>
            </div>

            <div className={styles.card}>
                <div className={styles.icon}>⏲️</div>
                <div className={styles.label}>Pressure</div>
                <div className={styles.value}>
                    {weather.pressure}<span className={styles.unit}>hPa</span>
                </div>
            </div>

            <div className={styles.card}>
                <div className={styles.icon}>🌡️</div>
                <div className={styles.label}>Feels Like</div>
                <div className={styles.value}>
                    {Math.round(weather.feelsLike)}°
                </div>
            </div>
        </div>
    );
}
