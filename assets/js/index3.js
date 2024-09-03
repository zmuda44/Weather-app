//Define page elements
const searchBtn = document.getElementById("search-btn");
const searchInput = document.getElementById("search-input-box");
const currentWeather = document.getElementById("current-weather");
const fiveDayBox = document.getElementById("five-day");
const cityBtnCont = document.getElementById("cities-btn-container")
cityNameDateIconEl = document.createElement("h3");
cityDateEl = document.createElement("h3");
weatherInfoEl = document.createElement("p");
let createCard = document.createElement("div")

// let citiesBtns = document.querySelectorAll(".cities-btn");


function createPrevSearchedButtons () {
  let cities = readCitiesFromStorage()
  console.log(cities)
  console.log("city button")
  let cityBtn = document.createElement("button")
  // cityBtn.textContent = city;
  // cityBtnCont.appendChild(cityBtn)






}




function searchAPI (cityName) {
//  console.log(cityName)  
  
  //Must start out with searching API for city by city name
  let weatherLocURL = `http://api.openweathermap.org/data/2.5/forecast?q=${cityName},us&appid=52d4c71f9cae17ae79966146d4c3044e`
  
  // console.log(weatherLocURL);
  fetch(weatherLocURL)
  .then(function (response) {
      return response.json();
  })
  .then(function (data) {
    // console.log(data);
    console.log(`city.name is ${data.city.name}`)

    //Create object to store geo location for next URL query
    let cityGeoInfo = {
    city: data.city.id,
    lat: data.city.coord.lat,
    lon: data.city.coord.lon,   
    }

    //URL queries for both current weather and forecasted weather
    let currentGeo = `http://api.openweathermap.org/data/2.5/weather?lat=${cityGeoInfo.lat}&lon=${cityGeoInfo.lon}&units=imperial&appid=52d4c71f9cae17ae79966146d4c3044e`
    let foreCastGeo = `http://api.openweathermap.org/data/2.5/forecast?lat=${cityGeoInfo.lat}&lon=${cityGeoInfo.lon}&units=imperial&cnt=5&appid=52d4c71f9cae17ae79966146d4c3044e`
    
    // console.log(`this is the new url ${currentGeo}`)

    //Fetch URL with long and lat to get weather info for city
    fetch(currentGeo)    
    .then(function (response) {
          // if(!response.ok) {
          //   return alert('city not found');
          // }
      return response.json();
    })
    .then(function (data) {
          // console.log(data)
      
      //Create object for displayed weather info for current weather
      let currentCityInfo = {
        city: data.name,
        date: Date(data.dt*1000),
            // date: this.dataCalc,
        temp: `Temp: ${data.main.temp} F`,
        wind: `Wind: ${data.wind.speed} MPH`,
        humidity: `Humidity: ${data.main.humidity} %`,
      }
      
      let current = localStorage.setItem('current', JSON.stringify(currentCityInfo));
      createCurrentDetailsCard(current);
      console.log(current.date)
      console.log("current object after setting")
          
    })

    fetch(foreCastGeo)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        console.log(data)
        console.log("above is data for forecast object")
        let dataList = data.list

        let fiveDayDetails = []
        
        for (listItem of dataList) {
            // console.log(listItem)
          let forecastCityInfo = {
            city: data.city.name,
            date: listItem.dt,
            temp: `Temp: ${listItem.main.temp} F`,
            wind: `Wind: ${listItem.wind.speed} MPH`,
            humidity: `Humidity: ${listItem.main.humidity} %`,
            }
          fiveDayDetails.push(forecastCityInfo);
        }

          // console.log(fiveDayDetails)
        let fiveDay = localStorage.setItem('five-day', JSON.stringify(fiveDayDetails))
        createFiveDayCard(fiveDay);
        // console.log(JSON.parse(localStorage.getItem('5-day')))
        // console.log("above is local storage after storing 5 day")
          // console.log("above is local storage")
             
    })
  })

  

  
  
//Create details card from object in 
function createCurrentDetailsCard (current) {
  // let city = JSON.parse(localStorage.getItem('current'))
  // console.log(city)
  // console.log("above is city")
  currentWeather.innerHTML = `
    <h3>${current.city} ${current.date}</h3>
    <p>${current.temp}<p>
    <p>${current.wind}<p>
    <p>${current.humidity}<p>`
    

   
  console.log(fiveDayCardInfo);
  console.log("above 5 day card info");
}   
    
    
      
    // const fiveDayElements = 
function createFiveDayCard () {
  for (i=0; i < fiveDayCardInfo.length; i++) {    
    const card = document.createElement("div");
    card.classList.add("card")
    fiveDayBox.appendChild(card)
    
    const cityNameDateIconEl = document.createElement("h3");
    cityNameDateIconEl.textContent = fiveDayCardInfo[i].date
    card.appendChild(cityNameDateIconEl)

    const tempEl = document.createElement("p");
    tempEl.textContent = fiveDayCardInfo[i].temp
    card.appendChild(tempEl)

    const windEl = document.createElement("p");
    windEl.textContent = fiveDayCardInfo[i].wind
    card.appendChild(windEl)
    
    const humidEl = document.createElement("p");
    humidEl.textContent = fiveDayCardInfo[i].humidity
    card.appendChild(humidEl)      
  }
//do not delete this last one
}}

//Start document with info on cities populated or empty
function readCitiesFromStorage () {
// let cities = JSON.parse(localStorage.getItem('city'));
// console.log(cities)
if(cities == '') {
  let cities = [];
}
return cities;
}

////Start document with info from local storage for current weather
function readCurrentWeatherFromStorage () {
let currentCardInfo = JSON.parse(localStorage.getItem('current'));
if(!currentCardInfo) {
  let currentCardInfo = []
}
return currentCardInfo
}

//Start document with info from local storage for five day forecast
function readFiveDayForecastFromStorage () {
let fiveDayCardInfo = JSON.parse(localStorage.getItem('5-day'));
if(!fiveDayCardInfo) {
  fiveDayCardInfo = []
}
return fiveDayCardInfo
// createPrevSearchedButtons(currentCardInfo)
}



createPrevSearchedButtons();
// printCurrentWeather();
// printFiveDayForecast();


//Click on search button and enter city name in input field to display information
searchBtn.addEventListener("click", function () {
  var searchInputVal = searchInput.value.trim().toLowerCase();
  // searchAPI(searchInputVal);
  // createPrevSearchedButtons(searchInputVal);
  let cities = readCitiesFromStorage();
  // cities.push(searchInputVal);
  console.log(cities)
  localStorage.setItem('city', cities);
  console.log("clicked")
  // createPrevSearchedButtons(searchInputVal)
});


function createWeatherFromButtons () {
  for (const button of citiesBtns) {
    button.addEventListener("click", function(event) {
      var text = event.target.textContent
      var correctedText = `${text.slice(0,1).toLowerCase()}${text.slice(1,text.length)}`
      searchAPI(correctedText);
    })
  }
}

// posible ideas:
//error messages if you get back a 404
//a drop down list for choices


// let cityState = `http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}`
//   let zip = `http://api.openweathermap.org/geo/1.0/zip?zip=08332,us&appid=52d4c71f9cae17ae79966146d4c3044e`
//   let cityID = `http://api.openweathermap.org/data/2.5/forecast?id={city ID}&appid=52d4c71f9cae17ae79966146d4c3044e`
  

  // var textContentCap = text.slice(0,1).toLowerCase()
    // var restOfWord = text.slice(1,text.length)
    // var corrected = `${textContentCap}${restOfWord}`


    //rewrite the inserting html elements on the page in a diferent way using innerHTML. should eliminate creating eleements      // for (i=0; i > data.list.length; i++) {
        //   let forecastCityInfo = {
        //     city: data.city.name,
        //     date: Date(data.list[0].dt*1000),
        //     temp: `Temp: ${data.list[0].main.temp} F`,
        //     wind: `Wind: ${data.list[0].wind.speed} MPH`,
        //     humidity: `Humidity: ${data.list[0].main.humidity} %`,
        //   }
        //   console.log(forecastCityInfo);
        // }

        // fiveDayBox.appendChild(fiveDayElements);

  



  // console.log(city)

    // createDetailsCard();



// function createDetailsCard () {
//   const detailsCard = document.createElement("div");
//   const detailsHeader = document.createElement("h3");
//   const detailsTemp = document.createElement("p");
//   const detailsWind = document.createElement("p");
//   const detailsHumidity = document.createElement("p");
  
//   // let detailsCity = {
//   //   city: data.city.cod,
//   //   date: "9-13-2024",
//   //   wind: "8.43mph",
//   //   humidity: "44%"
//   // }
    
//   // detailsBox.appendChild(detailsCard);

//   localStorage.setItem('details', JSON.stringify(detailsCity));
// };


// cityNameDateIconEl.textContent = `${city.city} '${city.date}`;
    // currentWeather.appendChild(cityNameDateIconEl);


     // cityNameDateIconEl.textContent = fiveDayCardInfo[i].date
      // console.log(fiveDayCardInfo[i])
      // console.log("test 1 is above")



       // let geoTimeStamp = `https://api.openweathermap.org/data/3.0/onecall/timemachine?lat=${cityGeoInfo.lat}&lon=${cityGeoInfo.lon}&dt={time}&appid=52d4c71f9cae17ae79966146d4c3044e`