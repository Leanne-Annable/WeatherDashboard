// Create a weather dashboard with form inputs
//     When a user searches for a city they are presented with current and future conditions for that city and that city is added to the search history
//     When a user views the current weather conditions for that city they are presented with:
//          The city name
//          The date
//          An icon representation of weather conditions
//          The temperature
//          The humidity
//          The wind speed
//     When a user view future weather conditions for that city they are presented with a 5-day forecast that displays:
//          The date
//          An icon representation of weather conditions
//          The temperature
//          The wind speed
//          The humidity
//     When a user click on a city in the search history they are again presented with current and future conditions for that city

// https://openweathermap.org/forecast5#JSON - example
// how to get the icon - https://openweathermap.org/weather-conditions


// **created variables**
var locationsArray = []; // Need to create an empty list to be able to store the list of cities searched
var apiKey = "48028b3db5f1aefd0fc887212580e039"; // my API key
var cityInput = ""; // a variable to store the city
var mainCard = $("#today"); // selects the main card to be able to put todays data in it
var dailyCards = $("#five-forecast"); // selects anything held within the 5-day forecast section

// calls the function to show previous searches as buttons
renderSearchHistory()

/* need to create an 'on click' event on the search button to:
    -   store the location searched into a list to display on screen
        -   The list should be made of buttons or at least be clickable - *DONE*
        -   The list should prepend so that the latest search is at the top of the list - *DONE*
        -   The list should also be re-clickable to retrieve past data again
    -   retrieve the information from the website about that location via ajax
        -   This should be called using the lat and lon - explore the weather api app to find link possibilities
    -   store that info into local storage so it will be used again in future - *DONE*
        -   This is what will be called again by clicking the list buttons/name
    -   present the retrieved information on screen in the form of current weather and also a five day forecast.
        -   Need to have the current data filling the top section and include location, date, font-awesome icon and stats
            -   Need to link current date via moment
        -   The 5 day forecast needs to be five individual boxes with background color, date, icon and stats
*/

// function for getting weather data
function getWeather() {
    // empty any current values for todays weather and the forecast
    mainCard.empty()
    dailyCards.empty()
    // do an ajax call to the website
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
        var temp = $("<p>").text("Temp: " + response.main.temp + "°C");
        var windSpeed = $("<p>").text("Wind: " +response.wind.speed + " mtr/sec");
        var humidity = $("<p>").text("Humidity: " + response.main.humidity + "%"); 
        // append the items to the top secion display
        mainCard.append(currentCity, iconURL, temp, windSpeed, humidity);
        })

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

// **click-events**
// search button
$("#search-button").on("click", function (event) {
    event.preventDefault();

    // grab the input from the text box
    cityInput = $("#search-input").val();
    // take the first letter of the word, turn the it to a capital letter and add it to the rest of the word
    capCity = cityInput.charAt(0).toUpperCase() + cityInput.slice(1);
    // get the data from the weather site using a created getWeather function
    getWeather();
    // check that a location has been inputted
    if (cityInput === "" || cityInput === " "){
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

    //console.log(locationsArray) // check to see if it works - it does XD

    renderButtons() // call a function to render the buttons of the cities selected
})

// reselect data from the search history
$(".city").on("click", function (event) {
    event.preventDefault();
    capCity = $(this).text();
    getWeather();
})

// ** Style changes/notes **
// need to colour the header in an ombre of blue and have white text
// search text box needs to fill aside width and have curved edges - *DONE*
// search button to be blue with curved edges and also fill aside width - *DONE*
// location list/buttons need to be light grey with curved edges and fill the aside width - *DONE*
// 5-day forecast boxes need a background colour and to have a margin/padding round them

