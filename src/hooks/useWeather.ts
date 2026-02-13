import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { Location, WeatherSnapshot } from '@/../database/schema';
import type { ForecastData } from '@/services/weather';

export interface ExtendedLocation extends Location {
    latestWeather: WeatherSnapshot | null;
}

export function useLocations() {
    return useQuery({
        queryKey: ['locations'],
        queryFn: async () => {
            const res = await fetch('/api/locations');
            if (!res.ok) throw new Error('Failed to fetch locations');
            return res.json();
        },
    });
}

export function useAddLocation() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: { name: string; country: string }) => {
            const res = await fetch('/api/locations', {
                method: 'POST',
                body: JSON.stringify(data),
            });
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || 'Failed to add location');
            }
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['locations'] });
            toast.success('Location added successfully');
        },
        onError: (error: Error) => {
            toast.error(error.message);
        },
    });
}

export function useUpdateLocation() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, ...data }: { id: number; isFavorite?: boolean; name?: string }) => {
            const res = await fetch(`/api/locations/${id}`, {
                method: 'PATCH',
                body: JSON.stringify(data),
            });
            if (!res.ok) throw new Error('Failed to update location');
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['locations'] });
        },
        onError: (error: Error) => {
            toast.error(error.message);
        },
    });
}

export function useDeleteLocation() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: number) => {
            const res = await fetch(`/api/locations/${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Failed to delete location');
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['locations'] });
            toast.success('Location removed');
        },
        onError: (error: Error) => {
            toast.error(error.message);
        },
    });
}

export function useSyncWeather() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async () => {
            const res = await fetch('/api/weather/sync', { method: 'POST' });
            if (!res.ok) throw new Error('Sync failed');
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['locations'] });
            // We could also have a 'weather' key if we implement historical view.
            toast.success('Weather data synced');
        },
        onError: (error: Error) => {
            toast.error(error.message);
        },
    });
}

export function usePreferences() {
    return useQuery({
        queryKey: ['preferences'],
        queryFn: async () => {
            const res = await fetch('/api/preferences');
            if (!res.ok) throw new Error('Failed to fetch preferences');
            return res.json();
        },
    });
}

export function useUpdatePreferences() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: { units?: 'metric' | 'imperial' | 'standard'; refreshIntervalMinutes?: number }) => {
            const res = await fetch('/api/preferences', {
                method: 'PATCH',
                body: JSON.stringify(data),
            });
            if (!res.ok) throw new Error('Failed to update preferences');
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['preferences'] });
            toast.success('Preferences updated');
        },
        onError: (error: Error) => {
            toast.error(error.message);
        },
    });
}

export function useForecast(city: string, units: 'metric' | 'imperial' | 'standard' = 'metric') {
    return useQuery<ForecastData, Error>({
        queryKey: ['forecast', city, units],
        queryFn: async () => {
            // We can call the service directly since it's a client-side fetch wrapper, 
            // BUT getForecast in services/weather.ts uses server-side env vars (process.env.OPENWEATHER_API_KEY).
            // process.env is not available in client components/hooks in the same way for secrets.
            // However, we recently made getForecast exportable.
            // IF getForecast uses API_KEY, it will fail on client if NEXT_PUBLIC_ is not used.
            // Let's check weather.ts again. It uses process.env.OPENWEATHER_API_KEY.
            // This means we CANNOT call getForecast from the client directly if the key is server-only.
            // We need an API route for forecast OR use a server action OR expose the key (bad).
            // Given the existing pattern (api/locations, api/weather/sync), we should probably have an api/weather/forecast route 
            // OR just call the service if it's a server action. 
            // Wait, services/weather.ts is just a class. It's not a server action.
            // So we need to create an API route `/api/weather/forecast` or similar.

            const res = await fetch(`/api/weather/forecast?city=${encodeURIComponent(city)}&units=${units}`);
            if (!res.ok) throw new Error('Failed to fetch forecast');
            return res.json();
        },
        enabled: !!city,
    });
}
