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

// Base for API calls = ("https://api.openweathermap.org/data/2.5/forecast?lat=" + linkLatValue + "&lon=" + linkLonValue + "&appid=48028b3db5f1aefd0fc887212580e039") <= my API key
// api.openweathermap.org/data/2.5/forecast?q={city name}&appid=48028b3db5f1aefd0fc887212580e039    <= using city name in the search to get the lat and lon
// https://openweathermap.org/forecast5#JSON - example
// right after, use that to get the lat and lon information to get the weather
// how to get the icon - https://openweathermap.org/weather-conditions


// **created variables**
var locationsArray = []; // Need to create an empty list to be able to store the list of cities searched
var apiKey = "48028b3db5f1aefd0fc887212580e039"; // my API key
var latVal = ""; // a variabble to store the latitude
var lonVal = ""; // a variable to store the longitude
var QueryURL = "https://api.openweathermap.org/data/2.5/forecast?lat=" + latVal + "&lon=" + lonVal + "&appid=" + apiKey; // the query we can send in to get the result



/* need to create an 'on click' event on the search button to:
    -   store the location searched into a list to display on screen
        -   The list should be made of buttons or at least be clickable
        -   The list should prepend so that the latest search is at the top of the list
        -   The list should also be re-clickable to retrieve past data again
    -   retrieve the information from the website about that location via ajax
        -   This should be called using the lat and lon - explore the weather api app to find link possibilities
    -   store that info into local storage so it will be used again in future
        -   This is what will be called again by clicking the list buttons/name
    -   present the retrieved information on screen in the form of current weather and also a five day forecast.
        -   Need to have the current data filling the top section and include location, date, font-awesome icon and stats
            -   Need to link current date via moment
        -   The 5 day forecast needs to be five individual boxes with background color, date, icon and stats
            -   dates linked via moment using the moment.js date and .add(x, 'days') <= https://momentjs.com/docs/#/manipulating/add/
*/

//function for rendering the buttons to screen
function getCities(){
    // delete the buttons prior to adding new cities to stop repeated buttons
    $("#city-list").empty();
    //loop through the array of cities
    for (var i=0; i< locationsArray.length; i++){
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
$("#search-button").on("click", function(event){
    event.preventDefault();
    // grab the input from the text box
    var searchInput = $("#search-input").val();
    // add the location to the selected locations array, unshift moves it to the front of the list
    locationsArray.unshift(searchInput);
    console.log(locationsArray) // check to see if it works - it does XD

    getCities() // call a function to render the buttons of the cities selected
})


// ** Style changes/notes **
// need to colour the header in an ombre of blue and have white text
// search text box needs to fill aside width and have curved edges
// search button to be blue with curved edges and also fill aside width
// location list/buttons need to be light grey with curved edges and fill the aside width
// 5-day forecast boxes need a background colour and to have a margin/padding round them

