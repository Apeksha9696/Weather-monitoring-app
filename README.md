# Weather App — DevOps Project

A full-stack weather application with a Node.js backend and static frontend, containerized with Docker and automated via Jenkins and GitHub Actions.

## Project Structure

```
├── backend/          # Node.js/Express API server
├── frontend/         # Static HTML/CSS/JS frontend
├── Dockerfile        # Docker image configuration
├── Jenkinsfile       # Jenkins CI/CD pipeline
└── .github/workflows # GitHub Actions workflow
```

## Features

- Current weather by city (temperature, humidity, wind speed, condition)
- 5-day forecast
- Served as a single app — backend serves the frontend statically

## Prerequisites

- Node.js 18+
- A [OpenWeatherMap API key](https://openweathermap.org/api)
- Docker (optional)

## Getting Started

### 1. Configure environment

```bash
cp backend/.env.example backend/.env
# Add your WEATHER_API_KEY to backend/.env
```

### 2. Run locally

```bash
cd backend
npm install
node server.js
```

Open `http://localhost:3000` in your browser.

### 3. Run tests

```bash
cd backend
npm test
```

## Docker

```bash
docker build -t weather-app .
docker run -p 3000:3000 -e WEATHER_API_KEY=<your_api_key> weather-app
```

## CI/CD

### Jenkins

The `Jenkinsfile` defines a pipeline with these stages:

1. Checkout
2. Install Dependencies
3. Run Tests
4. Build Docker Image
5. Deploy Container on port 3000

Requires a Jenkins credential named `weather-api-key`.

### GitHub Actions

The `.github/workflows/main.yml` workflow triggers on pushes to `main`/`master` and runs install, test, and Docker build steps.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/weather?city=<city>` | Current weather |
| GET | `/forecast?city=<city>` | 5-day forecast |
