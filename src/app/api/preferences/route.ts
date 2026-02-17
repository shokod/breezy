import { NextResponse } from 'next/server';
import { PreferencesService } from '@/services/preferences';

export async function GET() {
    try {
        const prefs = await PreferencesService.getPreferences();
        return NextResponse.json(prefs, { status: 200 });
    } catch (error) {
        console.error('Failed to fetch preferences:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PATCH(req: Request) {
    try {
        const body = await req.json();
        const updatedPrefs = await PreferencesService.updatePreferences(body);
        return NextResponse.json(updatedPrefs, { status: 200 });
    } catch (error: unknown) {
        if (error instanceof Error && error.message.startsWith('Validation failed')) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }
        console.error('Failed to update preferences:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
