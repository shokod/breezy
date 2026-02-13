import { NextResponse } from 'next/server';
import { WeatherService } from '@/services/weather';

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const city = searchParams.get('city');
    const units = searchParams.get('units') || 'metric';

    if (!city) {
        return NextResponse.json({ error: 'City is required' }, { status: 400 });
    }

    try {
        const forecast = await WeatherService.getForecast(city, units);
        return NextResponse.json(forecast);
    } catch (error: any) {
        console.error('Forecast fetch error:', error);
        return NextResponse.json({ error: error.message || 'Failed to fetch forecast' }, { status: 500 });
    }
}
