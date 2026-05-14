document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('weather-form');
    const cityInput = document.getElementById('city-input');
    const loadingDiv = document.getElementById('loading');
    const errorDiv = document.getElementById('error-message');
    const errorText = document.getElementById('error-text');
    const weatherResult = document.getElementById('weather-result');

    // DOM Elements for weather data
    const cityNameEl = document.getElementById('city-name');
    const weatherDescEl = document.getElementById('weather-desc');
    const weatherIconEl = document.getElementById('weather-icon');
    const temperatureEl = document.getElementById('temperature');
    const humidityEl = document.getElementById('humidity');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const city = cityInput.value.trim();
        if (!city) return;

        // Reset UI
        weatherResult.classList.add('hidden');
        errorDiv.classList.add('hidden');
        loadingDiv.classList.remove('hidden');

        try {
            // Determine backend URL (use relative if hosted together, or localhost for local dev)
            const apiUrl = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
                ? `http://localhost:3000/weather?city=${encodeURIComponent(city)}` 
                : `/weather?city=${encodeURIComponent(city)}`;
                
            const response = await fetch(apiUrl);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to fetch weather data');
            }

            // Update UI with data
            cityNameEl.textContent = data.city;
            weatherDescEl.textContent = data.description;
            temperatureEl.textContent = Math.round(data.temperature);
            humidityEl.textContent = `${data.humidity}%`;
            
            // OpenWeatherMap icons
            weatherIconEl.src = `https://openweathermap.org/img/wn/${data.icon}@4x.png`;

            // Hide loading, show result
            loadingDiv.classList.add('hidden');
            
            // Re-trigger animation
            weatherResult.classList.remove('fade-in');
            void weatherResult.offsetWidth; // trigger reflow
            weatherResult.classList.add('fade-in');
            weatherResult.classList.remove('hidden');

        } catch (error) {
            loadingDiv.classList.add('hidden');
            errorText.textContent = error.message;
            errorDiv.classList.remove('hidden');
        }
    });
});
