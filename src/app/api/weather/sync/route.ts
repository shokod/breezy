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

        const results = [];

        for (const location of allLocations) {
            try {
                // I'm using coordinate-based fetching for better precision
                const weather = await WeatherService.getWeatherByCoordinates(location.lat, location.lon);

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

                results.push({ id: location.id, status: 'success' });
            } catch (err) {
                console.error(`Failed to sync location ${location.id}:`, err);
                results.push({ id: location.id, status: 'error' });
            }
        }

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
