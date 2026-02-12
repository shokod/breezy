'use client';

import { useState } from 'react';
import styles from './SyncButton.module.css';

interface SyncButtonProps {
    onSync: () => void;
    setLastSync: (time: string) => void;
}

export default function SyncButton({ onSync, setLastSync }: SyncButtonProps) {
    const [isSyncing, setIsSyncing] = useState(false);

    const handleSync = async () => {
        setIsSyncing(true);
        try {
            const res = await fetch('/api/weather/sync', { method: 'POST' });
            if (res.ok) {
                setLastSync(new Date().toLocaleTimeString());
                onSync();
            }
        } catch (err) {
            console.error('Sync failed:', err);
        } finally {
            setIsSyncing(false);
        }
    };

    return (
        <button
            onClick={handleSync}
            className={styles.btn}
            disabled={isSyncing}
        >
            <span className={styles.icon}>{isSyncing ? '↻' : '⟳'}</span>
            {isSyncing ? 'Syncing...' : 'Refresh All'}
        </button>
    );
}
