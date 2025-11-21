const key = "b95c5621689fd0a06c4a53b25661833d";

let reqCurrent = new XMLHttpRequest();


document.getElementById("searchButton").addEventListener('click', function() {
    let city = document.getElementById("searchCity").value.trim();
    if (city === "") {
        document.getElementById("currentWeatherInfo").innerHTML = "<p>Proszę wpisać nazwę miasta.</p>";
        document.getElementById("forecastInfo").innerHTML = "";
        return;
    }
    reqCurrent.open("GET", `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}`, false);
    reqCurrent.send(null);

    fetchForecast(city);
});

reqCurrent.onload = function() {
    console.log(reqCurrent.response);
    const result = JSON.parse(reqCurrent.response);
    showWeather(result);
};

async function fetchForecast(city) {
    const forecastContainer = document.getElementById("forecastInfo");
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${key}`;
    forecastContainer.innerHTML = '<h2>Ładowanie prognozy...</h2>';

    try {
        const response = await fetch(url);

        if (!response.ok) {
            if (response.status === 404) {
                throw new Error(`Błąd 404: Nie znaleziono prognozy dla miasta ${city}.`);
            }
            throw new Error(`Błąd HTTP: ${response.status}`);
        }

        const forecastJSON = await response.json();
        console.log(forecastJSON);
        showForecast(forecastJSON);

    } catch (error) {
        console.error("Błąd podczas pobierania prognozy:", error);
        forecastContainer.innerHTML = `<p style="color: red;">Wystąpił błąd: ${error.message}</p>`;
    }
}

function degreesToCardinal(degrees) {
    const directions = [
        "N", "NE", "E", "SE", "S", "SW", "W", "NW"
    ];
    // Obliczamy indeks segmentu (45 stopni na segment)
    // Dodajemy 22.5, aby środek segmentu N (0 stopni) przypadał na 22.5 stopni
    const index = Math.round((degrees % 360) / 45);

    // Używamy modulo 8, by zapewnić, że indeks zawsze mieści się w zakresie [0-7]
    return directions[index % 8];
}

function showWeather(weatherJSON) {
    const container = document.getElementById("currentWeatherInfo");
    if (!container) return;

    container.innerHTML = '';

    if (weatherJSON.cod && weatherJSON.cod !== 200) {
        container.innerHTML = `<p>Błąd: Nie znaleziono miasta lub problem z API. ${weatherJSON.message}</p>`;
        return;
    }

    // Konwersja temperatury z Kelwinów na Celsjusza
    const tempC = (weatherJSON.main.temp - 273.15).toFixed(1);
    const feelsLikeC = (weatherJSON.main.feels_like - 273.15).toFixed(1);
    const weatherDescription = weatherJSON.weather[0].description;
    const iconCode = weatherJSON.weather[0].icon;
    const windDirection = degreesToCardinal(weatherJSON.wind.deg);

    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

    container.innerHTML = `
        <h2>Aktualna Pogoda w ${weatherJSON.name}, ${weatherJSON.sys.country}</h2>
        <div class="weather-summary">
            <div class="description-text">
                <p>Temperatura: <strong>${tempC}°C</strong> (Odczuwalna: ${feelsLikeC}°C)</p>
                <p>Opis: ${weatherDescription}</p>
            </div>
            <img src="${iconUrl}" alt="${weatherDescription}" class="weather-icon">
        </div>
        <p>Wilgotność: ${weatherJSON.main.humidity}%</p>
        <p>Ciśnienie: ${weatherJSON.main.pressure} hPa</p>
        <p>Prędkość wiatru: ${weatherJSON.wind.speed} m/s (kierunek: ${windDirection} / ${weatherJSON.wind.deg}°)</p>
    `;
}

function showForecast(forecastJSON) {
    const container = document.getElementById("forecastInfo");
    if (!container) return;

    container.innerHTML = '';

    if (forecastJSON.cod && forecastJSON.cod !== '200') {
        container.innerHTML = `<p>Błąd: Nie znaleziono miasta lub problem z API. ${forecastJSON.message}</p>`;
        return;
    }

    container.innerHTML = `<h2>Prognoza 5-dniowa dla ${forecastJSON.city.name}</h2>`;

    // 1. Grupowanie prognoz według daty
    const forecastsByDay = {};

    forecastJSON.list.forEach(item => {
        // Ekstrakcja tylko daty (YYYY-MM-DD)
        const dateKey = item.dt_txt.substring(0, 10);

        if (!forecastsByDay[dateKey]) {
            forecastsByDay[dateKey] = [];
        }

        forecastsByDay[dateKey].push(item);
    });

    // 2. Iteracja po pogrupowanych dniach i tworzenie DIV-ów
    for (const dateKey in forecastsByDay) {

        const dayForecasts = forecastsByDay[dateKey];

        // Formatowanie daty dla wyświetlania
        const dateDisplay = new Date(dateKey).toLocaleDateString('pl-PL', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        // Tworzenie głównego kontenera dla dnia
        const dayContainer = document.createElement('div');
        dayContainer.className = 'day-forecast';

        // Nagłówek dla daty
        dayContainer.innerHTML = `<h3>${dateDisplay}</h3>`;

        // Kontener na poszczególne godziny
        const hoursContainer = document.createElement('div');
        hoursContainer.className = 'hours-container';

        // 3. Iteracja po poszczególnych godzinach w danym dniu
        dayForecasts.forEach(item => {
            const time = new Date(item.dt * 1000).toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' });
            const tempC = (item.main.temp - 273.15).toFixed(1);
            const description = item.weather[0].description;
            const iconCode = item.weather[0].icon;
            const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;

            const encodedData = encodeURIComponent(JSON.stringify(item));

            // Tworzenie DIV-a dla pojedynczej godziny
            const hourDiv = document.createElement('div');
            hourDiv.className = 'hour-entry';
            hourDiv.setAttribute('data-forecast-details', encodedData);
            hourDiv.onclick = showDetails;

            hourDiv.innerHTML = `
                <div class="time-temp-group">
                    <span class="forecast-time">${time}</span>
                    <span class="forecast-temp">${tempC}°C</span>
                </div>
                <div class="description-group">
                    <span class="forecast-description">${description}</span>
                    <img src="${iconUrl}" alt="${description}" class="weather-icon-small">
                </div>
            `;

            hoursContainer.appendChild(hourDiv);
        });

        dayContainer.appendChild(hoursContainer);
        container.appendChild(dayContainer);
    }

    function showDetails(event) {
        const clickedElement = event.currentTarget;
        const encodedData = clickedElement.getAttribute('data-forecast-details');

        if (!encodedData) return;
        const existingDetails = clickedElement.nextElementSibling;
        const isClosing = existingDetails && existingDetails.classList.contains('detailed-info');

        document.querySelectorAll('.detailed-info').forEach(el => el.remove());

        document.querySelectorAll('.hour-entry').forEach(el => el.classList.remove('active-details'));


        if (isClosing) {
            return;

        } else {
            const forecastData = JSON.parse(decodeURIComponent(encodedData));
            const feelsLikeC = (forecastData.main.feels_like - 273.15).toFixed(1);
            const timeDisplay = new Date(forecastData.dt * 1000).toLocaleTimeString('pl-PL', {
                weekday: 'short',
                day: 'numeric',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit'
            });

            const windDirection = degreesToCardinal(forecastData.wind.deg);
            const detailsHTML = `
            <div class="details-popup-content">
                <h3>Szczegółowa Prognoza na ${timeDisplay}</h3>
                <p>Temperatura odczuwalna: <strong>${feelsLikeC}°C</strong></p>
                <p>Wilgotność: ${forecastData.main.humidity}%</p>
                <p>Ciśnienie: ${forecastData.main.pressure} hPa</p>
                <p>Prędkość wiatru: ${forecastData.wind.speed} m/s (kierunek: ${windDirection} / ${forecastData.wind.deg}°)</p>
                <p>Widoczność: ${(forecastData.visibility / 1000).toFixed(1)} km</p>
            </div>
        `;

            clickedElement.classList.add('active-details');

            const detailsDiv = document.createElement('div');
            detailsDiv.className = 'detailed-info';
            detailsDiv.innerHTML = detailsHTML;
            clickedElement.insertAdjacentElement('afterend', detailsDiv);
        }
    }
}
