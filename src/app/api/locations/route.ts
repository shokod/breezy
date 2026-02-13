import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { locations, weatherSnapshots } from '@/../database/schema';
import { eq, desc, sql, inArray } from 'drizzle-orm';
import { locationInputSchema } from '@/lib/schemas';
import { WeatherService } from '@/services/weather';

export async function GET() {
    try {
        const allLocations = await db.select().from(locations).all();

        if (allLocations.length === 0) {
            return NextResponse.json([], { status: 200 });
        }

        // Optimize: Fetch only the latest weather snapshot for each location
        // 1. Get the latest ID per location using Drizzle query builder
        const latestIdsResult = await db
            .select({ id: sql<number>`MAX(${weatherSnapshots.id})` })
            .from(weatherSnapshots)
            .groupBy(weatherSnapshots.locationId);

        const latestIds = latestIdsResult
            .map((r) => r.id)
            .filter((id): id is number => id !== null);

        // 2. Fetch the actual snapshot data
        let latestSnapshots: any[] = [];
        if (latestIds.length > 0) {
            latestSnapshots = await db
                .select()
                .from(weatherSnapshots)
                .where(inArray(weatherSnapshots.id, latestIds));
        }

        const snapshotMap = new Map(latestSnapshots.map((s) => [s.locationId, s]));

        const locationsWithWeather = allLocations.map((loc) => ({
            ...loc,
            latestWeather: snapshotMap.get(loc.id) || null,
        }));

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

        // Check if location already exists (by name or proximity)
        // We'll use a simple name check first, but proximity would be better long term.
        // For now, let's check if we have a location with the same name (case-insensitive) OR very close coordinates.

        const existingLocation = await db.query.locations.findFirst({
            where: (locations, { or, eq, and, between }) => or(
                eq(locations.name, name),
                and(
                    between(locations.lat, coords.lat - 0.1, coords.lat + 0.1),
                    between(locations.lon, coords.lon - 0.1, coords.lon + 0.1)
                )
            ),
        });

        if (existingLocation) {
            return NextResponse.json(
                { error: `Location '${existingLocation.name}' already exists.` },
                { status: 409 }
            );
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
                timezone: weather.timezone,
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
