'use client';

import styles from './SyncButton.module.css';
import { useSyncWeather } from '@/hooks/useWeather';

export default function SyncButton() {
    const syncMutation = useSyncWeather();

    return (
        <button
            onClick={() => syncMutation.mutate()}
            className={styles.btn}
            disabled={syncMutation.isPending}
        >
            <span className={styles.icon}>{syncMutation.isPending ? '↻' : '⟳'}</span>
            {syncMutation.isPending ? 'Syncing...' : 'Refresh All'}
        </button>
    );
}
