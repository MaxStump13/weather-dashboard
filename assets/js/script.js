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
var storedCities=[];
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
var filled = false;

function handleSearchFormSubmit(event){
    event.preventDefault();
    var citySearch = searchInputVal.value.trim();
    if(!citySearch){
        console.error("need search input");
    }
    searchInputVal.value = "";
    cityNameEl.innerText ="";
    if(filled == true){
    clearSpace();
    }
    getCity(citySearch);
}
function getCity(city){
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey;
    fetch(apiUrl)
        .then(function(response){
            if(response.ok){
                console.log(response);
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
    cityNameEl.textContent = info.name;
    var coordinates = info.coord;
    var lon = coordinates.lon;
    var lat = coordinates.lat;
    var APIUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat +"&lon=" + lon + "&exclude=minutely,hourly,alerts&units=imperial&appid=" + APIKey;
    fetch(APIUrl)
        .then(function(response){
            if(response.ok){
                // console.log(response);
                response.json().then(function(data){
                    displayWeather(data, searchedCity);
                    storeCity(info);
                });
            }else{
                alert("error: "+ response.statusText);
            }
        })
        .catch(function(error){
            alert("unable to connect");
        });
}
function displayWeather(locData,city){
        resultsEl.classList.remove("hidden");
        currDateEl.textContent =" (" + moment().format("l") +"):"; 
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
        filled = true;
}
function storeCity(storeData){
    var previous = {city : storeData.name, data: storeData};
    var prevCity = JSON.parse(localStorage.getItem("City"));
    if(prevCity === null){
        storedCities.unshift(previous);
        localStorage.setItem("City", JSON.stringify(storedCities));
        var prevSearch = document.createElement("button");
        prevSearch.textContent = storeData.name + ", " + storeData.data.sys.country;
        prevSearch.classList = "btn bg-secondary";
        prevSearch.setAttribute("name", storeData.name);
        prevEl.append(prevSearch);
        prevSearch.addEventListener("click", searchAgain);
    }
    else{
        var noRepeat = true;
        for (i=0;i<prevCity.length;i++){
            console.log(prevCity[i].data.coord);
            if(prevCity[i].data.coord.lat == previous.data.coord.lat && prevCity[i].data.coord.lon == previous.data.coord.lon){
            console.log("same city searched");
            noRepeat=false;
            }
        }
        if(noRepeat ===true){
            storedCities.unshift(previous);
            localStorage.setItem("City", JSON.stringify(storedCities));
            var prevSearch = document.createElement("button");
            prevSearch.textContent = storeData.name + ", " + storeData.data.sys.country;
            prevSearch.classList = "btn bg-secondary";
            prevSearch.setAttribute("name", storeData.name);
            prevEl.append(prevSearch);
            prevSearch.addEventListener("click", searchAgain);
        }
    }
    
}  
function searchAgain(event){
    event.preventDefault();
    // console.log(this.name);
    var prevCity = JSON.parse(localStorage.getItem("City"));
    // console.log(prevCity);
    for(i=0;i<prevCity.length; i++){
        if(prevCity[i].city == this.name){
            console.log(i);
            console.log(prevCity[i]);
            if(filled == true){
            clearSpace();
            }
            getCoordinates(prevCity[i].data,prevCity[i].city)
        }
    }
}
function init(){
    var oldCities = JSON.parse(localStorage.getItem("City"));
    if(oldCities !== null){
        storedCities = oldCities;
        for(i=0;i<storedCities.length;i++){
        var prevSearch = document.createElement("button");
        prevSearch.textContent = storedCities[i].city + ", " + storedCities[i].data.sys.country;
        prevSearch.classList = "btn bg-secondary";
        prevSearch.setAttribute("name", storedCities[i].city);
        prevSearch.addEventListener("click", searchAgain);
        prevEl.append(prevSearch);
        }
    }
}

function clearSpace(){
    while(currCityContainerEl.firstChild) {
        currCityContainerEl.removeChild(currCityContainerEl.firstChild);
    }
    while(forecastEl.firstChild){
        forecastEl.removeChild(forecastEl.firstChild);
    }
    currWeatherIconEl.setAttribute("src", "");
}
init();
searchFormEl.addEventListener("submit", handleSearchFormSubmit);