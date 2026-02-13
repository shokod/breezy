import { NextResponse } from 'next/server';
import { WeatherService } from '@/services/weather';

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const city = searchParams.get('city');
    const lat = searchParams.get('lat');
    const lon = searchParams.get('lon');
    const units = searchParams.get('units') || 'metric';

    if (!city && (!lat || !lon)) {
        return NextResponse.json({ error: 'City or coordinates are required' }, { status: 400 });
    }

    try {
        let forecast;
        if (lat && lon) {
            forecast = await WeatherService.getForecastByCoordinates(parseFloat(lat), parseFloat(lon), units);
        } else if (city) {
            forecast = await WeatherService.getForecast(city, units);
        }

        return NextResponse.json(forecast);
    } catch (error: any) {
        console.error('Forecast fetch error:', error);
        return NextResponse.json({ error: error.message || 'Failed to fetch forecast' }, { status: 500 });
    }
}
