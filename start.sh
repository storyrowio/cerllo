#!/bin/sh

# Start Next.js in the background
cd /app/web && PORT=3000 npm start &

# Start Go server
cd /app && /server