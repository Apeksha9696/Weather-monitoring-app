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
    const windSpeedEl = document.getElementById('wind-speed');
    const forecastRowEl = document.getElementById('forecast-row');
    const favBtn = document.getElementById('fav-btn');
    const favoritesContainer = document.getElementById('favorites-container');

    // Local Storage Bookmarks
    let favorites = JSON.parse(localStorage.getItem('weather_favorites')) || [];
    let currentCity = '';

    // Initialize UI
    renderFavorites();

    form.addEventListener('submit', async (e) => {
        if (e) e.preventDefault();
        const city = cityInput.value.trim();
        if (!city) return;

        // Reset UI
        weatherResult.classList.add('hidden');
        errorDiv.classList.add('hidden');
        loadingDiv.classList.remove('hidden');

        try {
            // Determine backend URL base
            const baseUrl = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
                ? 'http://localhost:3000' 
                : '';
                
            // Fetch current weather and 5-day forecast concurrently
            const [weatherRes, forecastRes] = await Promise.all([
                fetch(`${baseUrl}/weather?city=${encodeURIComponent(city)}`),
                fetch(`${baseUrl}/forecast?city=${encodeURIComponent(city)}`)
            ]);

            const weatherData = await weatherRes.json();
            const forecastData = await forecastRes.json();

            if (!weatherRes.ok) {
                throw new Error(weatherData.error || 'Failed to fetch weather data');
            }
            if (!forecastRes.ok) {
                throw new Error(forecastData.error || 'Failed to fetch forecast data');
            }

            // Update theme based on current weather condition
            updateTheme(weatherData.condition);

            // Update UI with current weather details
            cityNameEl.textContent = weatherData.city;
            weatherDescEl.textContent = weatherData.description;
            temperatureEl.textContent = Math.round(weatherData.temperature);
            humidityEl.textContent = `${weatherData.humidity}%`;
            
            // Convert wind speed from m/s to km/h
            const windSpeedKmH = Math.round(weatherData.windSpeed * 3.6);
            windSpeedEl.textContent = `${windSpeedKmH} km/h`;
            
            // OpenWeatherMap icons
            weatherIconEl.src = `https://openweathermap.org/img/wn/${weatherData.icon}@4x.png`;
            weatherIconEl.alt = weatherData.description;

            // Render 5-day forecast cards
            renderForecast(forecastData.forecast);

            // Update Favorite Star button state
            updateFavBtnState(weatherData.city);

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

    // Favorites click event listener
    favBtn.addEventListener('click', toggleFavorite);

    // Update background gradient class based on condition
    function updateTheme(condition) {
        const themeMap = {
            'clear': 'theme-clear',
            'clouds': 'theme-clouds',
            'rain': 'theme-rain',
            'drizzle': 'theme-rain',
            'thunderstorm': 'theme-storm',
            'snow': 'theme-snow',
            'mist': 'theme-clouds',
            'smoke': 'theme-clouds',
            'haze': 'theme-clouds',
            'fog': 'theme-clouds'
        };
        const themeClass = themeMap[condition.toLowerCase()] || '';
        
        // Remove existing theme classes
        document.body.className = `min-h-screen flex items-center justify-center p-4 font-outfit text-primary transition-all duration-500 ${themeClass}`;
    }

    // Render 5-day forecast card elements
    function renderForecast(forecastList) {
        forecastRowEl.innerHTML = '';
        forecastList.forEach(item => {
            const card = document.createElement('div');
            card.className = 'flex-shrink-0 w-20 bg-white/20 hover:bg-white/30 border border-white/20 rounded-2xl p-2.5 flex flex-col items-center backdrop-blur-md transition-all duration-300';
            card.innerHTML = `
                <p class="text-xs font-semibold text-secondary">${item.day}</p>
                <img src="https://openweathermap.org/img/wn/${item.icon}@2x.png" alt="${item.condition}" class="w-10 h-10 my-0.5 filter-white">
                <p class="text-sm font-bold text-primary">${item.temp}°</p>
                <p class="text-[9px] text-secondary font-medium tracking-wide truncate max-w-full text-center capitalize">${item.condition}</p>
            `;
            forecastRowEl.appendChild(card);
        });
    }

    // Update Favorites Star Icon and tooltip
    function updateFavBtnState(city) {
        currentCity = city;
        const isFav = favorites.some(fav => fav.toLowerCase() === city.toLowerCase());
        const starIcon = favBtn.querySelector('i');
        if (isFav) {
            starIcon.className = 'fas fa-star text-yellow-500 animate-pulse';
            favBtn.title = 'Remove from Favorites';
        } else {
            starIcon.className = 'far fa-star text-secondary';
            favBtn.title = 'Add to Favorites';
        }
    }

    // Render Favorite pills below search form
    function renderFavorites() {
        favoritesContainer.innerHTML = '';
        if (favorites.length === 0) {
            favoritesContainer.classList.add('hidden');
            return;
        }
        favoritesContainer.classList.remove('hidden');

        favorites.forEach(city => {
            const pill = document.createElement('div');
            pill.className = 'flex items-center gap-1.5 bg-white/30 border border-white/10 hover:bg-white/50 hover:border-white/30 px-3 py-1 rounded-full text-xs font-semibold cursor-pointer transition-all duration-300 text-primary shadow-sm';
            
            const nameSpan = document.createElement('span');
            nameSpan.textContent = city;
            nameSpan.className = 'fav-name';
            nameSpan.addEventListener('click', () => {
                cityInput.value = city;
                // Dispatch form submit event
                form.dispatchEvent(new Event('submit'));
            });
            
            const removeBtn = document.createElement('i');
            removeBtn.className = 'fas fa-times text-[10px] opacity-50 hover:opacity-100 ml-1 cursor-pointer transition-all';
            removeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                removeFavorite(city);
            });
            
            pill.appendChild(nameSpan);
            pill.appendChild(removeBtn);
            favoritesContainer.appendChild(pill);
        });
    }

    // Toggle current city to/from favorites
    function toggleFavorite() {
        if (!currentCity) return;
        const index = favorites.findIndex(fav => fav.toLowerCase() === currentCity.toLowerCase());
        if (index > -1) {
            favorites.splice(index, 1);
        } else {
            favorites.push(currentCity);
        }
        localStorage.setItem('weather_favorites', JSON.stringify(favorites));
        updateFavBtnState(currentCity);
        renderFavorites();
    }

    // Remove specific favorite city from pills click
    function removeFavorite(city) {
        favorites = favorites.filter(fav => fav.toLowerCase() !== city.toLowerCase());
        localStorage.setItem('weather_favorites', JSON.stringify(favorites));
        if (currentCity && currentCity.toLowerCase() === city.toLowerCase()) {
            updateFavBtnState(currentCity);
        }
        renderFavorites();
    }
});
