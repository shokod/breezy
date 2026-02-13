import styles from './page.module.css';
import LocationDashboard from '@/components/weather/LocationDashboard';

export default function Home() {
  return (
    <main className={styles.main}>
      <div className="container">
        <LocationDashboard />
      </div>
    </main>
  );
}
