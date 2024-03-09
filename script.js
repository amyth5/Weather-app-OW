const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container")

const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");




let currentTab =userTab;
const API_KEY = "d1845658f92b31c64bd94f06f7188c9c";
currentTab.classList.add("current-tab");


function switchTab(clickedTab){

    errorContainer.classList.remove("active");
    if(clickedTab!= currentTab){

        currentTab.classList.remove("current-tab");
        currentTab = clickedTab;
        currentTab.classList.add("current-tab");

        if(!searchForm.classList.contains("active")){
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");
        } 
        else{
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");

            getFromSessionStorage();


        }
    }
    else{
        

    }
}

userTab.addEventListener("click", () =>{
    switchTab(userTab);
});

searchTab.addEventListener("click", () =>{
    switchTab(searchTab);
});






// check if coordinatws are  present in storage

function getFromSessionStorage() {

    const localCoordinates = sessionStorage.getItem("user-coordinates")
    if(!localCoordinates) {

        // if local coordinates are not found
        grantAccessContainer.classList.add("active");

    }
    else{

        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);



    }
}

async function fetchUserWeatherInfo(coordinates) {
    
    const {lat, lon} = coordinates;

    // make grant container invisible 
    grantAccessContainer.classList.remove("active");

    // make loader visible

    loadingScreen.classList.add("active");

    //  API call;

    try{

        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
        );
        
        const data = await response.json();
        loadingScreen.classList.remove("active");

        userInfoContainer.classList.add("active");
        
        renderWeatherInfo(data);
        

    }
    catch(err){

        loadingScreen.classList.remove("active"); 
    }
      
     
}

function renderWeatherInfo(weatherInfo) {

    // fetching all the elements 


    const cityName = document.querySelector("[data-cityName]");
    const countryIcon =  document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windspeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-cloudiness]"); 

    // assigning dynamic values
     
    cityName.innerText =weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = `${weatherInfo?.main?.temp}` + " °C";
    windspeed.innerText =`${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity} %`;
    cloudiness.innerText = `${weatherInfo?.clouds?.all}%`;

    if(temp.innerText===undefined){
        alert(" nahi aaya kuch")

        userInfoContainer.classList.remove("active");
        loadingScreen.classList.remove("active");
        errorContainer.classList.add("active");

    }

}

function getLocation(){

    if(navigator.geolocation){
        // getCurrentPosition is a method of the geolocation property.
        //  It is used to asynchronously retrieve the current position of the device.

        navigator.geolocation.getCurrentPosition(showPosition);  // showPosition is a callback function
    }
    else{

        alert("no geolocation support available");
        //show an alert for no geolocation support available
         
    }

}


function showPosition(position){
    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude
    }

    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);

    
}

const grantAccessButton = document.querySelector("[data-grantAccess]");

// grantAccessButton.addEventListener("click", getLocation);

grantAccessButton.addEventListener("click", function() {
    // Additional logic here
    grantAccessContainer.classList.remove("active")
    loadingScreen.classList.add("active");
    console.log("Additional logic executed");

    // Call the getLocation function
    getLocation();
});


const searchInput = document.querySelector("[data-searchInput]");

searchForm.addEventListener("submit", (e)=>{

    e.preventDefault();

    let cityName = searchInput.value;
    

    if(cityName === "") {
        return;

    }
    else{
        fetchSearchWeatherInfo(cityName);

    }
    

    
});





const errorContainer = document.querySelector(".error-container");


async function fechSearchWeatherInfo(city) {

    errorContainer.classList.remove("active");
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");

    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
        );

        if (!response.ok) {

            loadingScreen.classList.remove("active");
            userInfoContainer.classList.remove("active");
            errorContainer.classList.add("active");



            // Handle 404 error here
            console.error('City not found:', response.status);
            // throw new Error('City not found')
            
        }

        const data = await response.json();

        

        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    } catch (err) {

        loadingScreen.classList.remove("active");
        errorContainer.classList.add("active");
        // // Conditional rendering for 404 error
        
        // Hide other tabs when showing the error tab
        userInfoContainer.classList.remove("active");
        grantAccessContainer.classList.remove("active");
    }
}





async function fetchSearchWeatherInfo(city){
    
    errorContainer.classList.remove("active");

    loadingScreen.classList.add("active");

    userInfoContainer.classList.remove("active");

    grantAccessContainer.classList.remove("active");

    try{

        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
        )
        
        const data = await response.json();
        if(response.status==404){

            loadingScreen.classList.remove("active");
            userInfoContainer.classList.remove("active");
            errorContainer.classList.add("active");

        }else{
            loadingScreen.classList.remove("active");
            userInfoContainer.classList.add("active");
            renderWeatherInfo(data);

        }
        
        // loadingScreen.classList.remove("active");
        // userInfoContainer.classList.add("active");
        // renderWeatherInfo(data);
    }
    catch(err){

        
    
    }


}