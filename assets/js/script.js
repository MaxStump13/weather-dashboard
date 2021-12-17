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
// https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&exclude={part}&appid={API key}
//add ?per_page=5 for the future forecast
// api.openweathermap.org/data/2.5/weather?q={city name},{state code}&appid={API key}
//need to make the input search bar a nested api call, then display of 5 cards for forecast and another nested api for the current, then displayed in a col/container or maybe a card as well

//use bootstrap to make a left aside col that can expand -y for previous searches, these rows need to be clickable to the previous searches and stored locally or server side?

