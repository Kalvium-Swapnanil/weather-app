// Get the input field
var input = document.getElementById("city");

// Execute a function when the user presses a key on the keyboard
input.addEventListener("keypress", function(event) {
  // If the user presses the "Enter" key on the keyboard
  if (event.key === "Enter") {
    // Cancel the default action, if needed
    event.preventDefault();
    // Call the getWeather function
    getWeather();
  }
});

function getWeather() {
    const apiKey = 'a74bc3ac36e72719a419a56aa9e8a7a5';
    const cityInput = document.getElementById('city');
    const city = cityInput.value;

    if (!city) {
        alert('Please enter a city');
        return;
    }

    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;

    console.log('Current Weather URL:', currentWeatherUrl);
    console.log('Forecast URL:', forecastUrl);

    fetch(currentWeatherUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Current Weather Data:', data);
            if (data.cod === '404') {
                throw new Error(data.message);
            }
            displayWeather(data);
        })
        .catch(error => {
            console.error('Error fetching current weather data:', error);
            alert('Error fetching current weather data. Please try again.');
        });

    fetch(forecastUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Hourly Forecast Data:', data);
            displayHourlyForecast(data.list);
        })
        .catch(error => {
            console.error('Error fetching hourly forecast data:', error);
            alert('Please enter a valid location');
        });
}
function displayWeather(data) {
    const tempDivInfo = document.getElementById('temp-div');
    const weatherInfoDiv = document.getElementById('weather-info');
    const weatherIcon = document.getElementById('weather-icon');

    // Clear previous content
    weatherInfoDiv.innerHTML = '';
    tempDivInfo.innerHTML = '';

    const cityName = data.name;
    const temperature = Math.round(data.main.temp - 273.15); // Convert to Celsius
    const description = data.weather[0].description;
    const iconCode = data.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;
    const backgroundImageUrl = determineBackgroundImage(iconCode); // Function to determine background image URL based on weather condition

    const temperatureHTML = `<p>${temperature}°C</p>`;
    const weatherHtml = `<p>${cityName}</p><p>${description}</p>`;

    tempDivInfo.innerHTML = temperatureHTML;
    weatherInfoDiv.innerHTML = weatherHtml;
    weatherIcon.src = iconUrl;
    weatherIcon.alt = description;
    document.body.style.backgroundImage = `url('${backgroundImageUrl}')`;

    showImage();
}

function determineBackgroundImage(iconCode) {
    // Add conditions to determine background image URL based on weather condition
    switch (iconCode) {
        case '01d': // clear sky day
            return '#';
        case '01n': // clear sky night
            return 'clear_sky_night.jpg';
        case '02d': // few clouds day
            return 'few_clouds_day.jpg';
        case '02n': // few clouds night
            return 'few_clouds_night.jpg';
        case '03d': // scattered clouds day
        case '03n': // scattered clouds night
            return 'scattered_clouds.jpg';
        case '04d': // broken clouds day
        case '04n': // broken clouds night
            return 'broken_clouds.jpg';
        case '09d': // shower rain day
        case '09n': // shower rain night
            return 'shower_rain.jpg';
        case '10d': // rain day
        case '10n': // rain night
            return 'rain.jpg';
        case '11d': // thunderstorm day
        case '11n': // thunderstorm night
            return 'thunderstorm.jpg';
        case '13d': // snow day
        case '13n': // snow night
            return 'snow.jpg';
        case '50d': // mist day
        case '50n': // mist night
            return 'mist.jpg';
        default:
            return 'default_background.jpg'; // Default background image
    }
}


function displayHourlyForecast(hourlyData) {
    const hourlyForecastDiv = document.getElementById('hourly-forecast');

    // Clear previous content
    hourlyForecastDiv.innerHTML = '';

    const next24Hours = hourlyData.slice(0, 8); // Display the next 24 hours (3-hour intervals)

    next24Hours.forEach(item => {
        const dateTime = new Date(item.dt * 1000); // Convert timestamp to milliseconds
        const hour = dateTime.getHours();
        const temperature = Math.round(item.main.temp - 273.15); // Convert to Celsius
        const iconCode = item.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;

        const hourlyItemHtml = `
            <div class="hourly-item">
                <span>${hour}:00</span>
                <img src="${iconUrl}" alt="Hourly Weather Icon">
                <span>${temperature}°C</span>
            </div>
        `;

        hourlyForecastDiv.innerHTML += hourlyItemHtml;
    });
}

function showImage() {
    const weatherIcon = document.getElementById('weather-icon');
    weatherIcon.style.display = 'block'; // Make the image visible once it's loaded
}

