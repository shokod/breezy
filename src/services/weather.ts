export interface WeatherData {
    temp: number;
    feelsLike: number;
    description: string;
    icon: string;
    humidity: number;
    windSpeed: number;
    pressure: number;
    dt: number;
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

    static async getCurrentWeather(city: string, units: string = 'metric'): Promise<WeatherData> {
        if (!this.API_KEY) throw new Error('API key not configured');

        const res = await fetch(
            `${this.BASE_URL}/weather?q=${encodeURIComponent(city)}&units=${units}&appid=${this.API_KEY}`
        );

        if (res.status === 401) throw new Error('Invalid API key');
        if (res.status === 404) throw new Error('City not found');
        if (!res.ok) throw new Error(`Weather API error: ${res.statusText}`);

        const data = await res.json();
        return this.normalizeWeatherData(data);
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

    private static normalizeWeatherData(data: any): WeatherData {
        return {
            temp: data.main.temp,
            feelsLike: data.main.feels_like,
            description: data.weather[0].description,
            icon: data.weather[0].icon,
            humidity: data.main.humidity,
            windSpeed: data.wind.speed,
            pressure: data.main.pressure,
            dt: data.dt,
        };
    }
}
