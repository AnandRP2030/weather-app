window.onload = function () {
  findUserLocation();
};

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
        displayWeather(location);
      }
    }

    findPlace();
  }

  navigator.geolocation.getCurrentPosition(findLocation, error, options);
}

let form = document.querySelector(".form");
form.addEventListener("submit", function (e) {
  e.preventDefault();

  let location = document.querySelector("#location").value;
  // convert location
  location = location.replace(/\b[a-z]/gi, function (c) {
    return c.toUpperCase();
  });

  if (!location) {
    alert("Enter Location");
  } else {
    displayWeather(location);
  }
});

async function displayWeather(location) {
  try {
    let locationWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=0c8ad3128f981928e8934de5e0264b44&units=metric`;
    let res = await fetch(locationWeatherUrl);
    let jsonData = await res.json();

    if (res.status == 200) {
      changeMapLocation(location);
      showForcast(location);

      let tempC = jsonData.main.temp;
      let minTempC = jsonData.main.temp_min;
      let maxTempC = jsonData.main.temp_max;
      let feelsLike = jsonData.main.feels_like;
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
            <h3>${tempC} °C</h3>
        </div>

        <div class="feels-like">
            <p>${feelsLike} °C</p>
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

async function showForcast(location) {
  try {
    let forcastContainer = document.querySelector(".forcast");
    forcastContainer.innerHTML = "";

    let forcastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=0c8ad3128f981928e8934de5e0264b44&units=metric`;

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
      h2f.textContent = temp+" °C";
      imgf.setAttribute("src",iconLink);

      divf.append(h3f, imgf, h2f);
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



// responsiveness
// let hamburgerIcon = document.querySelector(".icon");
// hamburgerIcon.onclick = function (){
//   let rightSec = document.querySelector("#right-id");

//   rightSec.setAttribute("id", "drop-down");

//   alert(rightSec.id)
//   if (rightSec.className === "right" || rightSec.className === "right drop-down"){
//   }else {
//     // alert(rightSec.className)
//     // rightSec.className = "right";
//   }

// }

let hamburgerIcon = document.querySelector(".icon");
hamburgerIcon.onclick = function (){
  let rightSec = document.querySelector("#right-id");
  rightSec.classList.toggle("drop-down");
}
