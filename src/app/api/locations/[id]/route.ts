import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { locations } from '../../../../../database/schema';
import { eq } from 'drizzle-orm';

export async function PATCH(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const id = parseInt(params.id);
        if (isNaN(id)) {
            return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
        }

        const body = await req.json();
        const { isFavorite, name } = body;

        const [updatedLocation] = await db
            .update(locations)
            .set({ isFavorite, name })
            .where(eq(locations.id, id))
            .returning();

        if (!updatedLocation) {
            return NextResponse.json({ error: 'Location not found' }, { status: 404 });
        }

        return NextResponse.json(updatedLocation, { status: 200 });
    } catch (error) {
        console.error('Failed to update location:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function DELETE(
    _req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const id = parseInt(params.id);
        if (isNaN(id)) {
            return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
        }

        const [deletedLocation] = await db
            .delete(locations)
            .where(eq(locations.id, id))
            .returning();

        if (!deletedLocation) {
            return NextResponse.json({ error: 'Location not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Location deleted successfully' }, { status: 200 });
    } catch (error) {
        console.error('Failed to delete location:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
