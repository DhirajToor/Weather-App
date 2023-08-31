console.log("hello jee");

const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");
const grantAccessContainer = document.querySelector(".grant-location-container");
// const formContainer = document.querySelector(".form-container");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");

const searchForm = document.querySelector("[data-searchForm]");

const notFound = document.querySelector(".error");


// const cityName = document.querySelector("[data-cityName]");
// const countryIcon = document.querySelector("[data-countryIcon]");
// const weatherDesc = document.querySelector("[data-weatherDesc]");
// const weatherIcon = document.querySelector("[data-weatherIcon]");
// const temp = document.querySelector("[data-temp]");

//  const windSpeed = document.querySelector("[data-windSpeed]");
//  const humidity = document.querySelector("[data-humidity]");
//  const cloud = document.querySelector("[data-cloud]");

 // initail variables  neds??
 let currentTab = userTab;
 userTab.classList.add("current-tab");
 getFromSessionStorage();

 currentTab.classList.add("current-tab")



 notFound.classList.remove("active");

    
 const API_KEY = "d1845658f92b31c64bd94f06f7188c9c";

//  function renderWeatherInfo(data){
     
//     let newPara = document.createElement('p');
//     newPara.textContent = `${data?.main?.temp.toFixed(2)} °C`

//     document.body.appendChild(newPara);
//   }


 async function fetchWeatherDetails(){ 
    
 try{
    let city = "goa";
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);

    const data = await response.json();
    console.log("weather data ==>", data);

    renderWeatherInfo(data);
    }


 catch(err){

    // handle the error here

 }
  }

    //https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric
//  async function getCustomWeatherDetails(){

    
//   try{
//     let latitude = 15.333;
//     let longitude =74.0833;

//     let result = await  fetch(` https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`);
//     let data = await result.json();
//     console.log(data);

//    }
//    catch(err){
//     console.log("error is =",err);
//    }
//  }

 


 function switchTab(clickedTab) {

    // apiErrorContainer.classList.remove("active");
  
    if (clickedTab !== currentTab) {
      currentTab.classList.remove("current-tab");
      currentTab = clickedTab;
      currentTab.classList.add("current-tab");
  
      if (!searchForm.classList.contains("active")) {
        userInfoContainer.classList.remove("active");
        grantAccessContainer.classList.remove("active");
        searchForm.classList.add("active");
        
      } 
      else {
        searchForm.classList.remove("active");
        userInfoContainer.classList.remove("active");
        notFound.classList.remove("active");
        getFromSessionStorage();
      }
  
      // console.log("Current Tab", currentTab);
    }
  }
  
 userTab.addEventListener("click",() => {
  // pass clicked tab as input parameter
  switchTab(userTab);
 });

 searchTab.addEventListener("click",() => {
  // pass clicked tab as input parameter
  switchTab(searchTab);
 });

  function getFromSessionStorage(){
    const localCoordinates = sessionStorage.getItem("user-coordinates");
    if(!localCoordinates){

      grantAccessContainer.classList.add("active");
    }
    else{
      const coordinates = JSON.parse(localCoordinates);
      fetchUserWeatherInfo(coordinates);
    }
  }

 async  function fetchUserWeatherInfo(coordinates){
   const {lat,lon} = coordinates;
  // makegrantCOnatainer invisible
   grantAccessContainer.classList.remove("active");
  //  make loader visible
  loadingScreen.classList.add("active");

  // Api call
  try{
    
    const response = await  fetch(` https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
    let data = await response.json();
    // make invisible loader
    loadingScreen.classList.remove("active");
    userInfoContainer.classList.add("active");
    renderWeatherInfo(data);
  }
  catch(err){
   // make invisible loader
   loadingScreen.classList.remove("active");
  //  HW
   notFound.classList.add("active");

  }

  }

  function renderWeatherInfo(weatherInfo) {
    //fistly, we have to fethc the elements 

    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windspeed = document.querySelector("[data-windSpeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-cloud]");

    console.log(weatherInfo);
    console.log("name iss = ");
      console.log(weatherInfo?.name);
    //fetch values from weatherINfo object and put it UI elements

    // UI update 
    let valid =  weatherInfo?.name;
    if( valid === undefined){
      userInfoContainer.classList.remove("active");
      notFound.classList.add("active");

    }
    else{
      cityName.innerText = weatherInfo?.name;
  
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = `${weatherInfo?.main?.temp} °C`;
    windspeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity}%`;
    cloudiness.innerText = `${weatherInfo?.clouds?.all}%`;



    }
    
}

  function getLocation(){
    if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition(showPosition);

    }
    else{
      // HW show an alert for no geolocation available 
      alert("no Location Access available ");
    }
  }

  function showPosition(position){

    const userCoordinates = {
      lat:position.coords.latitude,
      lon:position.coords.longitude,
    }
    
    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
  }
  
  const grantAccessButon = document.querySelector("[data-grantAccess]");
  grantAccessButon.addEventListener("click", getLocation);

  const searchInput = document.querySelector("[data-searchInput");

  searchForm.addEventListener("submit",(e)=>{
    e.preventDefault();
    let cityName = searchInput.value;
    if(cityName === " "){

    }
    else{
    
      fetchSearchWeatherInfo(cityName);
    }
  });

  async function fetchSearchWeatherInfo(city){

    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");
    notFound.classList.remove("active");


    try{     
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );

    const data = await response.json(); 
    
    notFound.classList.remove("active");
    loadingScreen.classList.remove("active");
    userInfoContainer.classList.add("active");
    renderWeatherInfo(data);
    }
    catch(err){

      
    loadingScreen.classList.remove("active");
    userInfoContainer.classList.remove("active");
      notFound.classList.add("active");

      // hw
    }

  }
