import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { locations, weatherSnapshots } from '@/../database/schema';
import { WeatherService } from '@/services/weather';

export async function POST() {
    try {
        const allLocations = await db.select().from(locations).all();

        if (allLocations.length === 0) {
            return NextResponse.json({ message: 'No locations to sync' }, { status: 200 });
        }

        const syncPromises = allLocations.map(async (location) => {
            try {
                const weather = await WeatherService.getCurrentWeather(`${location.lat},${location.lon}`);

                await db.insert(weatherSnapshots).values({
                    locationId: location.id,
                    temp: weather.temp,
                    feelsLike: weather.feelsLike,
                    description: weather.description,
                    icon: weather.icon,
                    humidity: weather.humidity,
                    windSpeed: weather.windSpeed,
                    pressure: weather.pressure,
                });

                return { id: location.id, status: 'success' };
            } catch (err) {
                console.error(`Failed to sync location ${location.id}:`, err);
                return { id: location.id, status: 'error' };
            }
        });

        const results = await Promise.all(syncPromises);

        return NextResponse.json({
            message: 'Sync completed',
            results,
            timestamp: new Date().toISOString(),
        }, { status: 200 });
    } catch (error) {
        console.error('Weather sync failed:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
