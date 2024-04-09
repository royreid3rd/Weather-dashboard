const API_KEY = "9abd503499bb5c23e7b78e23c934be0c";

async function searchCity(city) {
    try {
      const cityData = await fetchCityData(city);
      const forecastData = await fetchForecastData(cityData.coord.lat, cityData.coord.lon);
      displayForecast(city, forecastData);
      displayCurrentDayForecast(city, forecastData);
      updateSearchHistory(city);
    } catch (error) {
      console.error("Error:", error);
    }
  }
  
  async function fetchCityData(city) {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`);
    if (!response.ok) {
      throw new Error("City not found.");
    }
    return response.json();
  }
  
  async function fetchForecastData(lat, lon) {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`);
    if (!response.ok) {
      throw new Error("Forecast data not available.");
    }
    return response.json();
  }
  
  function displayCurrentDayForecast(city, forecastData) {
    const currentDayForecast = forecastData.list[0];
    const currentDate = new Date(currentDayForecast.dt * 1000).toLocaleDateString();
    const currentConditions = currentDayForecast.weather[0].description;
    const currentHighTemp = convertKelvinToFahrenheit(currentDayForecast.main.temp_max);
    const currentLowTemp = convertKelvinToFahrenheit(currentDayForecast.main.temp_min);
  
    const bannerCity = document.getElementById("banner-city");
    const bannerDate = document.getElementById("banner-date");
    const bannerConditions = document.getElementById("banner-conditions");
    const bannerHighTemp = document.getElementById("banner-high-temp");
    const bannerLowTemp = document.getElementById("banner-low-temp");
    console.log("Inside displayCurrentDayForecast function");
    bannerCity.textContent = city;
    bannerDate.textContent = `Date: ${currentDate}`;
    bannerConditions.textContent = `Conditions: ${currentConditions}`;
    bannerHighTemp.textContent = `High Temperature: ${currentHighTemp}°F`;
    bannerLowTemp.textContent = `Low Temperature: ${currentLowTemp}°F`;
  }
  

  function displayForecast(city, forecastData) {
    const forecastWrapper = document.getElementById("forecast-wrapper");
    forecastWrapper.innerHTML = "";
  
    const cardContainer = document.createElement("div");
    cardContainer.classList.add("card-container");
  
    const uniqueDates = {};
    forecastData.list.forEach(day => {
      const date = new Date(day.dt * 1000).toLocaleDateString();
      if (!uniqueDates[date]) {
        uniqueDates[date] = true;
        const conditions = day.weather[0].description;
        const highTemp = convertKelvinToFahrenheit(day.main.temp_max);
        const lowTemp = convertKelvinToFahrenheit(day.main.temp_min);
        const card = createCard(city, date, conditions, highTemp, lowTemp);
        cardContainer.appendChild(card);
      }
    });
  
    forecastWrapper.appendChild(cardContainer);
  }
  
  function createCard(city, date, conditions, highTemp, lowTemp) {
    const card = document.createElement("div");
    card.classList.add("card");
    const cardContent = `
      <h3>${city}</h3>
      <p>Date: ${date}</p>
      <p>Conditions: ${conditions}</p>
      <p>High Temperature: ${highTemp}°F</p>
      <p>Low Temperature: ${lowTemp}°F</p>
    `;
    card.innerHTML = cardContent;
    return card;
  }
  
  function convertKelvinToFahrenheit(kelvin) {
    return ((kelvin - 273.15) * 9/5 + 32).toFixed(2);
  }
  
  function updateSearchHistory(city) {
    const searches = JSON.parse(localStorage.getItem("searches")) || [];
    searches.push(city);
    localStorage.setItem("searches", JSON.stringify(searches));
    displayPreviousSearches(searches);
  }
  
  function displayPreviousSearches(searches) {
    const previousSearchesContainer = document.getElementById("previous-searches");
    previousSearchesContainer.innerHTML = "";
    searches.forEach(search => {
      const button = createSearchButton(search);
      previousSearchesContainer.appendChild(button);
    });
  }
  
  function createSearchButton(search) {
    const button = document.createElement("button");
    button.textContent = search;
    button.addEventListener("click", () => {
      searchCity(search);
    });
    return button;
  }
  
  function clearSearchHistory() {
    localStorage.removeItem("searches");
    displayPreviousSearches([]);
  }
  
  function start() {
    const searchButton = document.getElementById("search-button");
    searchButton.addEventListener("click", () => {
      const cityInput = document.getElementById("city-input").value;
      searchCity(cityInput);
    });
  
    const clearButton = document.getElementById("clear-button");
    clearButton.addEventListener("click", clearSearchHistory);
  
    const searches = JSON.parse(localStorage.getItem("searches")) || [];
    displayPreviousSearches(searches);
  }
  
  start();