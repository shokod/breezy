import { ReactNode } from 'react';
import styles from './AppShell.module.css';
import FloatingSidebar from './FloatingSidebar';
import { ExtendedLocation } from '@/hooks/useWeather';

interface AppShellProps {
    children: ReactNode;
    locations: ExtendedLocation[];
    selectedLocationId: number | null;
    onSelectLocation: (id: number) => void;
    onAddLocation: () => void;
    onOpenSettings: () => void;
    units: 'metric' | 'imperial' | 'standard';
}

export default function AppShell({
    children,
    locations,
    selectedLocationId,
    onSelectLocation,
    onAddLocation,
    onOpenSettings,
    units
}: AppShellProps) {

    return (
        <div className={styles.shell}>
            <FloatingSidebar
                locations={locations}
                selectedLocationId={selectedLocationId}
                onSelectLocation={onSelectLocation}
                onAddLocation={onAddLocation}
                onOpenSettings={onOpenSettings}
                units={units}
            />
            <main className={styles.main}>
                {children}
            </main>
        </div>
    );
}
