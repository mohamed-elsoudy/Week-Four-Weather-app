import { useEffect, useState } from 'react'
import { WiDaySunny, WiCloud, WiRain, WiSnow, WiFog } from "react-icons/wi";
import { FiSearch } from "react-icons/fi";
import './App.css'

const getWeatherIcon = (weather, size) => {
  switch (weather) {
    case "Clear": return <WiDaySunny size={size} />;
    case "Clouds": return <WiCloud size={size} />;
    case "Rain": return <WiRain size={size} />;
    case "Snow": return <WiSnow size={size} />;
    case "Thunderstorm": return <WiThunderstorm size={size} />;
    default: return <WiCloud size={size} />;
  }
};

function App() {
  const API_KEY = "9ab2cbe1c14f742dab55e7225cff942e";
  const API_URL = "https://api.openweathermap.org/data/2.5/forecast";
  
  const [city, setCity] = useState("Cairo");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    fetchWeather();
  }, []);

  const fetchWeather = async () => {
    setError(null);
    try {

      const response = await fetch(`${API_URL}?q=${city}&units=metric&appid=${API_KEY}`);
      if (!response.ok) throw new Error("City not found");
      const data = await response.json();
      
      setWeather({
        temp: data.list[0].main.temp,
        condition: data.list[0].weather[0].main,
        forecast: data.list.filter((_, i) => i % 8 === 0).map((day) => ({
          date: day.dt_txt.split(" ")[0],
          temp: day.main.temp,
          condition: day.weather[0].main,
        })),
      }); 
    } catch (err) {
      setError(err.message);
      setWeather(null);
    }
  };
  // console.log(weather);
  return (
    <>
      <h1>Weather App</h1>
      <div className="app">
        <p className="cities">Try ( Cairo, Riyadh, Dubai, London, Paris, New York )</p>
      {error && <p className="error">{error}</p>}
        <div className="search">
          <div>
            <input type="search" name="" id="" placeholder='Search for the country' onChange={(e) => {setCity(e.target.value)}}/>
            <FiSearch className="search-icon" />
          </div>
          <button className='show' onClick={() => {fetchWeather()}}>Show</button>
        </div>
      {weather && (
        <>
        <div className='results'>
          <div className="icon">
            {getWeatherIcon(weather.condition, 150)}
          </div>
          <h1>City Name : {city}</h1>
          <div className="current-temperature">Current Temprature: {weather.temp}<span></span> °C</div>
          <div className="weather-condition">Weather Condition:<span> {weather.condition} </span></div>
        </div>
        <div className="forecast">
          {weather.forecast.map((day, index) => (
          <div key={index}>
            <span>{day.date}</span>
            {getWeatherIcon(day.condition, 50)}
            <span>{day.temp} °C</span>
          </div>))}
        </div>
        </>
      )}
      </div>
    </>
  )
}

export default App
