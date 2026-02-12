import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { locations } from '@/../database/schema';
import { eq } from 'drizzle-orm';
import { WeatherService } from '@/services/weather';

export async function GET(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const id = parseInt(params.id);
        if (isNaN(id)) {
            return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
        }

        const location = await db
            .select()
            .from(locations)
            .where(eq(locations.id, id))
            .get();

        if (!location) {
            return NextResponse.json({ error: 'Location not found' }, { status: 404 });
        }

        const forecast = await WeatherService.getForecastByCoordinates(location.lat, location.lon);

        return NextResponse.json(forecast, { status: 200 });
    } catch (error) {
        console.error('Failed to fetch forecast:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
