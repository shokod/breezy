#!/bin/sh
set -e

# Path to the SQLite database inside the container
DB_PATH="/app/data/sqlite.db"

# Ensure working directory is the app root
cd /app

# Initialize the database if it doesn't exist yet
if [ ! -f "$DB_PATH" ]; then
    echo "Initializing database at $DB_PATH"
    mkdir -p "$(dirname "$DB_PATH")"
    npx drizzle-kit push
fi

# Allow overriding the default command
if [ "$#" -eq 0 ]; then
    set -- node server.js
fi

exec "$@"
