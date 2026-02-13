import { describe, it, expect } from 'vitest';
import { WeatherService } from '@/services/weather';

// Simple mock test for demonstration
describe('WeatherService', () => {
    it('should normalize weather data correctly', () => {
        const rawData = {
            main: { temp: 25, feels_like: 27, humidity: 60, pressure: 1013 },
            weather: [{ description: 'sunny', icon: '01d' }],
            wind: { speed: 5 },
            dt: 123456789,
            dt_txt: '2023-01-01 12:00:00', // Added to match new interface expectation
        };

        // @ts-ignore - reaching into private method for testing
        const normalized = WeatherService['normalizeWeatherData'](rawData);

        expect(normalized.temp).toBe(25);
        expect(normalized.description).toBe('sunny');
        expect(normalized.icon).toBe('01d');
        expect(normalized.dt).toBe(123456789);
        expect(normalized.dt_txt).toBe('2023-01-01 12:00:00');
    });

    it('should have a method to get current weather', async () => {
        expect(WeatherService.getCurrentWeather).toBeDefined();
    });
});
