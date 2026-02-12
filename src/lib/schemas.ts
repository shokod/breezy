import { z } from 'zod';

export const locationInputSchema = z.object({
    name: z.string().min(1, 'City name is required'),
    country: z.string().min(1, 'Country name is required'),
    lat: z.number().optional().default(0),
    lon: z.number().optional().default(0),
});

export const locationUpdateSchema = z.object({
    name: z.string().optional(),
    isFavorite: z.boolean().optional(),
});

export const weatherSnapshotSchema = z.object({
    temp: z.number(),
    description: z.string(),
    icon: z.string(),
    humidity: z.number(),
    windSpeed: z.number(),
    pressure: z.number(),
});
