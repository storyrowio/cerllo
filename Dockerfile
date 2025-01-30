# Stage 1: Build Next.js client
FROM node:20-alpine AS client-builder

WORKDIR /app/web

# Copy package files
COPY web/package*.json ./

# Install dependencies
RUN npm install

# Copy client source
COPY web .

# Build Next.js static files
RUN npm run build

# Stage 2: Build Go server
FROM golang:1.23-alpine AS server-builder

WORKDIR /app

COPY . .

# Clean up unnecessary files
RUN rm -f .env .env.* .env-*
RUN rm -rf .git .gitignore

# Build Go application
RUN go mod tidy
COPY *.go ./
RUN go build -o /server

RUN apk update && apk add --no-cache \
    nodejs \
    npm \
    bash

# Copy built client files from previous stage
COPY --from=client-builder /app/web /app/web
WORKDIR /app/web
RUN npm install --production

COPY start.sh /start.sh
RUN chmod +x /start.sh

EXPOSE 8000 3000

CMD [ "/start.sh" ]