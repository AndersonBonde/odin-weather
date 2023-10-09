import './style.css';
import '@fortawesome/fontawesome-free/js/fontawesome';
import '@fortawesome/fontawesome-free/js/solid';

const displayController = (() => {
  const cache = cacheDOM();
  const current = {};
  const forecast = {};

  function cacheDOM() {
    const obj = {};

    obj.name = document.querySelector('.name');
    obj.condition = document.querySelector('.condition');
    obj.time = document.querySelector('.time');
    obj.temp = document.querySelector('.temp');
    obj.icon = document.querySelector('.icon');
    obj.humidity = document.querySelector('.humidity .value');
    obj.wind = document.querySelector('.wind .value');
    obj.rain = document.querySelector('.rain .value');
    obj.day = document.querySelectorAll('.day');

    return obj;
  }

  function displayData() {
    cache.name.textContent = current.name;
    cache.condition.textContent = current.condition;
    cache.time.textContent = current.time;
    cache.temp.textContent = `${current.temp_c}°C`;
    cache.icon.src = current.icon;
    cache.humidity.textContent = `${current.humidity} %`;
    cache.wind.textContent = `${current.wind} km/h`;
    cache.rain.textContent = `${forecast.rain} %`;

    cache.day.forEach((curr, idx) => {
      const day = curr.querySelector('.day-text');
      const max = curr.querySelector('.max-temp');
      const min = curr.querySelector('.min-temp');
      const icon = curr.querySelector('.day-icon');

      if (idx === 0) {
        day.textContent = 'Today';
      } else {
        day.textContent = `Day ${forecast.day[idx].date}`;
      }

      max.textContent = `${Math.round(forecast.day[idx].maxtemp_c)}°C`;
      min.textContent = `${Math.round(forecast.day[idx].mintemp_c)}°C`;
      icon.src = forecast.day[idx].icon;
    });
  }

  function processData(data) {
    current.name = data.location.name;
    current.time = data.location.localtime;
    current.condition = data.current.condition.text;
    current.icon = data.current.condition.icon;
    current.temp_c = data.current.temp_c;
    current.feel_c = data.current.feelslike_c;
    current.temp_f = data.current.temp_f;
    current.feel_f = data.current.feelslike_f;
    current.humidity = data.current.humidity;
    current.wind = data.current.wind_kph;

    forecast.rain = data.forecast.forecastday[0].day.daily_chance_of_rain;
    forecast.day = [];

    data.forecast.forecastday.forEach((curr, index) => {
      forecast.day[index] = {};
      forecast.day[index].maxtemp_c = curr.day.maxtemp_c;
      forecast.day[index].mintemp_c = curr.day.mintemp_c;
      forecast.day[index].icon = curr.day.condition.icon;
      forecast.day[index].date = curr.date.split('-')[2];
    });
  }

  function getLocation(location) {
    fetch(`https://api.weatherapi.com/v1/forecast.json?key=4e226e0d360c42c1a28134634232609&q=${location}&days=7&aqi=no&alerts=no
    `, { mode: 'cors' })
      .then((res) => res.json())
      .then((res) => processData(res))
      .then(() => displayData());
  }

  return {
    getLocation,
  };
})();
displayController.getLocation('Curitiba');

// Functionality to search by location;

const locationText = document.querySelector('#location');
const searchBtn = document.querySelector('.search-button');

searchBtn.addEventListener('click', () => {
  displayController.getLocation(locationText.value);
});

// Add enter shortcut to search for the location;
document.addEventListener('keypress', (e) => {
  if (e.code === 'Enter') {
    displayController.getLocation(locationText.value);
    locationText.value = '';
  }
});
