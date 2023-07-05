import apiModule from './api-key.js';
import './style.css';
import './mobile.css';
import './img-component.js';



//Declaration of global variables
let userApiKey = "";
const submitButton = document.getElementById("submit");
const cityChoice = document.getElementById("city-choice");
const newDiv = document.createElement("div");
const forecastWrapper = document.querySelector(".forecast-wrapper");
const todayWrapper = document.querySelector(".today-wrapper");
const weatherButtonsWrapper = document.querySelector(".days-button-wrapper");

const hideArrow = () => {
  if (!document.getElementById("api-arrow").classList.contains("hidden")) {
    document.getElementById("api-arrow").classList.add("hidden");
  }
};

if ("user-api-key" in sessionStorage) {
  hideArrow();
  apiModule.changeApiMenu();
}

// Function that fetches the lattitude and longitude from the GEO api based on a city name
const getCity = (inputCity) => {
  if ("user-api-key" in sessionStorage) {
    userApiKey = sessionStorage.getItem("user-api-key");
    hideArrow();
    fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${inputCity}&limit=1&appid=${userApiKey}`
    )
      .then((res) => res.json())
      .then((cityData) => {
        let apiLat = cityData[0].lat;
        let apiLon = cityData[0].lon;
        let apiCountry = cityData[0].country;
        let apiCity = cityData[0].name;
        getForecast(apiLat, apiLon, apiCountry, apiCity);
        getWeather(apiLat, apiLon);
      });
  } else {
    document.querySelector(".forecast-wrapper").classList.toggle("hidden");
    document.querySelector(".location").innerText =
      "You need to add your OpenWeather API key!";
  }
};

//Function that fetches the weather as a JSON array of objects based on the attributes lattitude & longitude from the getCity function
const getForecast = (apiLat, apiLon, apiCountry, apiCity) => {
  fetch(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${apiLat}&lon=${apiLon}&units=metric&appid=${userApiKey}`
  )
    .then((res) => res.json())
    .then((data) => {
      for (let i = 0; i < data.list.length; i = i + 8) {
        let mainWeather = data.list[i].weather[0].main;
        let descWeather = data.list[i].weather[0].description;
        let tempWeather = data.list[i].main.temp;
        let iconWeather = data.list[i].weather[0].icon;
        let timesStamp = data.list[i].dt_txt;
        let dayDisplay = timesStamp.slice(8, 10) + timesStamp.slice(4, 7);
        let hourDisplay = timesStamp.slice(-8, -3);

        if (document.querySelector(".forecast-wrapper").childNodes) {
          removeDiv(".forecast-wrapper");
        }
        setTimeout(() => {
          createForecast(
            mainWeather,
            descWeather,
            tempWeather,
            iconWeather,
            dayDisplay,
            hourDisplay,
            apiCountry,
            apiCity
          );
        }, 100);
      }
    });
};

const getWeather = (apiLat, apiLon) => {
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${apiLat}&lon=${apiLon}&units=metric&appid=${userApiKey}`
  )
    .then((res) => res.json())
    .then((data) => {
      let minTemp = data.main.temp_min;
      let maxTemp = data.main.temp_max;
      let todayHumid = data.main.humidity;
      let todayWind = data.wind.speed;
      let todayDesc = data.weather[0].description;
      let todayIcon  = data.weather[0].icon;
      console.log(todayIcon)

      if (document.querySelector(".today-wrapper").childNodes) {
        removeDiv(".today-wrapper");
      }
      setTimeout(() => {
        createWeather(
          todayIcon,
          minTemp,
          maxTemp,
          todayHumid,
          todayWind,
          todayDesc
        );
      }, 100);
    });
};

//Event Listener on button click to pass the city to the getCity function
const clickToPassCity = submitButton.addEventListener("click", () => {
  let inputCity = document.getElementById("city-choice").value;
  forecastWrapper.classList.remove("hidden");
  todayWrapper.classList.remove("hidden")
  getCity(inputCity);
  cityChoice.value = "";
});

//Event Listener on "enter" key press to pass the city to the getCity function
const enterToPassCity = document.addEventListener("keyup", (e) => {
  if (e.code == "Enter") {
    let inputCity = document.getElementById("city-choice").value;
    forecastWrapper.classList.remove("hidden");
    todayWrapper.classList.remove("hidden")
    getCity(inputCity);
    cityChoice.value = "";
  }
});

//Function to put the object values in an existing HTML structure
const createForecast = (
  mainWeather,
  descWeather,
  tempWeather,
  iconWeather,
  dayDisplay,
  hourDisplay,
  apiCountry,
  apiCity
) => {
  let newCard = document.createElement("div");
  newCard.classList.add("weather-card");
  newCard.innerHTML = `
    <div class="date-time">
      <span class="time">${hourDisplay}</span><span class="date">${dayDisplay}</span>
    </div>
    <div class="forecast">
      <img src="https://openweathermap.org/img/wn/${iconWeather}@2x.png" alt="${mainWeather}">${descWeather}
    </div>
  <div class="temp">${tempWeather.toFixed(0)}°C</div>`;

  forecastWrapper.append(newCard);

  document.querySelector(".location").innerText = `${apiCity}, ${apiCountry}`;
};

//Function that displays the weather for today
const createWeather = (
  todayIcon,
  minTemp,
  maxTemp,
  todayHumid,
  todayWind,
  todayDesc
) => {
  let newWeather = document.createElement("div");
  newWeather.classList.add("today-card");
  newWeather.innerHTML = `
  <h1 class="today-desc">
  <img
    src="https://openweathermap.org/img/wn/${todayIcon}@2x.png"
    alt=""
  />${todayDesc}
      </h1>
<div class="today-data">
  <div class="today-data-col1">
    <h2 class="today-temp">MIN: ${minTemp.toFixed(0)}°C</h2>
    <p class="today-wind">Wind: ${todayWind} km/h</p>
  </div>
  <div class="today-data-col2">
    <h2 class="today-temp">MAX: ${maxTemp.toFixed(0)}°C</h2>
    <p class="today-humidity">Humidity: ${todayHumid}%</p>
  </div>
</div>`;

  todayWrapper.append(newWeather);
};

//Function to remove divs
let removeDiv = (parentName) => {
  document.querySelector(parentName).childNodes.forEach((div) => {
    div.remove();
  });
};

//Eventlistener to OPEN the settings Menu
document.querySelector(".settings-icon").addEventListener("click", () => {
  document.querySelector(".settings-menu").classList.toggle("hidden");
});

//Eventlistener to CLOSE the settings Menu
document.querySelector(".settings").addEventListener("click", () => {
  document.querySelector(".settings-menu").classList.toggle("hidden");
});


//Function to set the API key to the user
document.getElementById("save-api").addEventListener("click", () => {
  let apiKeyInput = document.getElementById("api-key");
  userApiKey = apiKeyInput.value;
  apiKeyInput.value = "Thank you";
  setTimeout(() => {
    apiKeyInput.value = "";
    apiModule.changeApiMenu();
    document.querySelector(".settings-menu").classList.toggle("hidden");
  }, 1500);
  apiModule.storeApiKey(userApiKey);
  document.getElementById("api-arrow").classList.toggle("hidden");
});
