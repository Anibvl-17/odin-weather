const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const shortMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

async function getWeatherData(location) {
  const apiKey = 'EA5SLWEQCKVXL8BNXMZT8TWRY';
  const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?key=${apiKey}`;

  const response = await fetch(url);
  const data = await response.json();

  console.log(data);

  const todayData = getTodayData(data);
  const nextDaysData = getNextDaysData(data);

  updateActualWeather(todayData);
  updateTodaysHighlights(todayData);
  updateNextDays(nextDaysData);
  updateUnits();
}

function getTodayData(data) {
  return {
    // Actual related info
    location: data.resolvedAddress,
    datetimeEpoch: data.currentConditions.datetimeEpoch,
    description: data.description,
    feelslike: data.currentConditions.feelslike,
    temperature: data.currentConditions.temp,
    icon: data.currentConditions.icon,

    // Today's highlights
    humidity: data.currentConditions.humidity,
    uvindex: data.currentConditions.uvindex,
    visibility: data.currentConditions.visibility,
    windspeed: data.currentConditions.windspeed,
    winddir: data.currentConditions.winddir,
    sunrise: data.currentConditions.sunrise,
    sunset: data.currentConditions.sunset,
  };
}

function getNextDaysData(data) {
  const nextDays = [];

  for (const day of data.days) {
    nextDays.push({
      datetimeEpoch: day.datetimeEpoch,
      icon: day.icon,
      tempMin: day.tempmin,
      tempMax: day.tempmax
    });
  }

  return nextDays;
}

function updateActualWeather(data) {
  // The date is in epoch (in seconds) format, so we need to convert it to milliseconds 
  // (multiply by 1000). Creating it as a Date object allows us to use the Date methods :)
  const date = new Date(data.datetimeEpoch * 1000);
  const weekday = weekdays[date.getDay()];
  const fullDate = date.toLocaleDateString();
  const hour = date.toLocaleTimeString();
  
  const icon = data.icon;
  const location = data.location;
  const temperature = data.temperature;
  const description = data.description;
  const feelsLike = data.feelslike;

  document.getElementById('location').textContent = location;
  document.getElementById('actual-day').textContent = weekday;
  document.getElementById('actual-date').textContent = fullDate;
  document.getElementById('time').textContent = hour;
  document.getElementById('actual-icon').src = `icons/${icon}.png`;
  document.getElementById('actual-temperature').textContent = temperature;
  document.getElementById('actual-description').textContent = description;
  document.getElementById('feelslike').textContent = feelsLike;
}

function updateTodaysHighlights(data) {
  const humidity = data.humidity;
  const uvIndex = data.uvindex;
  const visibility = data.visibility;
  const windspeed = data.windspeed;
  const winddir = data.winddir;
  const sunrise = data.sunrise;
  const sunset = data.sunset;
  const hour = new Date(data.datetimeEpoch * 1000).toLocaleTimeString();

  document.getElementById('humidity').textContent = humidity;
  if (humidity <= 30) document.getElementById('humidity-description').textContent = 'Low';
  else if (humidity <= 60) document.getElementById('humidity-description').textContent = 'Moderate';
  else document.getElementById('humidity-description').textContent = 'High';
  
  document.getElementById('uv-index').textContent = uvIndex;
  if (uvIndex <= 3) document.getElementById('uv-description').textContent = 'Low UV';
  else if (uvIndex <= 5) document.getElementById('uv-description').textContent = 'Moderate UV';
  else if (uvIndex <= 8) document.getElementById('uv-description').textContent = 'High UV';
  else document.getElementById('uv-description').textContent = 'Extreme UV';

  document.getElementById('visibility').textContent = visibility;
  document.getElementById('visibility-description').textContent = hour;

  document.getElementById('windspeed').textContent = windspeed;
  document.getElementById('winddir-icon').style.transform = `rotate(${winddir}deg)`;
  if (winddir >= 337.5 || winddir < 22.5) document.getElementById('wind-description').textContent = 'North';
  else if (winddir < 67.5) document.getElementById('wind-description').textContent = 'Northeast';
  else if (winddir < 112.5) document.getElementById('wind-description').textContent = 'East';
  else if (winddir < 157.5) document.getElementById('wind-description').textContent = 'Southeast';
  else if (winddir < 202.5) document.getElementById('wind-description').textContent = 'South';
  else if (winddir < 247.5) document.getElementById('wind-description').textContent = 'Southwest';
  else if (winddir < 292.5) document.getElementById('wind-description').textContent = 'West';
  else document.getElementById('wind-description').textContent = 'Northwest';

  document.getElementById('sunrise-time').textContent = sunrise;
  document.getElementById('sunset-time').textContent = sunset
}

function updateNextDays(data) {
  // Used to limit the number of days to display (upto 10 days)
  let counter = 0;

  console.groupCollapsed('Next Days');
  for (const day of data) {
    if (counter >= 10) break;

    const date = new Date(day.datetimeEpoch * 1000);
    const weekday = date.getDay();
    const fullDate = date.toLocaleDateString();
    const icon = day.icon;
    const tempMin = day.tempMin;
    const tempMax = day.tempMax;
    console.groupCollapsed('Day', fullDate, '(', weekdays[weekday], ')');
    console.log('Icon:', icon);
    console.log('Min Temp:', tempMin);
    console.log('Max Temp:', tempMax);
    console.groupEnd();

    counter++;
  }
  console.groupEnd();
}

function updateUnits() {
  const temperatureUnits = document.querySelectorAll('.temp-unit');
  for (const unit of temperatureUnits) {
    unit.textContent = ' °C';
  }

  const speedUnits = document.querySelectorAll('.speed-unit');
  for (const unit of speedUnits) {
    unit.textContent = ' km/h';
  }

  const distanceUnits = document.querySelectorAll('.distance-unit');
  for (const unit of distanceUnits) {
    unit.textContent = ' km';
  }

  const uvUnits = document.querySelectorAll('.uv-unit');
  for (const unit of uvUnits) {
    unit.textContent = ' UV';
  }

  const percentUnits = document.querySelectorAll('.percent-unit');
  for (const unit of percentUnits) {
    unit.textContent = ' %';
  }
}

getWeatherData('Cabrero');