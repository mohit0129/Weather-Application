import React, { useState } from 'react';
import axios from 'axios';


function App() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState('');
  const api_id = "6f71eaf1b36f8687fe9b66de54cb7228"

  const Search = () => {
    axios.get(
        `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${api_id}`
      )
      .then((response) => {
        if (response.data && response.data.length > 0) {
          const { lat, lon } = response.data[0];
          axios.get(
              `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_id}`
            )
            .then((newResponse) => {
              setWeather(newResponse.data);
            })
            .catch((error) => {
              console.error(error);
              setWeather('');
            });
        } else {
          setWeather('');
        }
      })
      .catch((error) => {
        console.error(error);
        setWeather('');
      });
  };

  return (
    <div>
      <center>
        <br /><br /><br /><br />
        {weather && (
          <h4>
            {weather.name}, {weather.sys.country} <br /><br />
            <h1><b>{(weather.main.temp - 273.15).toFixed(0)}°C</b>
             {weather.weather[0].main}</h1>
            Humidity: {weather.main.humidity}% <br />
            Visibility: {weather.visibility / 1000}KM <br />
            Wind Speed: {(weather.wind.speed * 3.6).toFixed(0)}MPH<br/>
          </h4>
        )}
        <br /><br />
        <input type="text" value={city} onChange={(e) => setCity(e.target.value)} placeholder="eg. City name, ISO Code" /><br /><br />
        <button onClick={Search}>Search</button>
      </center>
    </div>
  );
}

export default App;