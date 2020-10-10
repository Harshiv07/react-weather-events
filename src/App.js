import React, { useState } from 'react';
import './App.css';

const api = {
  key: process.env.REACT_APP_WEATHER_API_KEY,
  url: "https://api.openweathermap.org/data/2.5/"
}

function Greeting(props) {
  const isWeather = props.isWeather;
  console.log(isWeather);
  if(isWeather) {
    return <div className="error404">Entered location not found!</div> 
  }
  else {
    return <div className="error404">Welcome!</div>;
  }
}

function App() {
  const [query, setQuery] = useState('');
  const [weather, setWeather] = useState('');
  const [quote, setQuote] = useState('');

  const search = evt => {
    if(evt.key==="Enter") {
      fetch(`${api.url}weather?q=${query}&units=metric&APPID=${api.key}`)
        .then(res => res.json())
        .then(result => {
          setWeather(result);
          console.log(weather);
          setQuery('');
        })
      fetch("https://quotes-inspirational-quotes-motivational-quotes.p.rapidapi.com/quote?token=ipworld.info", {
        "method": "GET",
        "headers": {
          "x-rapidapi-host": "quotes-inspirational-quotes-motivational-quotes.p.rapidapi.com",
          "x-rapidapi-key": process.env.REACT_APP_QUOTE_API_KEY
        }
      })
      .then(response => response.json())
      .then(response => {
        setQuote(response);
        console.log(response);
      })
      .catch(err => {
        console.log(err);
      });
    }
  }

  const dateBuilder = (d) => {  
    let months = ["January", "February", "March", "April", "May", "June", "July", "August",
     "September", "October", "November", "December"];
    let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    
    let day = days[d.getDay()];
    let date = d.getDate();
    let month = months[d.getMonth()];
    let year = d.getFullYear();

    return `${day} ${date} ${month} ${year}`
  }

  return (
    <div className={(typeof weather.main != "undefined")
     ? ((weather.main.temp > 27)
      ? 'app-warm'
        :'app') 
      :'app'}>
      <main> 
        <div className="search-box">
          <input 
            type="text"
            className="search-bar"
            placeholder="Search 🔎"
            onChange={e => setQuery(e.target.value)}
            value={query}
            onKeyPress={search}
          />
        </div>
        {(typeof weather.main != "undefined") ? (
          
          <div className="weather-item">
            <div className="location-box">
              <div className="location">{weather.name}, {weather.sys.country} </div>
              <div className="date">{dateBuilder(new Date())}</div>
            </div>
            <div className="weather-box">
              <br/>
              <div className="temp">
                {Math.round(weather.main.temp)}°C
              </div>
              <div className="weather">
                {weather.weather[0].main}
              </div>
            </div>
            <div className="daily-quote">
              {quote.text}" - <i>{quote.author}</i>
            </div>
          </div>
        ): (
          <Greeting isWeather={weather}/>  
        )} 
      </main>
    </div>
  );
}

export default App;
