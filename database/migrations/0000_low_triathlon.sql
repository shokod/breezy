CREATE TABLE `locations` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`country` text NOT NULL,
	`lat` real NOT NULL,
	`lon` real NOT NULL,
	`is_favorite` integer DEFAULT false NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `user_preferences` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`units` text DEFAULT 'metric' NOT NULL,
	`refresh_interval_minutes` integer DEFAULT 30 NOT NULL,
	`last_global_sync_at` integer
);
--> statement-breakpoint
CREATE TABLE `weather_snapshots` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`location_id` integer NOT NULL,
	`temp` real NOT NULL,
	`feels_like` real,
	`description` text NOT NULL,
	`icon` text NOT NULL,
	`humidity` integer,
	`wind_speed` real,
	`pressure` integer,
	`timestamp` integer NOT NULL,
	FOREIGN KEY (`location_id`) REFERENCES `locations`(`id`) ON UPDATE no action ON DELETE cascade
);
