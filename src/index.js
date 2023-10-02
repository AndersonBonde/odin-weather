import './style.css';

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

    return obj;
  }

  function displayCurrentData() {
    cache.name.textContent = current.name;
    cache.condition.textContent = current.condition;
    cache.time.textContent = current.time;
    cache.temp.textContent = `${current.temp_c}°C`;
    cache.icon.src = current.icon;
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
  }

  function getLocation(location) {
    fetch(`https://api.weatherapi.com/v1/forecast.json?key=4e226e0d360c42c1a28134634232609&q=${location}&days=7&aqi=no&alerts=no
    `, { mode: 'cors' })
      .then((res) => res.json())
      .then((res) => processData(res))
      .then(() => displayCurrentData());
  }

  return {
    getLocation,
  };
})();
displayController.getLocation('Curitiba');

const locationText = document.querySelector('#location');
const searchBtn = document.querySelector('.search-button');

searchBtn.addEventListener('click', () => {
  displayController.getLocation(locationText.value);
});
document.addEventListener('keypress', (e) => {
  if(e.code === 'Enter') {
    displayController.getLocation(locationText.value);
    locationText.value = '';
  }
})