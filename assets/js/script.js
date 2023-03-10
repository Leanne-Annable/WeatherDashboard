// Create a weather dashboard with form inputs
//     When a user searches for a city they are presented with current and future conditions for that city and that city is added to the search history
//     When a user views the current weather conditions for that city they are presented with:
//          The city name
//          The date
//          An icon representation of weather conditions
//          The temperature
//          The wind speed
//          The humidity
//     When a user view future weather conditions for that city they are presented with a 5-day forecast that displays:
//          The date
//          An icon representation of weather conditions
//          The temperature
//          The wind speed
//          The humidity
//     When a user clicks on a city in the search history they are again presented with current and future conditions for that city


//                                                              ** created variables **
var locationsArray = []; // Need to create an empty list to be able to store the list of cities searched
var apiKey = "48028b3db5f1aefd0fc887212580e039"; // my API key
var cityInput = ""; // a variable to store the city
var mainCard = $("#today"); // selects the main card to be able to put todays data in it
var dailyCards = $("#five-forecast"); // selects anything held within the 5-day forecast section
var searchInput = $("#search-input"); // selects the search input box

// calls the function to show previous searches as buttons
renderSearchHistory()


//                                                                  ** functions **
// function for getting weather data
function getWeather() {
    // empty any current values for todays weather and the forecast
    mainCard.empty();
    dailyCards.empty();
    // add a class to the div so i can add a border when the function is run
    mainCard.addClass("withBorder");
    // do an ajax call to the website
    forecastHeading.innerText = "5-Day Forecast:";
    $.ajax({
        url: "https://api.openweathermap.org/data/2.5/weather?q=" + capCity + "&appid=" + apiKey + "&units=metric",
        method: "GET"
    }).then(function (response) {
        // use moment to call the current date and time for the chosen area
        var todayDate = moment.unix(response.dt + response.timezone).format("(DD/MM/YYYY) HH:mm:ss");
        // print as a heading
        var currentCity = $("<h3>").text(capCity + " " + todayDate);
        // get the linked icon and stats
        var iconURL = $("<img>").attr("src", "http://openweathermap.org/img/w/" + response.weather[0].icon + ".png");
        var temp = $("<p>").text("Temp: " + response.main.temp + "??C");
        var windSpeed = $("<p>").text("Wind: " + response.wind.speed + " m/sec");
        var humidity = $("<p>").text("Humidity: " + response.main.humidity + "%");
        // append the items to the top secion display
        mainCard.append(currentCity, iconURL, temp, windSpeed, humidity);
    })
    $.ajax({
        url: "https://api.openweathermap.org/data/2.5/forecast?q=" + capCity + "&appid=" + apiKey + "&units=metric",
        method: "GET"
    }).then(function (response) {
        // create a for loop to loop through the data 5 times
        for (i = 0; i < 5; i++) {
            // each day is split into 8 time chunks
            var localDate = moment.unix(response.list[((i + 1) * 8) - 1].dt + response.city.timezone).format("DD-MM-YYYY");
            // create a new div for each day giving the class column and forecast
            var newCard = $("<div>").attr("class", "col forecast");
            // console.log(newCard);
            // get the date
            var forecastDate = $("<h5>").text(localDate);
            // get the icon
            var forecastIcon = $("<img>").attr("src", "http://openweathermap.org/img/w/" + response.list[i].weather[0].icon + ".png")
            // get the temp
            var forecastTemp = $("<p>").text("Temp: " + response.list[i].main.temp + "??C");
            // get the wind speed
            var forecastWind = $("<p>").text("Wind: " + response.list[i].wind.speed + " m/sec");
            // get the humidity
            var forecastHumidity = $("<p>").text("Humidity: " + response.list[i].main.humidity + "%");
            newCard.append(forecastDate, forecastIcon, forecastTemp, forecastWind, forecastHumidity);
            dailyCards.append(newCard);
        }
    }  )     
    }


// function for rendering the search history from the local storage
function renderSearchHistory() {
    // get any store info from local storage
    var previousSearches = JSON.parse(localStorage.getItem("SearchHistory"));
    // if there is something previously saved, the locations array should equal the stored data
    if (previousSearches !== null) {
        locationsArray = previousSearches
    }
    renderButtons()
}

//function for rendering the buttons to screen given the cities searched/search history
function renderButtons() {
    // delete the buttons prior to adding new cities to stop repeated buttons
    $("#city-list").empty();
    //loop through the array of cities
    for (var i = 0; i < locationsArray.length; i++) {
        // generate a button for each entry
        var a = $("<button>");
        // Adding a class of city to our button
        a.addClass("city");
        // Adding a data-attribute
        a.attr("city-name", locationsArray[i]);
        // Providing the initial button text
        a.text(locationsArray[i]);
        // Adding the button to the city-list div
        $("#city-list").append(a);
    }
}

//                                                                  ** click-events **
// search button
$("#search-button").on("click", function (event) {
    event.preventDefault();

    // grab the input from the text box
    cityInput = searchInput.val();
    // take the first letter of the word, turn the it to a capital letter and add it to the rest of the word
    capCity = cityInput.charAt(0).toUpperCase() + cityInput.slice(1);
    // check that a location has been inputted
    if (cityInput === "" || cityInput === " ") {
        alert("Please input a location")
        return
    }
    // check if the cityInput is already in the locationsArray
    var checkArray = locationsArray.includes(capCity);
    if (checkArray === true) {
        // alert the user and end the search
        alert("That City is already in your search History")
        return
    } else {
        // add the location to the selected locations array, unshift moves it to the front of the list        
        locationsArray.unshift(capCity);
        // set the item to local storage using JSON stringify to make an array
        localStorage.setItem("SearchHistory", JSON.stringify(locationsArray));
    };
    // get the data from the weather site using a created getWeather function
    getWeather();
    //console.log(locationsArray) // check to see if it works - it does XD
    renderButtons() // call a function to render the buttons of the cities selected
    searchInput.val("");
})

// reselect data from the search history
$(".city").on("click", function (event) {
    event.preventDefault();
    capCity = $(this).text();
    getWeather();
})

// clear search history
$("#clear-button").on("click", function () {
    // clears local storage
    window.localStorage.clear();
    // refreshes page
    location.reload();
})