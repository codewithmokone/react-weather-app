import { useState, useEffect } from "react";
import Search from "../src/components/search/Search";
import CurrentWeather from "../src/components/current-weather/CurrentWeather";
import Forecast from "../src/components/forecast/Forecast";
import { WEATHER_API_URL, WEATHER_API_KEY, NEWS_API_KEY } from "./api";
import "./App.css";
import NewsGrid from "./components/News/NewsGrid";
import { Box, Paper } from "@mui/material";


function App() {

  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [city, setCity] = useState();
  const [sportsNews, setSportsNews] = useState([]);
  const [politicsNews, setPoliticsNews] = useState([]);
  const [technologyNews, setTechnologyNews] = useState([]);

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
        // setNews(news);
      })
  };

  const categories = ['sports', 'politics', 'technology']; // Array of categories

  // const fetchNewsByCategory = async () => {

  //   let localLat, localLong;

  //   // Wrap getCurrentPosition() method in a Promise that resolves with location data
  //   const getPosition = () => {
  //     return new Promise((resolve, reject) => {
  //       navigator.geolocation.getCurrentPosition(resolve, reject);
  //     });
  //   }

  //   // Await Promise to complete and assign location data to variables
  //   const position = await getPosition();
  //   localLat = position.coords.latitude;
  //   localLong = position.coords.longitude;


  //   // console.log("News:", technology, city, NEWS_API_KEY)
  //   try {
  //     const politicsApi = await fetch(`https://newsapi.org/v2/top-headlines?country=za&politics&lat=${localLat}&lon=${localLong}&apiKey=${NEWS_API_KEY}`);
  //     console.log("API URL: ", politicsApi);
  //     const politicsNews = await politicsApi.json();
  //     console.log("Response data: ", data); // Log the response data

  //     if (politicsNews.articles && politicsNews.articles.length > 0) {
  //       console.log("Categories: ", politicsNews.articles);
  //       // Assuming setNews is a function to update news state
  //       setPolitics(politicsNews.articles);
  //       return politicsNews.articles;
  //     } else {
  //       console.log("No articles found.");
  //       return [];
  //     }
  //   } catch (error) {
  //     console.error(`Error fetching ${categories} news:`, error);
  //     return [];
  //   }
  // };

  const fetchNewsByCategory = async (category) => {
    try {

      const getPosition = () => {
        return new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });
      }
      const position = await getPosition();
      const localLat = position.coords.latitude;
      const localLong = position.coords.longitude;

      await new Promise((resolve) => setTimeout(resolve, 3000));

      const response = await fetch(`https://newsapi.org/v2/top-headlines?country=za&category=${category}&lat=${localLat}&lon=${localLong}&apiKey=${NEWS_API_KEY}`);
      const newsData = await response.json();

      if (newsData.articles && newsData.articles.length > 0) {
        // Get the first 10 articles
        const firstTenArticles = newsData.articles.slice(0, 5);

        switch (category) {
          case 'sports':
            setSportsNews(firstTenArticles);
            break;
          case 'politics':
            setPoliticsNews(firstTenArticles);
            break;
          case 'technology':
            setTechnologyNews(firstTenArticles);
            break;
          default:
            break;
        }
      }
    } catch (error) {
      console.error(`Error fetching ${category} news:`, error);
    }
  };

  const fetchAllNews = async () => {
    for (const category of categories) {
      await fetchNewsByCategory(category);
    }
    // try {
    //   await Promise.all(categories.map(category => fetchNewsByCategory(category)));
    // } catch (error) {
    //   console.error('Error fetching news:', error);
    // }
  };

  // const fetchAllNews = async () => {
  //   try {
  //     const promises = categories.map(category => fetchNewsByCategory(category));
  //     const newsByCategory = await Promise.all(promises);
  //     const allNews = newsByCategory.flat(); // Merge news arrays into one
  //     console.log("All news: ", allNews)
  //     // setNews(allNews);
  //   } catch (error) {
  //     console.error('Error fetching news:', error);
  //   }
  // };


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
      } catch (err) {
        console.log(err)
      }
    }



    fetchData();
    // fetchNewsByCategory();
    fetchAllNews();
  }, [])


  return (
    <Box
      sx={{
        width: { xs: 400, sm: 500, md: 700 },
        height:{xs:'auto',sm:'auto',md:'100%'}
      }}
      className="container m-auto">
      <Box
        sx={{
          width: { xs: 400, sm: 600, md: 700 }
        }}
        className="search-section">
        <Search onSearchChange={handleOnSearchChange} />
      </Box>
      {weather && <Box>
        <CurrentWeather data={weather} />
      </Box>}
      <Box
        sx={{
          width: { xs: 400, sm: 600, md: 700 }
        }}
        className="local-forecast"
      >
        <h3 className="local-title">Forecast</h3>
        {forecast && <Box> <Forecast data={forecast} /></Box>}
      </Box>
      {/* News Section */}
      <Box
        sx={{
          width: { xs: 400, sm: 600, md: 700 },
          fontSize: { xs: 10, sm: 12, md: 14 },
        }}
        className="news-section">
        
          <Box>
            <h2 className="news-heading">Sports News</h2>
            {sportsNews && sportsNews.length > 0 &&<NewsGrid news={sportsNews} />}
          </Box>
        <Box >
          <h2 className="news-heading">Politics News</h2>
          {politicsNews && politicsNews.length > 0 && <NewsGrid news={politicsNews} />}
        </Box>
        <Box >
          <h2 className="news-heading">Technology News</h2>
          {technologyNews && technologyNews.length > 0 && <NewsGrid news={technologyNews} />}
        </Box>
      </Box>
    </Box>
  );
}

export default App;