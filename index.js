// footer
const today = new Date();
const thisYear = today.getFullYear();
const footer = document.createElement("footer");
const body = document.querySelector("body");
body.appendChild(footer);
const copyright = document.createElement("p");
copyright.innerHTML = `Natalia Novikova &copy ${thisYear}`;
footer.appendChild(copyright);

document.addEventListener("DOMContentLoaded", function () {
  async function fetchData() {
    try {
     const response = await fetch(
        "https://api.open-meteo.com/v1/forecast?latitude=38.6171&longitude=-121.3283&current=temperature_2m,is_day,weather_code,uv_index&daily=weather_code,temperature_2m_max,temperature_2m_min,uv_index_max&temperature_unit=celsius&wind_speed_unit=kmh&timezone=auto&forecast_days=14"
      );

      if (!response.ok) {
        throw new Error("Request failed");
      }

      const data = await response.json();
      console.log(data);

      // Extract current weather data
      const timeNow = new Date(data.current.time + "Z");
      const temperatureNow = data.current.temperature_2m;
      const weatherCodeNow = data.current.weather_code;
      const isDayNow = data.current.is_day === 1;
      const uvIndexNow = data.current.uv_index; // Get UV Index
     
      // Update current weather display
      updateWeatherDisplay (timeNow, temperatureNow, weatherCodeNow, isDayNow, uvIndexNow);
  
    } catch (error) {
      console.error("An error occurred:", error);
    }
  }

  fetchData();

  function interpretWeatherCode(code) {
    const weatherConditions = {
      0: "Clear sky",
      2: "Cloudy",
      3: "Overcast",
      45: "Fog",
      51: "Drizzle: Light",
      53: "Drizzle: Moderate",
      55: "Drizzle: Dense intensity",
      61: "Rain: Slight",
      63: "Rain: Moderate",
      65: "Rain: Heavy intensity",
      71: "Snow fall: Slight",
      73: "Snow fall: Moderate",
      80: "Rain showers: Slight",
      81: "Rain showers: Moderate",
      82: "Rain showers: Violent",
      95: "Thunderstorm: Slight or moderate",
      
    };

    return weatherConditions[code] || "Unknown weather condition";
  }

  function getWeatherImagePath(code, isDay) {
    const weatherImagesDay = {
      0: "sunny.png", 
      1: "mainly_clear.png",
      2: "partly_cloudy.png", 
      3: "overcast.png", 
      45: "fog.png", 
      51: "drizzle_light.png", 
      53: "drizzle_moderate.png", 
      55: "drizzle_dense.png", 
      61: "rain_slight.png",
      63: "rain_moderate.png",
      65: "rain_heavy.png",
      71: "Snow fall: Slight.png",
      73: "Snow fall: Moderate.png",
      80: "Rain showers Slight.png",
      81: "Rain showers Moderate.png",
      82: "Rain showers Violent.png",
      95: "Thunderstorm Slight or moderate.png",      
    };

    const weatherImagesNight = {
      0: "night_clear.png",
      1: "night_mainly_clear.png",
      2: "night_partly_cloudy.png",
      3: "night_overcast.png",
    };

    return isDay
      ? weatherImagesDay[code] || "default.png"
      : weatherImagesNight[code] || "default_night.png";
  }

  function updateWeatherDisplay (time, temperature, weatherCode, isDay, uvIndex) {
    const date = time.toLocaleDateString("en-US", {
        weekday: 'short',
        month: 'short', 
        day: '2-digit'
    });
    const dayOfWeek = time.toLocaleDateString("en-US", { weekday: "long" });
    const weatherCondition = interpretWeatherCode(weatherCode);
    const weatherImagePath = getWeatherImagePath(weatherCode, isDay);
    
    document.getElementById ("date_now").innerHTML = `<strong>Date: ${date}</strong>`;
    document.getElementById ("weekday_now").innerHTML = `<strong>Weekday: ${dayOfWeek}</strong>`;
    document.getElementById ("temperature_now").innerHTML = `<strong>${temperature} °C</strong>`;
    document.getElementById ("weather_condition_now").innerHTML = `<strong>Weather Condition: ${weatherCondition}</strong>`;
    document.getElementById ("weather_image_now").src = `./images/${weatherImagePath}`;
    document.getElementById ("uv_index_now").innerHTML = `<strong>UV Index: ${uvIndex}</strong>`;
  }

  function updateTomorrowWeatherDisplay(time, temperature, weatherCode, uvIndex) {
    const date = time.toLocaleDateString("en-US", {
        weekday: 'short',
        month: 'short', 
        day: '2-digit'
    });
    const dayOfWeek = time.toLocaleDateString("en-US", { weekday: "long" });
    const weatherCondition = interpretWeatherCode(weatherCode);
    const weatherImagePath = getWeatherImagePath(weatherCode, true);

    document.getElementById ("date_tomorrow").innerHTML = `<strong>Date:</strong> ${date}`;
    document.getElementById ("weekday_tomorrow").innerHTML = `<strong>Weekday:</strong> ${dayOfWeek}`;
    document.getElementById ("temperature_tomorrow").innerHTML = `<strong></strong> ${temperature} °C`;
    document.getElementById ("weather_condition_tomorrow").innerHTML = `<strong>Weather Condition:</strong> ${weatherCondition}`;
    document.getElementById ("weather_image_tomorrow").src = `./images/${weatherImagePath}`;
    document.getElementById ("uv_index_tomorrow").innerHTML = `<strong>UV Index:</strong> ${uvIndex}`;
  }

  async function fetchdata() {
      try {
          const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=38.6171&longitude=-121.3283&current=temperature_2m,is_day,weather_code,uv_index&daily=weather_code,temperature_2m_max,temperature_2m_min,uv_index_max&temperature_unit=celsius&wind_speed_unit=kmh&timezone=auto&forecast_days=14');

          if (!response.ok) throw new Error('Request failed');

         const data = await response.json();
         console.log(data);

          const timeNow = new Date(data.current.time);
          console.log("timeNow:", timeNow);
       
          const timeTomorrow = new Date(data.daily.time[2]);
          timeTomorrow.setHours(timeTomorrow.getHours() + 6);
          console.log("timeTomorrow:", timeTomorrow);

          const temperatureTomorrow =data.daily.temperature_2m_max[2];
          const weatherCodeTomorrow =data.daily.weather_code[2];
          // const isDayNow = timeNow.getHours() >= 6 && timeNow.getHours() < 18;
          const uvIndexTomorrow = data.daily.uv_index_max[2]; // Get UV Index

       
          updateTomorrowWeatherDisplay(timeTomorrow, temperatureTomorrow, weatherCodeTomorrow,uvIndexTomorrow);

          document.getElementById('toggle-button').addEventListener('click', function() {
              const currentWeatherDiv = document.getElementById('current-weather');
              const tomorrowWeatherDiv = document.getElementById('tomorrow-weather');
              const header = document.getElementById('weather-header');
              if (currentWeatherDiv.classList.contains('hidden')) {
                  currentWeatherDiv.classList.remove('hidden');
                  tomorrowWeatherDiv.classList.add('hidden');
                  this.textContent = 'Tomorrow Weather';
                  header.textContent = 'Today';
              } else {
                  currentWeatherDiv.classList.add('hidden');
                  tomorrowWeatherDiv.classList.remove('hidden');
                  this.textContent = 'Today Weather';
                  header.textContent = 'Tomorrow';
              }
          });

          function toggleVisibility(button, contentDiv, header, showText, hideText, headerText) {
              if (contentDiv.classList.contains('hidden')) {
                  contentDiv.classList.remove('hidden');
                  header.classList.remove('hidden');
                  button.textContent = hideText;
                  if (headerText) header.textContent = headerText;
              } else {
                  contentDiv.classList.add('hidden');
                  header.classList.add('hidden');
                  button.textContent = showText;
              }
          }

          document.getElementById('toggle-button-daily').addEventListener('click', function() {
              const dailyWeatherDiv = document.getElementById('forecast');
              const dailyHeader = document.getElementById('weather-header-daily');
              toggleVisibility(this, dailyWeatherDiv, dailyHeader,
                  'Weather Daily', 'Hide Weather Daily', 'Daily Forecast');
          });

          const forecastContainer = document.getElementById('forecast');
          forecastContainer.innerHTML = '';
          const currentDay = new Date(data.daily.time[0]).getDate();

          for (let i = 2; i <data.daily.time.length && i <= 8; i++) {
              const week = new Date(data.daily.time[i]);
              if (week.getDate() !== currentDay) {
                  const weekDate = week.toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short', 
                      day: '2-digit'
                  });

                  const weekDay = week.toLocaleDateString('en-US', { weekday: 'long' });
                  const maxTemp =data.daily.temperature_2m_max[i];
                  const weatherCode = data.daily.weather_code[i];
                  const weatherCondition = interpretWeatherCode(weatherCode);
                  const weatherImagePath = getWeatherImagePath(weatherCode, true);
                  const uvIndex =data.daily.uv_index_max[i]; // Extract UV Index
                  const forecastItem = document.createElement('div');
                  
                  forecastItem.className = 'forecast-item';
                  forecastItem.innerHTML = `
                      <strong><em>${weekDate}</em> <b>${weekDay}</b></strong><br>
                      <strong>Max:</strong> ${maxTemp} °C <br>
                      <strong>Condition:</strong> ${weatherCondition}<br>
                      <strong>UV Index:</strong> ${uvIndex}<br>
                      <img src="./images/${weatherImagePath}" alt="Weather condition" width="50px"><br>`;
                  forecastContainer.appendChild(forecastItem);
              }
          }
      } catch (error) {
          console.error('An error occurred:', error);
      }
  }

   fetchdata();
});
