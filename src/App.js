import { useState, useEffect } from "react";
import Search from "../src/components/search/Search";
import CurrentWeather from "../src/components/current-weather/CurrentWeather";
import Forecast from "../src/components/forecast/Forecast";
import { WEATHER_API_URL, WEATHER_API_KEY, NEWS_API_KEY } from "./api";
import "./App.css";
import NewsGrid from "./components/News/NewsGrid";


function App() {

  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [city, setCity] = useState();
  const [news, setNews] = useState([]);



  // Handles search functionality
  const handleOnSearchChange = (searchData) => {

    const [lat, lon] = searchData.value.split(" ");

    const currentWeatherFetch = fetch(
      `${WEATHER_API_URL}/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}`
    );
    const forecastFetch = fetch(
      `${WEATHER_API_URL}/forecast?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}`
    );
    Promise.all([currentWeatherFetch, forecastFetch])
      .then(async (response) => {
        const weatherResponse = await response[0].json();
        const forcastResponse = await response[1].json();

        setWeather({ city: searchData.label, ...weatherResponse });
        setForecast({ city: searchData.label, ...forcastResponse });
        setCity({ city: searchData.label, ...weatherResponse });
      })
      .catch(console.log)

    fetch(`https://newsapi.org/v2/everything?q=${city}&apiKey=${NEWS_API_KEY}`)
      .then(res => res.json())
      .then(data => {
        let news = data.articles;
        setNews(news);
      })
  };


  // Getting current location weather and news
  useEffect(() => {

    const fetchData = async () => {
      try {

        let localLat, localLong;

        // Wrap getCurrentPosition() method in a Promise that resolves with location data
        const getPosition = () => {
          return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
          });
        }

        // Await Promise to complete and assign location data to variables
        const position = await getPosition();
        localLat = position.coords.latitude;
        localLong = position.coords.longitude;

        // Use location data to construct API URL and fetch weather information
        await fetch(`${WEATHER_API_URL}/weather/?lat=${localLat}&lon=${localLong}&APPID=${WEATHER_API_KEY}`)
          .then(res => res.json())
          .then(result => {
            let localWeather = result;
            setWeather(localWeather);
            setCity(localWeather.name);
          });

        await fetch(`${WEATHER_API_URL}/forecast?lat=${localLat}&lon=${localLong}&appid=${WEATHER_API_KEY}`)
          .then(res => res.json())
          .then(result => {
            let localForecast = result;
            setForecast(localForecast);
          });

        await fetch(`https://newsapi.org/v2/everything?q=${city}&apiKey=${NEWS_API_KEY}`)
          .then(res => res.json())
          .then(data =>{
            let news = data.articles
            setNews(news)
          });
      } catch (err) {
        console.log(err)
      }
    }

    fetchData();

  }, [])


  return (
    <div className="container">
      <div className="search-section">
        <Search onSearchChange={handleOnSearchChange} />
      </div>
      {weather && <div>
        <CurrentWeather data={weather} />
      </div>}
      <div className="local-forecast">
        <h3 className="local-title">Forecast</h3>
        {forecast && <div>
          <Forecast data={forecast} />
        </div>}
      </div>
      <div className="news-section">
        <h3 className="news-heading">News</h3>
        {news && <NewsGrid news={news} />}
      </div>
    </div>
  );
}

export default App;