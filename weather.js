window.onload = function () {
  findUserLocation();
};

var globalLocation;

// current location
function findUserLocation() {
  const options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
  };

  function error(errorMsg) {
    console.warn(`Location Error(${errorMsg.code}): ${errorMsg.message}`);
  }

  function findLocation(pos) {
    const crd = pos.coords;
    let latitude = crd.latitude;
    let longitude = crd.longitude;
    let accuracy = crd.accuracy;

    let userCurrentPosition = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=0c8ad3128f981928e8934de5e0264b44`;

    async function findPlace() {
      let res = await fetch(userCurrentPosition);
      if (res.status == 200) {
        let jsonFormat = await res.json();
        let location = jsonFormat.name;
        globalLocation = location;
        displayWeather(location, units);
      }
    }

    findPlace();
  }

  navigator.geolocation.getCurrentPosition(findLocation, error, options);
}

var units = "&units=metric";

let form = document.querySelector(".form");
form.addEventListener("submit", function (e) {
  e.preventDefault();

  var location = document.querySelector("#location").value;
  // convert location
  location = location.replace(/\b[a-z]/gi, function (c) {
    return c.toUpperCase();
  });

  if (!location) {
    alert("Enter Location");
  } else {
    globalLocation = location;
    displayWeather(location, units);
  }
});

let kelvinBtn = document.querySelector(".kelvin");
let fahrenheitBtn = document.querySelector(".fahrenheit");
let celsiusBtn = document.querySelector(".celsius");

kelvinBtn.onclick = function () {
  kelvinBtn.style.backgroundColor = "white";
  celsiusBtn.style.backgroundColor = "#eee";
  fahrenheitBtn.style.backgroundColor = "#eee";

  units = "";
  displayWeather(globalLocation, units);
};

celsiusBtn.onclick = function () {
  celsiusBtn.style.backgroundColor = "white";
  fahrenheitBtn.style.backgroundColor = "#eee";
  units = "&units=metric";
  displayWeather(globalLocation, units);
};

fahrenheitBtn.onclick = function () {
  units = "&units=imperial";
  fahrenheitBtn.style.backgroundColor = "white";
  kelvinBtn.style.backgroundColor = "#eee";
  celsiusBtn.style.backgroundColor = "#eee";

  displayWeather(globalLocation, units);
};

async function displayWeather(location, units) {
  try {
    let locationWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=0c8ad3128f981928e8934de5e0264b44${units}`;
    let res = await fetch(locationWeatherUrl);
    let jsonData = await res.json();

    if (res.status == 200) {
      changeMapLocation(location);
      showForcast(location, units);

      let tempC = jsonData.main.temp;

      let minTempC = jsonData.main.temp_min;
      let maxTempC = jsonData.main.temp_max;
      let feelsLike = jsonData.main.feels_like;

      if (units == "&units=imperial") {
        feelsLike += " °F";
        tempC += " °F";
      } else if (units == "") {
        feelsLike += " K";
        tempC += " K";
      } else {
        feelsLike += " °C";
        tempC += " °C";
      }

      let mainSituation = jsonData.weather[0].main;
      let situation = jsonData.weather[0].description;
      let windSpeed = jsonData.wind.speed;
      let sunRise = jsonData.sys.sunrise;
      let clouds = jsonData.clouds.all;
      let sunSet = jsonData.sys.sunset;
      let dateAndTime = new Date();
      dateAndTime = dateAndTime.toLocaleString();
      dateAndTime = dateAndTime.substring(0, 26);

      let weatherIcon = jsonData.weather[0].icon;
      let iconLink =
        "http://openweathermap.org/img/wn/" + weatherIcon + "@2x.png";

      let favicon = document.querySelector("#favicon");
      favicon.href = iconLink;
      // append

      let weatherStructure = `<div class="loca">
    <div> ${dateAndTime} </div>
    <h3>${location}</h3>

        </div>

        <div class="temp-div">
            <img src="${iconLink}" alt="icon">
            <h3>${tempC}</h3>
        </div>

        <div class="feels-like">
          

            <p>${feelsLike} </p>
            <p>${mainSituation}</p>
            <p> ${situation}</p>
        </div>

        <div class="description">
            <div> Min temp: ${minTempC}</div>
            <div> Max temp: ${maxTempC}</div>
            <div> Sun rise: ${sunRise}</div>
            <div> Sun set: ${sunSet}</div>
            <div> Wind speed : ${windSpeed}</div>
            <div> Clouds: ${clouds} </div>
    </div>`;

      document.querySelector(".weather-data").innerHTML = weatherStructure;
    } else {
      throw "Hey bro, type correct location";
    }
  } catch (error) {
    alert(error);
  } finally {
    console.log("api execution is completed");
  }
}

async function showForcast(location, units) {
  try {
    let forcastContainer = document.querySelector(".forcast");
    forcastContainer.innerHTML = "";

    let forcastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=0c8ad3128f981928e8934de5e0264b44${units}`;
    let res = await fetch(forcastUrl);
    let jsonData = await res.json();
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    let date = new Date();
    let index = date.getDay();

    for (let i = 0; i < 8; i++) {
      let weatherIcon = jsonData.list[i].weather[0].icon;

      let iconLink =
        "http://openweathermap.org/img/wn/" + weatherIcon + "@2x.png";

      index = index + i;
      if (index > 6) {
        index = index % 7;
      }

      let temp = jsonData.list[i].main.temp;

      let day = days[index];

      let divf = document.createElement("div");
      let h3f = document.createElement("h3");
      let imgf = document.createElement("img");
      let h2f = document.createElement("h2");

      h3f.textContent = day;

      if (units == "&units=imperial") {
        temp += " °F";
      } else if (units == "") {
        temp += " K";
      } else {
        temp += " °C";
      }

      h2f.textContent = temp;
      imgf.setAttribute("src", iconLink);
      divf.append(h3f, imgf, h2f);
      divf.setAttribute("class", "forcast-cards");
      forcastContainer.append(divf);
    }
  } catch (err) {
    console.log(err, " forcast error");
  }
}

function changeMapLocation(location) {
  let mapCanvas = document.querySelector("#gmap_canvas");
  mapCanvas.src =
    "https://maps.google.com/maps?q=" +
    location +
    "&t=&z=13&ie=UTF8&iwloc=&output=embed";
}

//DARK MODE
let sunIcon = document.querySelector(".sun-icon");
sunIcon.addEventListener("click", function () {
  let body = document.body;
  body.classList.toggle("container-darkmode");

  let nav = document.querySelector("#nav");

  nav.classList.toggle("nav-dark");

  let container = document.querySelector(".container");
  container.classList.toggle("container-darkmode");

  let wethData = document.querySelector(".weather-data");
  wethData.classList.toggle("weather-darkmode");

  let forcast = document.querySelector(".forcast");
  forcast.classList.toggle("container-darkmode");
  forcast.classList.toggle("forcast-darkmode");

  let forcastTitle = document.querySelector(".forcast-title");
  forcastTitle.classList.toggle("container-darkmode");
  forcastTitle.classList.toggle("forcast-title-darkmode");

  let allCards = document.querySelectorAll(".forcast-cards");

  let subBtn = document.querySelector(".submit-btn");
  subBtn.classList.toggle("white-border");

  for (let i of allCards) {
    i.classList.toggle("card-dark");
  }
});
