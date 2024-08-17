import React, { useState } from 'react';
import axios from 'axios';
import './App.css';
import searchIcon from './search.png';

function App() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const api_id = "6f71eaf1b36f8687fe9b66de54cb7228";

  const Search = () => {
    axios.get(
      `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${api_id}`
    ).then((response) => {
      if (response.data && response.data.length > 0) {
        const { lat, lon } = response.data[0];
        axios.get(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_id}`
        ).then((newResponse) => {
          setWeather(newResponse.data);
          setCity('');
        }).catch((error) => {
          console.error(error);
          setWeather(null);
        });

        axios.get(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${api_id}`
        ).then((forecastResponse) => {
          setForecast(forecastResponse.data);
        }).catch((error) => {
          console.error(error);
          setForecast(null);
        });
      } else {
        setWeather(null);
        setForecast(null);
      }
    }).catch((error) => {
      console.error(error);
      setWeather(null);
      setForecast(null);
    });
  };

  const getDayName = (dt_txt) => {
    const date = new Date(dt_txt);
    return date.toLocaleDateString('en-US', { weekday: 'long' });
  };

  const getHour = (dt_txt) => {
    const date = new Date(dt_txt);
    return date.getHours();
  };

  return (
    <>
      <nav className="nav">
        <div className="location">
          {weather ? `${weather.name}, ${weather.sys.country}` : "Search a location"}
        </div>
        <div className="custom-search">
          <input type="text" value={city} onChange={(e) => setCity(e.target.value)} placeholder="Search for a city..." className="custom-search-input" />
          <button onClick={Search} className="custom-search-button"><img src={searchIcon} className="buttonimg" alt="search" /></button>
        </div>

      </nav>
      
      <div className="container">
        <div className="left-section">
          {weather && (
            <div className="current-weather">
              <p>The weather condition in</p>
              <h4>{weather.name}, {weather.sys.country}</h4> is
              <h1>{(weather.main.temp - 273.15).toFixed(0)}°C</h1>
              <img src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} alt={weather.weather[0].description} />
              <p>Condition: {weather.weather[0].description}</p>
              <p>Humidity: {weather.main.humidity}%</p>
              <p>Visibility: {weather.visibility / 1000} KM</p>
              <p>Wind Speed: {(weather.wind.speed * 3.6).toFixed(0)} MPH</p>
            </div>
          )}
        </div>
        <div className="right-section">
          {forecast && (
            <>
              <h5 className="headings">Weekly Forecast</h5>
              <div className="weekly-forecast">
                {forecast.list
                  .filter((item, index, self) =>
                    index === self.findIndex((t) => getDayName(t.dt_txt) === getDayName(item.dt_txt))
                  )
                  .slice(0, 6)
                  .map((item, index) => (
                    <div className="forecast-card" key={index}>
                      <h4>{getDayName(item.dt_txt)}</h4>
                      <hr />
                      <img
                        src={`http://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`}
                        alt={item.weather[0].description}
                      />
                      <h4>{(item.main.temp - 273.15).toFixed(0)}°C</h4>
                      <p>{item.weather[0].description}</p>
                    </div>
                  ))}
              </div>

              <h5 className="headings">Hourly Forecast</h5>
              <div className="hourly-forecast">
                {forecast.list
                  .filter(item => {
                    const itemDate = new Date(item.dt_txt);
                    const now = new Date();
                    return (
                      itemDate > now
                    );
                  })
                  .slice(0, 6)
                  .map((item, index) => (
                    <div className="forecast-card" key={index}>
                      <h4>{getHour(item.dt_txt)}:00</h4>
                      <hr />
                      <img
                        src={`http://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`}
                        alt={item.weather[0].description}
                      />
                      <h4>{(item.main.temp - 273.15).toFixed(0)}°C</h4>
                      <p>{item.weather[0].description}</p>
                    </div>
                  ))}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default App;
