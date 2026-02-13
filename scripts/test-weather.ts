// @ts-nocheck

// Set environment variable BEFORE importing/requiring the service
process.env.OPENWEATHER_API_KEY = 'test-api-key';

// Use require to ensure execution order respects the env var setting
const { WeatherService } = require('../src/services/weather');

async function runTests() {
    console.log('Starting WeatherService Tests...');
    const originalFetch = global.fetch;
    let lastUrl = '';

    try {
        // Mock fetch
        global.fetch = async (url) => {
            lastUrl = url.toString();
            return {
                ok: true,
                status: 200,
                json: async () => ({
                    list: [{
                        main: { temp: 72, feels_like: 70, humidity: 40, pressure: 1010 },
                        weather: [{ description: 'partly cloudy', icon: '02d' }],
                        wind: { speed: 10 },
                        dt: 1234567890
                    }],
                    city: {
                        name: 'Mock City',
                        country: 'MC',
                        coord: { lat: 10, lon: 10 }
                    }
                })
            };
        };

        // Test 1: getForecastByCoordinates with 'imperial' units
        console.log('Test 1: getForecastByCoordinates with imperial units');

        const forecast = await WeatherService.getForecastByCoordinates(10, 10, 'imperial');

        console.log('Last URL Called:', lastUrl);
        if (!lastUrl.includes('units=imperial')) {
            throw new Error('Expected units=imperial in URL, got: ' + lastUrl);
        }

        if (forecast.list[0].temp !== 72) {
            throw new Error('Expected temp 72, got ' + forecast.list[0].temp);
        }
        if (forecast.list[0].description !== 'partly cloudy') {
            throw new Error('Expected "partly cloudy", got ' + forecast.list[0].description);
        }

        console.log('Test 1 Passed');

        // Test 2: getForecastByCoordinates with default units (metric)
        console.log('\nTest 2: getForecastByCoordinates with default units');
        await WeatherService.getForecastByCoordinates(10, 10);
        console.log('Last URL Called:', lastUrl);
        if (!lastUrl.includes('units=metric')) {
            throw new Error('Expected units=metric in URL, got: ' + lastUrl);
        }
        console.log('Test 2 Passed');

        console.log('\nAll tests passed!');
    } catch (error) {
        console.error('Test Failed:', error);
        process.exit(1);
    } finally {
        global.fetch = originalFetch;
    }
}

runTests();
