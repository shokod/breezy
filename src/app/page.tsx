import styles from './page.module.css';
import LocationDashboard from '@/components/weather/LocationDashboard';

export default function Home() {
  return (
    <main className={styles.main}>
      <div className="container">
        <header className={styles.header}>
          <div>
            <h1 className={styles.title}>Breezy Weather</h1>
            <p className={styles.subtitle}>Track and manage your favorite city forecasts</p>
          </div>
        </header>

        <LocationDashboard />
      </div>
    </main>
  );
}
