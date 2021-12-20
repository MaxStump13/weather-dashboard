// Global variables
// Openweathermap API Key
var APIKey = "2024fa16c7d4ae9b96edf7810fbb56a4";
// empty array for storage
var storedCities = [];
// var for search form element
var searchFormEl = document.querySelector("#search-form");
// var for City name element in current weather container
var cityNameEl = document.querySelector(".cityName");
// var for string search input
var searchInputVal = document.querySelector("#search-input");
// Container element for current city weather
var cityContainerEl = document.querySelector("#city-container");
// container element for list of current city weather conditions
var currCityContainerEl = document.querySelector("#curr-container");
// element of current date in current city container
var currDateEl = document.querySelector("#currDate");
// element for weather icon in current city
var currWeatherIconEl = document.querySelector("#weather-icon");
//var for element flexbox container of the searched city weather/forecast
var resultsEl = document.querySelector(".col-8");
// var for element of forecast container
var forecastEl = document.querySelector("#forecast-container");
// var for previous searches element container
var prevEl = document.querySelector("#prevSearches");
// boolean used to test if a search has already been stored locally
var filled = false;
// function to take in search input
function handleSearchFormSubmit(event) {
  event.preventDefault();
  // trims empty spaces on input
  var citySearch = searchInputVal.value.trim();
  // if blank error pops up
  if (!citySearch) {
    console.error("need search input");
  }
  // clears input field and previous cities names in current city container
  searchInputVal.value = "";
  cityNameEl.innerText = "";
  // checks if current city container/forecast is populated, if true calls clearSpace function
  if (filled == true) {
    clearSpace();
  }
  // call to getCity function
  getCity(citySearch);
}
// function to use search input to fetch api url, then get data from api if valid input
function getCity(city) {
  var apiUrl =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    city +
    "&appid=" +
    APIKey;
  fetch(apiUrl)
    // only procedes if status of api is ok, if not alerts the errorr
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          getCoordinates(data);
        });
      } else {
        alert("error: " + response.statusText + " (" + response.status +")");
      }
    })
    .catch(function (error) {
      alert("unable to connect");
    });
}
// function uses data from city api url to obtain coordinates for more data
function getCoordinates(info) {
  // checks/displays if no info on the city is in the api then returns out of the function
  if (info.length === 0) {
    cityContainerEl.textContent = "City not found";
    return;
  }
  // sets City name in current city container and pulls coordinates for another fetch
  cityNameEl.textContent = info.name;
  var coordinates = info.coord;
  var lon = coordinates.lon;
  var lat = coordinates.lat;
  var APIUrl =
    "https://api.openweathermap.org/data/2.5/onecall?lat=" +
    lat +
    "&lon=" +
    lon +
    "&exclude=minutely,hourly,alerts&units=imperial&appid=" +
    APIKey;
  fetch(APIUrl)
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          displayWeather(data);
          storeCity(info);
        });
      } else {
        alert("error: " + response.statusText + " (" + response.status +")");
      }
    })
    .catch(function (error) {
      alert("unable to connect");
    });
}
// function to build and display current/forecasted weather conditions
function displayWeather(locData) {
  // removes hidden class
  resultsEl.classList.remove("hidden");
  // uses moment to set the current date in current city container
  currDateEl.textContent = " (" + moment().format("l") + "):";
  // gets icon id and links it to img element beside city name/date
  var iconId = locData.current.weather[0].icon;
  var iconDes = locData.current.weather[0].description;
  var icon = "http://openweathermap.org/img/wn/" + iconId + "@2x.png";
  currWeatherIconEl.setAttribute("src", icon);
  currWeatherIconEl.setAttribute("alt", iconDes);
  // gets current weather conditions and builds elements to display them in a list in current city container
  var tempEl = document.createElement("li");
  tempEl.textContent = "Temperature: " + locData.current.temp + "°F";
  var windEl = document.createElement("li");
  windEl.textContent = "Wind Speed: " + locData.current.wind_speed + "MPH";
  var humidityEl = document.createElement("li");
  humidityEl.textContent = "Humidity: " + locData.current.humidity + "%";
  var uvEl = document.createElement("li");
  var uvCond = document.createElement("span");
  uvCond.textContent = locData.current.uvi;
  // depending on UV Index value assigns class to color index from green to yellow to red
  if (locData.current.uvi < 4) {
    uvCond.classList = "favor";
  } else if (locData.current.uvi < 7) {
    uvCond.classList = "mod";
  } else {
    uvCond.classList = "severe";
  }
  uvEl.textContent = "UV Index: ";
  // loop to create/display cards/conditions/spacing for 5 day forecast of weather conditions
  for (i = 1; i < 6; i++) {
    var card = document.createElement("section");
    card.classList = "card";
    card.setAttribute("id", "fore");
    var date = document.createElement("h4");
    date.classList = "card-header";
    // date.setAttribute("id", "foreDate");
    date.textContent = moment(locData.daily[i].dt, "X").format("l");
    var foreBody = document.createElement("section");
    var foreTemp = document.createElement("p");
    foreBody.classList = "card-body";
    foreTemp.textContent = "Temp: " + locData.daily[i].temp.day + "°F";
    var foreIconEl = document.createElement("img");
    var foreIconID = locData.daily[i].weather[0].icon;
    var foreIconDesc = locData.daily[i].weather[0].description;
    var foreIcon = "http://openweathermap.org/img/wn/" + foreIconID + "@2x.png";
    foreIconEl.setAttribute("src", foreIcon);
    foreIconEl.setAttribute("alt", foreIconDesc);
    foreIconEl.setAttribute("id", "forecastIcon");
    foreTemp.textContent = "Temp: " + locData.daily[i].temp.day + "°F";
    var foreWind = document.createElement("p");
    foreWind.textContent = "Wind: " + locData.daily[i].wind_speed + " MPH";
    var foreHumid = document.createElement("p");
    foreHumid.textContent = "Humidity: " + locData.daily[i].humidity + "%";
    foreBody.append(foreIconEl, foreTemp, foreWind, foreHumid);
    card.append(date, foreBody);
    forecastEl.append(card);
  }
  // appends all conditions/dates to their respective container/card/block
  uvEl.append(uvCond);
  cityNameEl.append(currDateEl, currWeatherIconEl);
  currCityContainerEl.append(tempEl, windEl, humidityEl, uvEl);
  // changes filled boolean to true, so checks know to call clearSpace function on another search
  filled = true;
}
// function to store previous searches locally
function storeCity(storeData) {
  // object of current city name and data from api url
  var previous = { city: storeData.name, data: storeData };
  // previous searches stored locally, converts from JSON string object back to usable object
  var prevCity = JSON.parse(localStorage.getItem("City"));
  // test to see if anything is stored if not adds city/data to array in local storage with key City, then calls createPrev function
  if (prevCity === null) {
    storedCities.unshift(previous);
    localStorage.setItem("City", JSON.stringify(storedCities));
    createPrev(previous);
  }
  // if not empty loops through stored cities and compares current coordinates to each stored city's coordinates
  else {
    var noRepeat = true;
    for (i = 0; i < prevCity.length; i++) {
      if (
        prevCity[i].data.coord.lat == previous.data.coord.lat &&
        prevCity[i].data.coord.lon == previous.data.coord.lon
      ) {
        // if coordinates match changes boolean to false indicating a its already been stored and not to create another button
        noRepeat = false;
      }
    }
    // if boolean is true adds city/data to array in local storage, then calls createPrev functions
    if (noRepeat === true) {
      storedCities.unshift(previous);
      localStorage.setItem("City", JSON.stringify(storedCities));
      createPrev(previous);
    }
  }
}
// function accepts button click on previously searched city and displays current/forecast weather
function searchAgain(event) {
  event.preventDefault();
  var prevCity = JSON.parse(localStorage.getItem("City"));
  // loops to check which button was clicked, checks if current city container is filled, and gives correct city name to getCoordinates function
  for (i = 0; i < prevCity.length; i++) {
    if (prevCity[i].city == this.name) {
      if (filled == true) {
        clearSpace();
      }
      getCoordinates(prevCity[i].data);
    }
  }
}
// on page load calls createPrev for each city in local storage to build prev searched city buttons if there are any
function init() {
  var oldCities = JSON.parse(localStorage.getItem("City"));
  if (oldCities !== null) {
    storedCities = oldCities;
    for (i = 0; i < storedCities.length; i++) {
      createPrev(storedCities[i]);
    }
  }
}
// uses loops to clear previous conditions/names in current city/forecast container
function clearSpace() {
  while (currCityContainerEl.firstChild) {
    currCityContainerEl.removeChild(currCityContainerEl.firstChild);
  }
  while (forecastEl.firstChild) {
    forecastEl.removeChild(forecastEl.firstChild);
  }
  currWeatherIconEl.setAttribute("src", "");
}
// builds a clickable button in the previous search element and adds name to use as comparison for searchAgain function when clicked again
function createPrev(saveCities) {
  var prevSearch = document.createElement("button");
  prevSearch.textContent = saveCities.city + ", " + saveCities.data.sys.country;
  prevSearch.classList = "btn prevBtn";
  prevSearch.setAttribute("name", saveCities.city);
  prevEl.append(prevSearch);
  prevSearch.addEventListener("click", searchAgain);
}
// call to initialize/display local storage
init();
// calls handleSearchFormSubmit on search button click/enter
searchFormEl.addEventListener("submit", handleSearchFormSubmit);
