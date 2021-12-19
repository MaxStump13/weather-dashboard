// GIVEN a weather dashboard with form inputs
// WHEN I search for a city
// THEN I am presented with current and future conditions for that city and that city is added to the search history
// WHEN I view current weather conditions for that city
// THEN I am presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity, the wind speed, and the UV index
// WHEN I view the UV index
// THEN I am presented with a color that indicates whether the conditions are favorable, moderate, or severe
// WHEN I view future weather conditions for that city
// THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, the wind speed, and the humidity
// WHEN I click on a city in the search history
// THEN I am again presented with current and future conditions for that city
var APIKey = "2024fa16c7d4ae9b96edf7810fbb56a4";
var city;
var searchFormEl = document.querySelector("#search-form");
var cityNameEl = document.querySelector(".cityName");
var searchInputVal = document.querySelector("#search-input");
var cityContainerEl = document.querySelector("#city-container");
var currCityContainerEl = document.querySelector("#curr-container");
var currDateEl = document.querySelector("#currDate");
var currWeatherIconEl = document.querySelector("#weather-icon");
var resultsEl = document.querySelector(".col-8");
var forecastEl = document.querySelector("#forecast-container");
var prevEl =document.querySelector("#prevSearches");


// https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&exclude={part}&appid={API key}
//add ?per_page=5 for the future forecast


// api.openweathermap.org/data/2.5/weather?q={city name},{state code}&appid={API key}
function handleSearchFormSubmit(event){
    event.preventDefault();
     var citySearch = searchInputVal.value.trim();
    if(!citySearch){
        console.error("need search input");
    }
    // cityNameEl.textContent = citySearch;
    searchInputVal.value = "";
    getCity(citySearch);

}
function getCity(city){
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey;
    fetch(apiUrl)
        .then(function(response){
            if(response.ok){
                // console.log(response);
                response.json().then(function(data){
                    getCoordinates(data, city);
                });
            }else{
                alert("error: "+ response.statusText);
            }
        })
        .catch(function(error){
            alert("unable to connect");
        });
};
function getCoordinates(info, searchedCity){
    if(info.length===0){
        cityContainerEl.textContent = "City not found";
        return;
    }
    console.log(info);
    // searchTermEl.textContent = searchedCity;
    var coordinates = info.coord;
    // console.log(coordinates);
    var lon = coordinates.lon;
    var lat = coordinates.lat;
    // console.log(coordinates.lon);
    // console.log(coordinates.lat);


    var APIUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat +"&lon=" + lon + "&exclude=minutely,hourly,alerts&units=imperial&appid=" + APIKey;
    fetch(APIUrl)
        .then(function(response){
            if(response.ok){
                console.log(response);
                response.json().then(function(data){
                    displayWeather(data, searchedCity);
                    storeCity(info, searchedCity);
                });
            }else{
                alert("error: "+ response.statusText);
            }
        })
        .catch(function(error){
            alert("unable to connect");
        });
    // displayWeather(coordinates, data);
}
function displayWeather(locData,city){
    // var lon = coord.lon;
    // var lat = coord.lat;
    // var APIUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat +"&lon=" + lon + "&exclude=minutely,hourly,alerts&appid=" + APIKey;
        resultsEl.classList.remove("hidden");
        cityNameEl.textContent = city;
        console.log(locData);
        currDateEl.textContent =" (" + moment().format("l") +"):"; 
        // console.log(locData.current.weather[0].icon);
        var iconId = locData.current.weather[0].icon;
        var icon = "http://openweathermap.org/img/wn/" + iconId +"@2x.png";
        currWeatherIconEl.setAttribute("src", icon);
        var tempEl = document.createElement("li");
        tempEl.textContent = "Temperature: " + locData.current.temp + "°F";
        var windEl = document.createElement("li");
        windEl.textContent = "Wind Speed: " + locData.current.wind_speed + "MPH";
        var humidityEl = document.createElement("li");
        humidityEl.textContent = "Humidity: " + locData.current.humidity + "%";
        var uvEl = document.createElement("li");
        var uvCond = document.createElement("span");
        uvCond.textContent = locData.current.uvi;
        if(locData.current.uvi<4){
            uvCond.classList= "favor";
        }else if(locData.current.uvi<7){
            uvCond.classList= "mod";
        }else{
            uvCond.classList= "severe";
        }
        uvEl.textContent = "UV Index: ";
        
        for(i=1; i<6;i++){
            var card = document.createElement("section");
            card.classList = "card";
            card.setAttribute("id","fore");
            var date = document.createElement("h4")
            date.classList = "card-header";
            date.setAttribute("id", "foreDate");
            // console.log(locData.daily[i].dt);
            date.textContent = moment(locData.daily[i].dt, "X").format("l");
            var foreBody = document.createElement("section");
            var foreTemp = document.createElement("p");
            foreBody.classList = "card-body";
            foreTemp.textContent = "Temp: " + locData.daily[i].temp.day + "°F";
            var foreIconEl = document.createElement("img");
            var foreIconID = locData.daily[i].weather[0].icon;
            var foreIcon = "http://openweathermap.org/img/wn/" + foreIconID +"@2x.png";
            foreIconEl.setAttribute("src", foreIcon);
            foreIconEl.setAttribute("id", "forecastIcon");
            foreTemp.textContent = "Temp: " + locData.daily[i].temp.day + "°F";
            var foreWind = document.createElement("p");
            foreWind.textContent = "Wind: " + locData.daily[i].wind_speed + " MPH";
            var foreHumid = document.createElement("p");
            foreHumid.textContent = "Humidity: " + locData.daily[i].humidity + "%";
            foreBody.append(foreIconEl, foreTemp, foreWind, foreHumid);
            card.append(date,foreBody);
            forecastEl.append(card);
        }


        uvEl.append(uvCond);
        cityNameEl.append(currDateEl, currWeatherIconEl);
        currCityContainerEl.append(tempEl,windEl,humidityEl,uvEl);    
}

function storeCity(storeData, storeCity){
    var =
//send to get coordinates
}
//need to make the input search bar a nested api call, then display of 5 cards for forecast and another nested api for the current, then displayed in a col/container or maybe a card as well

//use bootstrap to make a left aside col that can expand -y for previous searches, these rows need to be clickable to the previous searches and stored locally or server side?

searchFormEl.addEventListener("submit", handleSearchFormSubmit);