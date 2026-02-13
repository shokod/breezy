# Breezy Architecture Documentation

## Overview
Breezy is a modern, weather dashboard application built with Next.js, focusing on a minimalist UI and efficient data handling.

## Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Database**: SQLite with LibSQL
- **ORM**: Drizzle ORM
- **State Management**: TanStack Query (React Query)
- **Styling**: Vanilla CSS Modules with a custom design system variables
- **Testing**: Vitest + React Testing Library

## Key Components

### Data Layer
- **`src/services/weather.ts`**: Handles fetching data from OpenWeatherMap and internal API.
- **`src/app/api/locations/route.ts`**: API endpoint for managing user locations. Optimized to use 2-step queries for performance.
- **`src/hooks/useWeather.ts`**: Custom hooks (`useWeather`, `useForecast`) for data access in components.

### UI Architecture
- **`AppShell`**: Main layout container.
- **`LocationDashboard`**: Core view for weather data.
- **`CurrentWeatherPanel`**: Displays real-time weather and CRUD actions.
- **`ForecastStrip`**: Horizontal scrollable forecast view.

## Database Schema
Refer to `database/schema.ts` for the source of truth.
- `locations`: Stores user-added cities.
- `weather_snapshots`: Caches weather data to reduce API calls.
- `user_preferences`: Stores UI settings (units, refresh interval).
