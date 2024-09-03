//Define HTML static variables
const searchBtnEl = document.getElementById("search-btn");
const searchInputEl = document.getElementById("search-input");
const currentWeatherEl = document.getElementById("current-weather");
const fiveDayEl = document.getElementById("five-day");
const cityBtnContEl = document.getElementById("cities-btn-container") 
let cityBtn = document.getElementsByClassName("cityBtn")


//Get cities from local storage or set to an empty array
function getCitiesFromStorage () {
  let cities = JSON.parse(localStorage.getItem('cities')) || [];
  return cities;   
}

//Get current weather from local storage or set to an empty object
function getCurrentWeatherFromStorage () {
  let currentWeather = JSON.parse(localStorage.getItem('currentWeather')) || null;
  return currentWeather
}

//Create Buttons from previous searches
function createCitiesButtons() {
  cityBtnContEl.innerHTML = ''; // Clear existing buttons
  let cities = getCitiesFromStorage();
  // console.log(cities);
  // console.log("console log for cities")
  if(cities)
  cities.forEach(city => {
    let cityBtn = document.createElement("button");
    cityBtn.textContent = city;
    cityBtn.classList.add("cityBtn")
    cityBtnContEl.appendChild(cityBtn);
  });
  
  
}

//Create current weather card to display on page
function createCurrentWeatherCard () {
  let currentWeather = getCurrentWeatherFromStorage();
  // console.log(currentWeather);
  
  if(currentWeather == null) {
    console.log("there is no current weather")
  }

  else {
  currentWeatherEl.innerHTML = `
    <h3>${currentWeather.city} ${currentWeather.date}</h3>
    <p>${currentWeather.temp}<p>
    <p>${currentWeather.wind}<p>
    <p>${currentWeather.humidity}<p>`
}

} //end createCurrentWeather Card function



//Click on search button after entering a city into the field to add to local storage
searchBtnEl.addEventListener("click", function(e) {
  e.preventDefault()
    
  let searchedCity = searchInputEl.value
  
  searchApi(searchedCity);
  // createCitiesButtons();
  searchInputEl.value = '';
})

//Runs the create buttons function on page load and will take whatever is in local storage and display it
createCitiesButtons();
createCurrentWeatherCard();
buttonSearch();
// createFiveDayForecastCard();



function buttonSearch () {
  
  for(i=0; i < cityBtn.length; i++) {
    cityBtn[i].addEventListener("click", function (e) {
      let cityBtnText = e.target.textContent 
      searchApi(cityBtnText)
    })
  }
  
  
}
  










function searchApi (city) {
  //Must start out with searching API for city by city name
  let weatherCityURL = `http://api.openweathermap.org/data/2.5/forecast?q=${city},us&appid=52d4c71f9cae17ae79966146d4c3044e`
  
  


  fetch(weatherCityURL)
  .then(function (response) {
    if(!response.ok) {
      alert("Please enter a valid city")
    }
    return response.json()    
  })

  .then(function (data) {
    
    let cityGeoInfo = {
      lat: data.city.coord.lat,
      lon: data.city.coord.lon,
    }
    
    let currentGeoURL = `http://api.openweathermap.org/data/2.5/weather?lat=${cityGeoInfo.lat}&lon=${cityGeoInfo.lon}&units=imperial&appid=52d4c71f9cae17ae79966146d4c3044e`
    
    fetch(currentGeoURL)
    .then(function (response) {
      return response.json();
    })
    .then (function (data) {
      let currentWeather = {
        city: data.name,
        date: Date(data.dt*1000),
        temp: data.main.temp,
        wind: data.wind.speed,
        humidity: data.main.humidity
      }

      //Set currentWeather Object to local storage and create current weather card from new localstorage data
      localStorage.setItem('currentWeather', JSON.stringify(currentWeather));
      createCurrentWeatherCard();

      //Push new city to array and create a new set of buttons
      let cities = getCitiesFromStorage()
      cities.push(currentWeather.city);
      localStorage.setItem('cities', JSON.stringify(cities));
      createCitiesButtons();
    })

    let foreCastGeo = `http://api.openweathermap.org/data/2.5/forecast?lat=${cityGeoInfo.lat}&lon=${cityGeoInfo.lon}&units=imperial&cnt=5&appid=52d4c71f9cae17ae79966146d4c3044e`

    // fetch(foreCastGeo) 
    //   .then(function (response) {
    //     return response.json();
    //   })
    //   .then(function (data) {
    //     let fiveDayWeather = []
    //     for (listItem of dataList) {
    //       let forecastWeather = {
    //         city: data.city.name,
    //         date: listItem.dt,
    //         temp: `Temp: ${listItem.main.temp} F`,
    //         wind: `Wind: ${listItem.wind.speed} MPH`,
    //         humidity: `Humidity: ${listItem.main.humidity} %`,
    //       }
    //       fiveDayWeather.push(forecastWeather);
    //       // console.log(fiveDayWeather)
    //     }
    //   })
    
  }) //end of .then where you started using other urls

  //end function searchApi
}





