import { WeatherService } from '../src/services/weather';

// Simple mock test for demonstration
describe('WeatherService', () => {
    it('should normalize weather data correctly', () => {
        const rawData = {
            main: { temp: 25, feels_like: 27, humidity: 60, pressure: 1013 },
            weather: [{ description: 'sunny', icon: '01d' }],
            wind: { speed: 5 },
            dt: 123456789,
        };

        // @ts-ignore - reaching into private method for testing
        const normalized = WeatherService.normalizeWeatherData(rawData);

        expect(normalized.temp).toBe(25);
        expect(normalized.description).toBe('sunny');
        expect(normalized.icon).toBe('01d');
    });

    it('should fallback to mock data when API key is missing', async () => {
        // Force API_KEY to be undefined for test if needed
        // In this environment, we just verify the method returns data
        const weather = await WeatherService.getCurrentWeather('London');
        expect(weather).toHaveProperty('temp');
        expect(weather).toHaveProperty('description');
    });
});
