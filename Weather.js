let cityinput = document.getElementById("city_input");
let searchBtn = document.getElementById("searchBtn");

const api_key = '250c5a8b3a9b1f439e73af5479db59f2';
const currentWeatherCard = document.querySelectorAll('.weather-left .card')[0];
const fiveDaysForecastCard = document.querySelector('.day-forecast');
const aqiCard = document.querySelectorAll('.highlights .card')[0];
const sunriseCard = document.querySelectorAll('.highlights .card')[1];
const humidityVal = document.getElementById('humidityVal');
const pressureVal = document.getElementById('pressureVal');
const visibilityVal = document.getElementById('visibilityVal');
const windVal = document.getElementById('windSpeedVal');
const feelsVal = document.getElementById('feelsVal');
const hourlyForecastCard = document.querySelector('.hourly-forecast');


const aqiList = ['Good', 'Fair', 'Moderate', 'Poor', 'Very Poor'];

function getWeatherDetails(name, lat, lon, country, state) {
    const FORECAST_API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${api_key}`;
    const WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}`;
    const AIR_POLUTION_API_URL = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${api_key}`;

    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    // Fetch air pollution data
    fetch(AIR_POLUTION_API_URL)
        .then(res => res.json())
        .then(data => {
            const { co, no, no2, o3, so2, pm2_5, pm10, nh3 } = data.list[0].components;
            const aqi = data.list[0].main.aqi; 

            aqiCard.innerHTML = `
                <div class="card-head">
                    <p>Air Quality Index</p>
                    <p class="air-index aqi-${aqi}">${aqiList[aqi -1]}</p>
                </div>
                <div class="air-indeces">
                    <i class="fa-regular fa-wind fa-3x"></i>
                    <div class="item"><p>PM2.5</p><h2>${pm2_5}</h2></div>
                    <div class="item"><p>PM10</p><h2>${pm10}</h2></div>
                    <div class="item"><p>SO2</p><h2>${so2}</h2></div>
                    <div class="item"><p>CO</p><h2>${co}</h2></div>
                    <div class="item"><p>NO</p><h2>${no}</h2></div>
                    <div class="item"><p>NO2</p><h2>${no2}</h2></div>
                    <div class="item"><p>NH3</p><h2>${nh3}</h2></div>
                    <div class="item"><p>O3</p><h2>${o3}</h2></div>
                </div>
            `;
        })
        .catch(() => alert('Failed to fetch air pollution details'));

    // Fetch weather data
    fetch(WEATHER_API_URL)
        .then(res => res.json())
        .then(data => {
            if (data.cod !== 200) return alert('Failed to fetch weather details');

            const date = new Date();
            currentWeatherCard.innerHTML = `
                <div class="current-weather">
                    <div class="details">
                        <p>Now</p>
                        <h2>${(data.main.temp - 273.15).toFixed(2)}&deg;C</h2>
                        <p>${data.weather[0].description}</p>
                    </div>
                    <div class="weather-icon">
                        <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="">
                    </div>
                </div>
                <hr>
                <div class="card-footer">
                    <p><i class="fa-light fa-calendar"></i>${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]}, ${date.getFullYear()}</p>
                    <p><i class="fa-light fa-location-dot"></i>${name}, ${country}</p>
                </div>
            `;

            const { sunrise, sunset } = data.sys;
            const { timezone, visibility } = data;
            const { humidity, pressure, feels_like } = data.main;
            const { speed } = data.wind;
            const sRiseTime = moment.utc(sunrise, 'X').add(timezone, 'seconds').format('hh:mm A');
            const sSetTime = moment.utc(sunset, 'X').add(timezone, 'seconds').format('hh:mm A');

            sunriseCard.innerHTML = `
                <div class="card-head"><p>Sunrise & Sunset</p></div>
                <div class="sunrise-sunset">
                    <div class="item">
                        <div class="icon"><i class="fa-light fa-sunrise fa-4x"></i></div>
                        <div><p>Sunrise</p><h2>${sRiseTime}</h2></div>
                    </div>
                    <div class="item">
                        <div class="icon"><i class="fa-light fa-sunset fa-4x"></i></div>
                        <div><p>Sunset</p><h2>${sSetTime}</h2></div>
                    </div>
                </div>
            `;
            humidityVal.innerHTML = `${humidity}%`;
            pressureVal.innerHTML = `${pressure} hPa`;
            windVal.innerHTML = `${speed} m/s`;
            visibilityVal.innerHTML = `${visibility / 1000} km`;
            feelsVal.innerHTML = `${(feels_like - 273.15).toFixed(2)}&deg;C`;
        }).catch(() =>{
             alert('Failed to fetch weather details');
        });

    // Fetch forecast data
    fetch(FORECAST_API_URL)
        .then(res => res.json())
        .then(data => {
            let hourlyForecast = data.list;
            hourlyForecastCard.innerHTML = '';
            for(let i =0; i<=7; i++){
                let hrForecastDate = new Date(hourlyForecast[i].dt_txt);
                let hr = hrForecastDate.getHours();
                let a = 'PM'
                if(hr<12) a = 'AM';
                if(hr == 0) hr = 12;
                if(hr > 12) hr = hr - 12;
                hourlyForecastCard.innerHTML +=`
                    <div class="card">
                        <p>${hr} ${a}</p>
                        <img src="https://openweathermap.org/img/wn/${hourlyForecast[i].weather[0].icon}.png" alt="">
                        <p>${(hourlyForecast[i].main.temp - 273.15).toFixed(2)}&deg;C</p>
                    </div>
                `;

            }
            const uniqueForecastDays = [];
            const fiveDaysForecast = data.list.filter(forecast => {
                const forecastDate = new Date(forecast.dt_txt).toDateString();
                if (!uniqueForecastDays.includes(forecastDate)) {
                    uniqueForecastDays.push(forecastDate);
                    return true;
                }
                return false;
            });

            fiveDaysForecastCard.innerHTML = '';
            fiveDaysForecast.forEach(forecast => {
                const date = new Date(forecast.dt_txt);
                fiveDaysForecastCard.innerHTML += `
                    <div class="forecast-item">
                        <div class="icon-wrapper">
                            <img src="https://openweathermap.org/img/wn/${forecast.weather[0].icon}.png" alt="">
                            <span>${(forecast.main.temp - 273.15).toFixed(2)}&deg;C</span>
                        </div>
                        <p>${date.getDate()} ${months[date.getMonth()]}</p>
                        <p>${days[date.getDay()]}</p>
                    </div>
                `;
            });
        })
        .catch(() => alert('Failed to fetch forecast details'));
}

function getCityCoordinates() {
    const cityName = cityinput.value.trim();
    cityinput.value = '';
    if (!cityName) return;

    const GEOCODING_API_URL = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${api_key}`;
    fetch(GEOCODING_API_URL)
        .then(res => res.json())
        .then(data => {
            if (data.length > 0) {
                const { name, lat, lon, country, state } = data[0];
                getWeatherDetails(name, lat, lon, country, state);
            } else {
                alert('City not found');
            }
        })
        .catch(() => alert('Failed to fetch city coordinates'));
}



searchBtn.addEventListener('click', getCityCoordinates);
