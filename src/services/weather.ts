import { WeatherData, ForecastData } from '@/types/weather'; // We might need to move types if they are circular, but for now let's keep them here or export them from here.

export interface WeatherData {
    temp: number;
    temp_min?: number;
    temp_max?: number;
    feelsLike: number;
    description: string;
    icon: string;
    humidity: number;
    windSpeed: number;
    pressure: number;
    dt: number;
    dt_txt?: string;
}

export interface ForecastData {
    list: WeatherData[];
    city: {
        name: string;
        country: string;
        coord: {
            lat: number;
            lon: number;
        };
    };
}

export class WeatherService {
    private static API_KEY = process.env.OPENWEATHER_API_KEY;
    private static BASE_URL = 'https://api.openweathermap.org/data/2.5';
    private static GEO_URL = 'http://api.openweathermap.org/geo/1.0';

    static async getCoordinates(city: string, country: string): Promise<{ lat: number; lon: number }> {
        if (!this.API_KEY) return { lat: 0, lon: 0 };

        const res = await fetch(
            `${this.GEO_URL}/direct?q=${encodeURIComponent(city)},${encodeURIComponent(country)}&limit=1&appid=${this.API_KEY}`
        );

        if (!res.ok) throw new Error('Geocoding failed');
        const data = await res.json();

        if (data.length === 0) throw new Error('City not found');

        return {
            lat: data[0].lat,
            lon: data[0].lon,
        };
    }

    static async getCurrentWeather(city: string, units: string = 'metric'): Promise<WeatherData> {
        if (!this.API_KEY) {
            console.warn('Weather API key missing, using mock data');
            return this.getMockWeather(city);
        }

        const res = await fetch(
            `${this.BASE_URL}/weather?q=${encodeURIComponent(city)}&units=${units}&appid=${this.API_KEY}`
        );

        if (res.status === 401) throw new Error('Invalid API key');
        if (res.status === 404) throw new Error('City not found');
        if (!res.ok) throw new Error(`Weather API error: ${res.statusText}`);

        const data = await res.json();
        return this.normalizeWeatherData(data);
    }

    static async getWeatherByCoordinates(lat: number, lon: number, units: string = 'metric'): Promise<WeatherData> {
        if (!this.API_KEY) {
            console.warn('Weather API key missing, using mock data');
            return this.getMockWeather('Mock Location');
        }

        const res = await fetch(
            `${this.BASE_URL}/weather?lat=${lat}&lon=${lon}&units=${units}&appid=${this.API_KEY}`
        );

        if (res.status === 401) throw new Error('Invalid API key');
        if (res.status === 404) throw new Error('Location not found');
        if (!res.ok) throw new Error(`Weather API error: ${res.statusText}`);

        const data = await res.json();
        return this.normalizeWeatherData(data);
    }

    private static getMockWeather(city: string): WeatherData {
        return {
            temp: 20 + Math.random() * 10,
            feelsLike: 22,
            description: 'cloudy with mock data',
            icon: '04d',
            humidity: 50,
            windSpeed: 5,
            pressure: 1012,
            dt: Math.floor(Date.now() / 1000),
        };
    }

    static async getForecast(city: string, units: string = 'metric'): Promise<ForecastData> {
        if (!this.API_KEY) throw new Error('API key not configured');

        const res = await fetch(
            `${this.BASE_URL}/forecast?q=${encodeURIComponent(city)}&units=${units}&appid=${this.API_KEY}`
        );

        if (!res.ok) throw new Error(`Forecast API error: ${res.statusText}`);

        const data = await res.json();
        return {
            list: data.list.map((item: any) => this.normalizeWeatherData(item)),
            city: data.city,
        };
    }

    static async getForecastByCoordinates(lat: number, lon: number, units: string = 'metric'): Promise<ForecastData> {
        if (!this.API_KEY) throw new Error('API key not configured');

        const res = await fetch(
            `${this.BASE_URL}/forecast?lat=${lat}&lon=${lon}&units=${units}&appid=${this.API_KEY}`
        );

        if (!res.ok) throw new Error(`Forecast API error: ${res.statusText}`);

        const data = await res.json();
        return {
            list: data.list.map((item: any) => this.normalizeWeatherData(item)),
            city: data.city,
        };
    }

    private static normalizeWeatherData(data: any): WeatherData {
        return {
            temp: data.main.temp,
            temp_min: data.main.temp_min,
            temp_max: data.main.temp_max,
            feelsLike: data.main.feels_like,
            description: data.weather[0].description,
            icon: data.weather[0].icon,
            humidity: data.main.humidity,
            windSpeed: data.wind.speed,
            pressure: data.main.pressure,
            dt: data.dt,
            dt_txt: data.dt_txt,
        };
    }
}

export const getCoordinates = WeatherService.getCoordinates.bind(WeatherService);
export const getCurrentWeather = WeatherService.getCurrentWeather.bind(WeatherService);
export const getWeatherByCoordinates = WeatherService.getWeatherByCoordinates.bind(WeatherService);
export const getForecast = WeatherService.getForecast.bind(WeatherService);
export const getForecastByCoordinates = WeatherService.getForecastByCoordinates.bind(WeatherService);
