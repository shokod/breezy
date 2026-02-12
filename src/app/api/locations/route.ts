import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { locations } from '../../../../database/schema';
import { eq } from 'drizzle-orm';

export async function GET() {
    try {
        const allLocations = await db.select().from(locations).all();
        return NextResponse.json(allLocations, { status: 200 });
    } catch (error) {
        console.error('Failed to fetch locations:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, country, lat, lon } = body;

        if (!name || !country || lat === undefined || lon === undefined) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const [newLocation] = await db.insert(locations).values({
            name,
            country,
            lat,
            lon,
        }).returning();

        return NextResponse.json(newLocation, { status: 201 });
    } catch (error) {
        console.error('Failed to create location:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
