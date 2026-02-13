import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { locations, weatherSnapshots } from '@/../database/schema';
import { eq, desc } from 'drizzle-orm';
import { locationInputSchema } from '@/lib/schemas';
import { WeatherService } from '@/services/weather';

export async function GET() {
    try {
        const allLocations = await db.select().from(locations).all();

        // For each location, get the latest snapshot
        const locationsWithWeather = await Promise.all(
            allLocations.map(async (loc) => {
                const latestWeather = await db
                    .select()
                    .from(weatherSnapshots)
                    .where(eq(weatherSnapshots.locationId, loc.id))
                    .orderBy(desc(weatherSnapshots.timestamp))
                    .limit(1)
                    .get();

                return {
                    ...loc,
                    latestWeather: latestWeather || null,
                };
            })
        );

        return NextResponse.json(locationsWithWeather, { status: 200 });
    } catch (error) {
        console.error('Failed to fetch locations:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const result = locationInputSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json({
                error: 'Validation failed',
                details: result.error.flatten()
            }, { status: 400 });
        }

        const { name, country } = result.data;

        // Fetch coordinates
        let coords;
        try {
            coords = await WeatherService.getCoordinates(name, country);
        } catch (error: any) {
            if (error.message === 'City not found') {
                return NextResponse.json({ error: 'City not found. Please check the spelling.' }, { status: 404 });
            }
            throw error; // Re-throw other errors to be caught by the outer catch
        }

        const [newLocation] = await db.insert(locations).values({
            name,
            country,
            lat: coords.lat,
            lon: coords.lon,
        }).returning();

        // 3. Initial Fetch (Auto-fetch)
        let latestWeather = null;
        try {
            const weather = await WeatherService.getWeatherByCoordinates(newLocation.lat, newLocation.lon);
            const [snapshot] = await db.insert(weatherSnapshots).values({
                locationId: newLocation.id,
                temp: weather.temp,
                feelsLike: weather.feelsLike,
                description: weather.description,
                icon: weather.icon,
                humidity: weather.humidity,
                windSpeed: weather.windSpeed,
                pressure: weather.pressure,
            }).returning();
            latestWeather = snapshot;
        } catch (fetchError) {
            console.error('Initial weather fetch failed:', fetchError);
            // Allow creation to succeed even if initial fetch fails
        }

        return NextResponse.json({ ...newLocation, latestWeather }, { status: 201 });
    } catch (error) {
        console.error('Failed to create location:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
