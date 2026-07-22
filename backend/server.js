require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Serve static frontend files
app.use(express.static(path.join(__dirname, '../frontend')));

app.get('/weather', async (req, res) => {
    const city = req.query.city;
    if (!city) {
        return res.status(400).json({ error: 'City name is required' });
    }

    try {
        const apiKey = process.env.WEATHER_API_KEY;
        if (!apiKey) {
             return res.status(500).json({ error: 'API key is missing' });
        }
        
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;
        const response = await axios.get(url);
        
        res.json({
            city: response.data.name,
            temperature: response.data.main.temp,
            humidity: response.data.main.humidity,
            windSpeed: response.data.wind.speed,
            condition: response.data.weather[0].main,
            description: response.data.weather[0].description,
            icon: response.data.weather[0].icon
        });
    } catch (error) {
        if (error.response && error.response.status === 404) {
            return res.status(404).json({ error: 'City not found' });
        }
        res.status(500).json({ error: 'Error fetching weather data' });
    }
});

app.get('/forecast', async (req, res) => {
    const city = req.query.city;
    if (!city) {
        return res.status(400).json({ error: 'City name is required' });
    }

    try {
        const apiKey = process.env.WEATHER_API_KEY;
        if (!apiKey) {
             return res.status(500).json({ error: 'API key is missing' });
        }
        
        const url = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;
        const response = await axios.get(url);
        
        const forecasts = response.data.list;
        const dailyData = {};
        
        forecasts.forEach(f => {
            const dateStr = f.dt_txt.split(' ')[0];
            if (!dailyData[dateStr]) {
                dailyData[dateStr] = [];
            }
            dailyData[dateStr].push(f);
        });

        const uniqueDates = Object.keys(dailyData).sort();
        // Skip the first date (which is usually today) to show the next 5 days
        const datesToShow = uniqueDates.slice(1, 6);
        
        const result = datesToShow.map(dateStr => {
            const dayForecasts = dailyData[dateStr];
            // Find the forecast closest to 12:00 PM (noon)
            const bestForecast = dayForecasts.reduce((closest, current) => {
                const currentHour = parseInt(current.dt_txt.split(' ')[1].split(':')[0]);
                const closestHour = parseInt(closest.dt_txt.split(' ')[1].split(':')[0]);
                return Math.abs(currentHour - 12) < Math.abs(closestHour - 12) ? current : closest;
            });

            const date = new Date(bestForecast.dt * 1000);
            const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });

            return {
                date: dateStr,
                day: dayName,
                temp: Math.round(bestForecast.main.temp),
                temp_min: Math.round(bestForecast.main.temp_min),
                temp_max: Math.round(bestForecast.main.temp_max),
                condition: bestForecast.weather[0].main,
                description: bestForecast.weather[0].description,
                icon: bestForecast.weather[0].icon
            };
        });

        res.json({
            city: response.data.city.name,
            forecast: result
        });
    } catch (error) {
        if (error.response && error.response.status === 404) {
            return res.status(404).json({ error: 'City not found' });
        }
        res.status(500).json({ error: 'Error fetching forecast data' });
    }
});

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

module.exports = app;
