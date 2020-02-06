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
    });


}

function error(){
    currentCity = "Cary"
    getCurrent(currentCity);
}

function displayPrev() {
    if (previousCities) {
        $("#previousSearches").empty();
        var buttons = $("<div>").attr("class", "list-group");
        for (var i = 0; i < previousCities.length; i++) {
            var cityButton = $("<a>").attr("href", "#").attr("id", "city-button").text(previousCities[i]);
            if (previousCities[i] == currentCity){
                cityButton.attr("class", "list-group-item list-group-item-action active");

            } else {
                cityButton.attr("class", "list-group-item list-group-item-action");
            } buttons.prepend(cityButton);
        } $("#previousSearches").append(buttons);
    }
}

function getCurrent(city) {
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "58a9d778bd5467bd3682a77cfec43944";
    $.ajax({
        url: queryURL,
        method: "GET",
        error: function (){
            previousCities.splice(previousCities.indexOf(city), 1);
            localStorage.setItem("citiesforecast", JSON.stringify(previousCities));
            start();
        }
    }).then(function (response) {
    
        var currentCard = $("<div>").attr("class", "card bg-light");
        $("#currentforecast").append(currentCard);

       
        var currentCardHead = $("<div>").attr("class", "card-header").text("Current weather for " + response.name);
        currentCard.append(currentCardHead);

        var cardRow = $("<div>").attr("class", "row no-gutters");
        currentCard.append(cardRow);

        var iconURL = "https://openweathermap.org/img/wn/" + response.weather[0].icon + "@2x.png";

        var imgDiv = $("<div>").attr("class", "col-md-4").append($("<img>").attr("src", iconURL).attr("class", "card-img"));
        cardRow.append(imgDiv);

        var textDiv = $("<div>").attr("class", "col-md-8");
        var cardBody = $("<div>").attr("class", "card-body");
        textDiv.append(cardBody);
   
        cardBody.append($("<h3>").attr("class", "card-title").text(response.name));
    
        var currentDate = moment(response.dt, "X").format("dddd, MMMM Do YYYY, h:mm a");
        cardBody.append($("<p>").attr("class", "card-text").append($("<small>").attr("class", "text-muted").text("Last updated: " + currentDate)));
      
        cardBody.append($("<p>").attr("class", "card-text").html("Temperature: " + response.main.temp + " &#8457;"));
      
        cardBody.append($("<p>").attr("class", "card-text").text("Humidity: " + response.main.humidity + "%"));
      
        cardBody.append($("<p>").attr("class", "card-text").text("Wind Speed: " + response.wind.speed + " MPH"));

      
        var uvURL = "https://api.openweathermap.org/data/2.5/uvi?appid=58a9d778bd5467bd3682a77cfec43944=" + response.coord.lati + "&long=" + response.coord.lati;
        $.ajax({
            url: uvURL,
            method: "GET"
        }).then(function (uvresponse) {
            var uvindex = uvresponse.value;
            var bgcolor;
            if (uvindex <= 3) {
                bgcolor = "green";
            }
            else if (uvindex >= 3 || uvindex <= 6) {
                bgcolor = "yellow";
            }
            else if (uvindex >= 6 || uvindex <= 8) {
                bgcolor = "orange";
            }
            else {
                bgcolor = "red";
            }
            var uvDisplay = $("<p>").attr("class", "card-text").text("UV Index: ");
            uvDisplay.append($("<span>").attr("class", "uvindex").attr("style", ("background-color:" + bgcolor)).text(uvindex));
            cardBody.append(uvDisplay);

        });

        cardRow.append(textDiv);
        cityForecast(response.id);
    });
}

function cityForecast(city) {
    var queryURL = "https://api.openweathermap.org/data/2.5/forecast?id=" + city + "&APPID=58a9d778bd5467bd3682a77cfec43944&units=imperial"
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        var newrow = $("<div>").attr("class", "forecast");
        $("#currentforecast").append(newrow);

        for (var i = 0; i < response.list.length; i++) {
            if (response.list[i].dt_txt.indexOf("15:00:00") !== -1) {
                var newCol = $("<div>").attr("class", "one-fifth");
                newrow.append(newCol);

                var newCard = $("<div>").attr("class", "card text-white bg-primary");
                newCol.append(newCard);

                var cardHead = $("<div>").attr("class", "card-header").text(moment(response.list[i].dt, "X").format("MMM Do"));
                newCard.append(cardHead);

                var cardImg = $("<img>").attr("class", "card-img-top").attr("src", "https://openweathermap.org/img/wn/" + response.list[i].weather[0].icon + "@2x.png");
                newCard.append(cardImg);

                var bodyDiv = $("<div>").attr("class", "card-body");
                newCard.append(bodyDiv);

                bodyDiv.append($("<p>").attr("class", "card-text").html("Temp: " + response.list[i].main.temp + " &#8457;"));
                bodyDiv.append($("<p>").attr("class", "card-text").text("Humidity: " + response.list[i].main.humidity + "%"));
            }
        }
    });
}

function clear() {
    $("#currentforecast").empty();
}
function saveCity (city){
    //add this to the saved locations array
    if (previousCities === null) {
        previousCities = [city];
    }
    else if (previousCities.indexOf(city) === -1) {
        previousCities.push(city);
    }
    //save the new array to localstorage
    localStorage.setItem("citiesforecast", JSON.stringify(previousCities));
    displayPrev();
}


$("#searchbutton").on("click", function () {
   
    event.preventDefault();
   
    var city = $("#searchinput").val().trim();
  
    if (city !== "") {
        clear();
        currentCity = city;
        saveCity(city);
        $("#searchinput").val("");
        getCurrent(city);
    }
});

$(document).on("click", "#loc-btn", function () {
    clear();
    currentCity = $(this).text();
    displayPrev();
    getCurrent(currentCity);
});

start();
