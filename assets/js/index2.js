//Define page elements
const searchBtn = document.getElementById("search-btn");
const searchInput = document.getElementById("search-input-box");
const currentWeather = document.getElementById("current-weather");
const fiveDayBox = document.getElementById("five-day");
cityNameDateIconEl = document.createElement("h3");
cityDateEl = document.createElement("h3");
weatherInfoEl = document.createElement("p");

let citiesBtns = document.querySelectorAll(".cities-btn");







function searchAPI (cityName) {
 console.log(cityName)
  
  
  
  let weatherLocURL = `http://api.openweathermap.org/data/2.5/forecast?q=${cityName},us&appid=52d4c71f9cae17ae79966146d4c3044e`
  
  //make a note that the 2nd fetch request took this url instead of the one lower on the page
  // let geo = `http://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid=52d4c71f9cae17ae79966146d4c3044e`
  
  
  console.log(weatherLocURL);
 
  
  fetch(weatherLocURL)
  
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    console.log(data);
    console.log(`city.name is ${data.city.name}`)

    let cityGeoInfo = {
    city: data.city.id,
    lat: data.city.coord.lat,
    lon: data.city.coord.lon,   
    }

    let currentGeo = `http://api.openweathermap.org/data/2.5/weather?lat=${cityGeoInfo.lat}&lon=${cityGeoInfo.lon}&units=imperial&appid=52d4c71f9cae17ae79966146d4c3044e`
    let foreCastGeo = `http://api.openweathermap.org/data/2.5/forecast?lat=${cityGeoInfo.lat}&lon=${cityGeoInfo.lon}&units=imperial&cnt=5&appid=52d4c71f9cae17ae79966146d4c3044e`
    // let geoTimeStamp = `https://api.openweathermap.org/data/3.0/onecall/timemachine?lat=${cityGeoInfo.lat}&lon=${cityGeoInfo.lon}&dt={time}&appid=52d4c71f9cae17ae79966146d4c3044e`
    console.log(`this is the new url ${currentGeo}`)

      fetch(currentGeo)    
      .then(function (response) {
        // if(!response.ok) {
        //   return alert('city not found');
        // }
        return response.json();
      })
      .then(function (data) {
        console.log(data)

        let currentCityInfo = {
          city: data.name,
          date: Date(data.dt*1000),
          // date: this.dataCalc,
          temp: `Temp: ${data.main.temp} F`,
          wind: `Wind: ${data.wind.speed} MPH`,
          humidity: `Humidity: ${data.main.humidity} %`,
        }
        console.log(currentCityInfo.date)
        createCurrentDetailsCard(currentCityInfo);
      })

      fetch(foreCastGeo)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        console.log(data)
        console.log("above is data for forecast object")
        let dataList = data.list
        for (listItem of dataList) {
          // console.log(listItem)
          let forecastCityInfo = {
            city: data.city.name,
            date: Date(data.list[0].dt*1000),
            temp: `Temp: ${listItem.main.temp} F`,
            wind: `Wind: ${listItem.wind.speed} MPH`,
            humidity: `Humidity: ${listItem.main.humidity} %`,
          }
          console.log(forecastCityInfo);
        }
        
  
        
       
        
      })

      

  })

  

  
  
  //Create details card from object in 
  function createCurrentDetailsCard (city) {
    
    currentWeather.innerHTML = `
    <h3>${city.city} ${city.date}</h3>
    <p>${city.temp}<p>
    <p>${city.wind}<p>
    <p>${city.humidity}<p>`
    // cityNameDateIconEl.textContent = `${city.city} '${city.date}`;
    // currentWeather.appendChild(cityNameDateIconEl);

    // weatherInfoEl.textContent = 

  }

  



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


//do not delete this last one
}




searchBtn.addEventListener("click", function () {
  var searchInputVal = searchInput.value.trim().toLowerCase();
  
  // createDetailsCard();
  searchAPI(searchInputVal);
  console.log("button clicked")
  
});

for (const button of citiesBtns) {
  button.addEventListener("click", function(event) {
    var text = event.target.textContent
    var correctedText = `${text.slice(0,1).toLowerCase()}${text.slice(1,text.length)}`
    searchAPI (correctedText);
  })
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