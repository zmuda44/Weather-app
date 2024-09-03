//Define HTML static variables
const searchBtnEl = document.getElementById("search-btn");
const searchInputEl = document.getElementById("search-input");
const currentWeatherEl = document.getElementById("current-weather");
const fiveDayEl = document.getElementById("five-day");
const cityBtnContEl = document.getElementById("cities-btn-container") 
// let cityBtn = document.getElementsByClassName("cityBtn")


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

function getFiveDayForecastFromStorage () {
  let fiveDayForecast = JSON.parse(localStorage.getItem('fiveDayForecast')) || null;
  return fiveDayForecast
}

//Create Buttons from previous searches
function createCitiesButtons() {
  cityBtnContEl.innerHTML = ''; // Clear existing buttons
  let cities = getCitiesFromStorage();
  
  if (cities.length > 5) {
    cities.shift()
  }
  // if(cities)
  cities.forEach(city => {
    
      let cityBtn = document.createElement("button");
      cityBtn.textContent = city;
      cityBtn.classList.add("cityBtn")
      cityBtnContEl.insertBefore(cityBtn, cityBtnContEl.firstChild);
  
  localStorage.setItem('cities', JSON.stringify(cities))
  });
  
  
}

//Create current weather card to display on page
function createCurrentWeatherCard () {
  let currentWeather = getCurrentWeatherFromStorage();
  
  
  if(currentWeather == null) {
    
  }

  else {
  currentWeatherEl.innerHTML = `
    <div><h3>${currentWeather.city} ${currentWeather.date}</h3><img src="${currentWeather.icon}"></div>
    <p>Temp: ${currentWeather.temp}&degF<p>
    <p>Wind: ${currentWeather.wind} MPH<p>
    <p>Humidity ${currentWeather.humidity}%<p>`
}

} //end createCurrentWeather Card function

function createFiveDayForecastCards (){
  fiveDayEl.innerHTML = ''
  let fiveDayForecast = getFiveDayForecastFromStorage ()

  for (i=0; i < fiveDayForecast.length; i++) {
    
    
    const fiveDayForecastCard = document.createElement("div")
    fiveDayForecastCard.setAttribute("class", "five-day-card");

    const date = document.createElement("h3")
    date.textContent = `${fiveDayForecast[i].date}`
    fiveDayForecastCard.appendChild(date)    

    const icon = document.createElement("img")
    icon.setAttribute("src", fiveDayForecast[i].icon)
    fiveDayForecastCard.appendChild(icon)
    fiveDayEl.appendChild(fiveDayForecastCard);

    const temp = document.createElement("p")
    //Special note: Couldn't do HTML symbol without HTML
    temp.innerHTML = `Temp: ${fiveDayForecast[i].temp}&degF`
    fiveDayForecastCard.appendChild(temp)
    

    const wind = document.createElement("p")
    wind.textContent = `Wind: ${fiveDayForecast[i].wind} MPH`
    fiveDayForecastCard.appendChild(wind)
    

    const humidity = document.createElement("p")
    humidity.textContent = `Humidity: ${fiveDayForecast[i].humidity}%`
    fiveDayForecastCard.appendChild(humidity)

    fiveDayEl.appendChild(fiveDayForecastCard)
  
  }

  
}




//Click on search button after entering a city into the field to add to local storage
searchBtnEl.addEventListener("click", function(e) {
  e.preventDefault()
    
  let searchedCity = searchInputEl.value
  
  searchApi(searchedCity);
  // createCitiesButtons();
  searchInputEl.value = '';
})



//Add event listener to parent container of dynamically created buttons. 
cityBtnContEl.addEventListener("click", function (e) {
  if (e.target.classList.contains("cityBtn")) {
    let cityBtnText = e.target.textContent;
    searchApi(cityBtnText);
  }
})

 //Runs the create buttons function on page load and will take whatever is in local storage and display it
createCitiesButtons();
createCurrentWeatherCard();
createFiveDayForecastCards(); 










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
      let date = new Date(data.dt*1000).toLocaleDateString("en-US");
      
      let currentWeather = {
        city: data.name,
        date: date,
        icon: `http://openweathermap.org/img/w/${data.weather[0].icon}.png`,
        temp: data.main.temp,
        wind: data.wind.speed,
        humidity: data.main.humidity
      }

     

      //Set currentWeather Object to local storage and create current weather card from new localstorage data
      localStorage.setItem('currentWeather', JSON.stringify(currentWeather));
      createCurrentWeatherCard();

      //Push new city to array and create a new set of buttons
      let cities = getCitiesFromStorage()
      //If city already already there do not include new city. Mainly for buttons
      if(cities.includes(currentWeather.city)) {
        return
      }
      cities.push(currentWeather.city);
      localStorage.setItem('cities', JSON.stringify(cities));
      createCitiesButtons();
    })

    let foreCastGeo = `http://api.openweathermap.org/data/2.5/forecast/?lat=${cityGeoInfo.lat}&lon=${cityGeoInfo.lon}&units=imperial&appid=52d4c71f9cae17ae79966146d4c3044e`

    fetch(foreCastGeo) 
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
       console.log(data)
        let dataList = data.list
       
        let fiveDayForecast = []
        
        for(i=0; i < dataList.length; i+=8) {
         let forecastWeather = {
          
          date: new Date(dataList[i].dt*1000).toLocaleDateString("en-US"),
          // icon: `http://openweathermap.org/img/w/${dataList[i].weather.icon}.png`,
          icon: `http://openweathermap.org/img/w/${dataList[i].weather[0].icon}.png`,
          temp: dataList[i].main.temp,
          wind: dataList[i].wind.speed,
          humidity: dataList[i].main.humidity,
         }
         fiveDayForecast.push(forecastWeather)
         
        }
        
      console.log(fiveDayForecast[0].icon)
        
         localStorage.setItem('fiveDayForecast', JSON.stringify(fiveDayForecast))
         createFiveDayForecastCards()
         
        
      })
    
  }) //end of .then where you started using other urls

  //end function searchApi
}





