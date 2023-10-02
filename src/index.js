import './style.css';

const displayController = (() => {
  const cache = cacheDOM();
  const current = {};
  const forecast = {};

  function cacheDOM() {
    const obj = {};

    obj.name = document.querySelector('.name');
    obj.icon = document.querySelector('.icon');

    return obj;
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

    console.log(current);
  }

  function getLocation(location) {
    fetch(`https://api.weatherapi.com/v1/forecast.json?key=4e226e0d360c42c1a28134634232609&q=${location}&days=7&aqi=no&alerts=no
    `, { mode: 'cors' })
      .then((res) => res.json())
      .then((res) => processData(res))
      .then(() => {
        cache.icon.src = current.icon;
      });
  }

  return {
    getLocation,
  };
})();
displayController.getLocation('Curitiba');
