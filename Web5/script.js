const apiKey = 'Ta2oPnApC2TWFeUbzI7c0Lk1DfY3RVOw';
const weatherInfoDiv = document.getElementById('weather-info');

function getWeatherByLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords;
            fetchWeatherData(latitude, longitude);
        }, error => {
            alert('Unable to retrieve your location.');
        });
    } else {
        alert('Geolocation is not supported by your browser.');
    }
}

function getWeatherByInput() {
    const location = document.getElementById('location-input').value;

    if (location) {
        fetch(`https://nominatim.openstreetmap.org/search?q=${location}&format=json`)
            .then(response => response.json())
            .then(data => {
                if (data.length > 0) {
                    const { lat, lon } = data[0];
                    fetchWeatherData(lat, lon);
                } else {
                    alert('Location not found.');
                }
            })
            .catch(error => {
                alert('Error fetching location data.');
                console.error(error);
            });
    } else {
        alert('Please enter a location.');
    }
}

function fetchWeatherData(lat, lon) {
    fetch(`https://api.tomorrow.io/v4/weather/forecast?location=${lat},${lon}&apikey=${apiKey}`)
        .then(response => response.json())
        .then(data => displayWeather(data))
        .catch(error => {
            alert('Error fetching weather data.');
            console.error(error);
        });
}

function displayWeather(data) {
    if (data && data.timelines && data.timelines.hourly && data.timelines.hourly.length > 0) {
        const currentWeather = data.timelines.hourly[0];
        const weatherData = currentWeather.values;
        weatherInfoDiv.innerHTML = `
            <div><strong>Temperature:</strong> ${weatherData.temperature}°C</div>
            <div><strong>Weather Condition:</strong> ${weatherData.weatherCode}</div>
            <div><strong>Humidity:</strong> ${weatherData.humidity}%</div>
            <div><strong>Wind Speed:</strong> ${weatherData.windSpeed} m/s</div>
        `;
    } else {
        alert('Data not found.');
        weatherInfoDiv.innerHTML = '';
    }
}
