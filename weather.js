var previousCities = [];

var currentCity;

function start () {
    previousCities = JSON.parse(localStorage.getItem("citiesforecast"));
    var prevSearch;
    if (previousCities) {
        currentLocation = previousCities[previousCities.length - 1];
        previousCities();
        getCurrent(currentCity);

    } else {
        if (!navigator.geolocation) {
            getCurrent("Cary");
        } else {
            navigator.geolocation.getCurrentPosition(success, error);
        }
    }
}

function success(position) {
    var lati = position.coords.latitude;
    var long = position.coords.longitude;
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?lat=" + lati + "&lon=" + long + "58a9d778bd5467bd3682a77cfec43944";
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response) {
        currentCity = response.name;
        saveLoc = response.name;
        getCurrent(currentCity);
    }


}

