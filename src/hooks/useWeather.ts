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
        onMutate: async (newLocationData) => {
            // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
            await queryClient.cancelQueries({ queryKey: ['locations'] });

            // Snapshot the previous value
            const previousLocations = queryClient.getQueryData(['locations']);

            // Optimistically update to the new value
            queryClient.setQueryData(['locations'], (old: ExtendedLocation[] | undefined) => {
                if (!old) return [];
                return old.map((location) => {
                    if (location.id === newLocationData.id) {
                        return { ...location, ...newLocationData };
                    }
                    return location;
                });
            });

            // Return a context object with the snapshotted value
            return { previousLocations };
        },
        onError: (err, newLocation, context) => {
            queryClient.setQueryData(['locations'], context?.previousLocations);
            toast.error(err.message);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['locations'] });
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

export function useForecast(location: { name: string; lat?: number; lon?: number } | string, units: 'metric' | 'imperial' | 'standard' = 'metric') {
    const city = typeof location === 'string' ? location : location.name;
    const lat = typeof location === 'object' ? location.lat : undefined;
    const lon = typeof location === 'object' ? location.lon : undefined;

    return useQuery<ForecastData, Error>({
        queryKey: ['forecast', city, lat, lon, units],
        queryFn: async () => {
            const params = new URLSearchParams({ units });
            if (lat !== undefined && lon !== undefined) {
                params.append('lat', lat.toString());
                params.append('lon', lon.toString());
            } else {
                params.append('city', city);
            }

            const res = await fetch(`/api/weather/forecast?${params.toString()}`);
            if (!res.ok) throw new Error('Failed to fetch forecast');
            return res.json();
        },
        enabled: !!city || (lat !== undefined && lon !== undefined),
    });
}
