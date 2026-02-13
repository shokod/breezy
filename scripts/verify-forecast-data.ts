import { WeatherService } from '../src/services/weather';

async function verifyForecast() {
    try {
        console.log('Fetching forecast for London...');
        // We need a way to mock the API key or ensure it exists.
        // Since we are running in node, we need to load env vars.
        // But for now let's hope .env is loaded or we can mock the fetch if needed.
        // Actually, WeatherService uses process.env.OPENWEATHER_API_KEY.
        // If I run this with `npx tsx`, it might not load .env automatically unless I use dotenv.

        // Let's assume the user has the key. If not, we might need to mock.
        if (!process.env.OPENWEATHER_API_KEY) {
            console.error('OPENWEATHER_API_KEY is not set. Please set it to run verification.');
            return;
        }

        const forecast = await WeatherService.getForecast('London', 'metric');

        if (forecast && forecast.list && forecast.list.length > 0) {
            const firstItem = forecast.list[0];
            console.log('First forecast item:', firstItem);

            if (firstItem.dt_txt) {
                console.log('SUCCESS: dt_txt is present:', firstItem.dt_txt);
            } else {
                console.error('FAILURE: dt_txt is MISSING from forecast item.');
            }
        } else {
            console.error('FAILURE: No forecast data returned.');
        }

    } catch (error) {
        console.error('Error verifying forecast:', error);
    }
}

verifyForecast();
