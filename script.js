const weekdays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const shortMonths = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
let tempUnit = " °F";

async function getWeatherData(location) {
  const apiKey = "EA5SLWEQCKVXL8BNXMZT8TWRY";
  const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?key=${apiKey}`;

  const response = await fetch(url);
  const status = response.status;
  if (status === 400) {
    alert(
      `Sorry, the location '${location}' couldn't be found, check if the location is correct or try another location.`
    );
    return;
  } else if (status === 401 || status === 429) {
    alert(
      `An error ocurred, please contact me in the link below (the GitHub link). Error code: ${status}`
    );
    return;
  } else if (status === 50) {
    // response with code 500
    alert("An error ocurred with the weather service, please try again later.");
    return;
  }

  const data = await response.json();

  const todayData = getTodayData(data);
  const nextDaysData = getNextDaysData(data);

  updateActualWeather(todayData);
  updateTodaysHighlights(todayData);
  updateNextDays(nextDaysData);
  if (tempUnit === " °C") updateValues();
  updateUnits();
}

function getTodayData(data) {
  return {
    // Actual related info
    location: data.resolvedAddress,
    datetimeEpoch: data.currentConditions.datetimeEpoch,
    description: data.description,
    feelslike: Math.round(data.currentConditions.feelslike),
    temperature: Math.round(data.currentConditions.temp),
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
      tempMin: Math.round(day.tempmin),
      tempMax: Math.round(day.tempmax),
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

  document.getElementById("location").textContent = location;
  document.getElementById("actual-day").textContent = weekday;
  document.getElementById("actual-date").textContent = fullDate;
  document.getElementById("actual-time").textContent = hour;
  document.getElementById("actual-icon").src = `icons/${icon}.png`;
  document.getElementById("actual-temperature").textContent = temperature;
  document.getElementById("actual-description").textContent = description;
  document.getElementById("feelslike").textContent = feelsLike;
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

  document.getElementById("humidity").textContent = humidity;
  if (humidity <= 30) {
    document.getElementById("humidity-description").textContent = "Low";
  } else if (humidity <= 60) {
    document.getElementById("humidity-description").textContent = "Moderate";
  } else {
    document.getElementById("humidity-description").textContent = "High";
  }

  document.getElementById("uv-index").textContent = uvIndex;
  if (uvIndex <= 3) {
    document.getElementById("uv-description").textContent = "Low UV";
  } else if (uvIndex <= 5) {
    document.getElementById("uv-description").textContent = "Moderate UV";
  } else if (uvIndex <= 8) {
    document.getElementById("uv-description").textContent = "High UV";
  } else {
    document.getElementById("uv-description").textContent = "Extreme UV";
  }

  document.getElementById("visibility").textContent = visibility;
  document.getElementById("visibility-description").textContent = hour;

  document.getElementById("windspeed").textContent = windspeed;
  document.getElementById("winddir-icon")
    .style.transform = `rotate(${winddir}deg)`;

  if (winddir >= 337.5 || winddir < 22.5) {
    document.getElementById("wind-description").textContent = "North";
  } else if (winddir < 67.5) {
      document.getElementById("wind-description").textContent = "Northeast";
  } else if (winddir < 112.5) {
      document.getElementById("wind-description").textContent = "East";
  } else if (winddir < 157.5) {
      document.getElementById("wind-description").textContent = "Southeast";
  } else if (winddir < 202.5) {
      document.getElementById("wind-description").textContent = "South";
  } else if (winddir < 247.5) {
      document.getElementById("wind-description").textContent = "Southwest";
  } else if (winddir < 292.5) {
      document.getElementById("wind-description").textContent = "West";
  } else {
    document.getElementById("wind-description").textContent = "Northwest";
  }
 
  document.getElementById("sunrise-time").textContent = sunrise;
  document.getElementById("sunset-time").textContent = sunset;
}

function updateNextDays(data) {
  const container = document.getElementById("next-days-container");

  // Remove all childs to prevent duplication
  container.textContent = "";

  // Used to limit the number of days to display (upto 10 days)
  let counter = 0;

  for (const day of data) {
    if (counter >= 11) break;

    // Skip first day, since it's already displayed (today)
    if (counter === 0) {
      counter++; 
      continue;
    }

    const date = new Date(day.datetimeEpoch * 1000);
    const weekday = date.getDay();

    const dayData = {
      weekday: weekdays[weekday],
      icon: day.icon,
      tempMin: day.tempMin,
      tempMax: day.tempMax,
    };

    const item = buildNextDayItem(dayData);
    container.appendChild(item);

    counter++;
  }
}

function updateValues() {
  const tempValues = document.querySelectorAll(".temp-value");
  if (tempUnit === " °C") {
    for (const value of tempValues) {
      value.textContent = Math.round(
        ((parseInt(value.textContent) - 32) * 5) / 9
      );
    }
  } else {
    for (const value of tempValues) {
      value.textContent = Math.round(
        (parseInt(value.textContent) * 9) / 5 + 32
      );
    }
  }
}

function updateUnits() {
  const temperatureUnits = document.querySelectorAll(".temp-unit");
  for (const unit of temperatureUnits) {
    unit.textContent = tempUnit;
  }

  const speedUnits = document.querySelectorAll(".speed-unit");
  for (const unit of speedUnits) {
    unit.textContent = " km/h";
  }

  const distanceUnits = document.querySelectorAll(".distance-unit");
  for (const unit of distanceUnits) {
    unit.textContent = " km";
  }

  const uvUnits = document.querySelectorAll(".uv-unit");
  for (const unit of uvUnits) {
    unit.textContent = " UV";
  }

  const percentUnits = document.querySelectorAll(".percent-unit");
  for (const unit of percentUnits) {
    unit.textContent = " %";
  }
}

function buildNextDayItem(data) {
  const item = document.createElement("div");
  item.classList.add("next-day");

  const weekday = document.createElement("p");
  weekday.classList.add("weekday");
  weekday.textContent = data.weekday;

  const icon = document.createElement("img");
  icon.classList.add("medium-icon");
  icon.src = `icons/${data.icon}.png`;

  const temperature = document.createElement("p");

  const minTemp = document.createElement("span");
  minTemp.classList.add("min-next-day", "temp-value");
  minTemp.textContent = data.tempMin;
  temperature.appendChild(minTemp);

  const minTempUnit = document.createElement("span");
  minTempUnit.classList.add("temp-unit");

  const br = document.createElement("br");

  const maxTemp = document.createElement("span");
  maxTemp.classList.add("max-next-day", "temp-value");
  maxTemp.textContent = data.tempMax;

  const maxTempUnit = document.createElement("span");
  maxTempUnit.classList.add("temp-unit");

  temperature.append(minTemp, minTempUnit, br, maxTemp, maxTempUnit);

  item.append(weekday, icon, temperature);

  return item;
}

getWeatherData("Santiago");

document.getElementById("unit-type").addEventListener("change", () => {
  const tempValues = document.querySelectorAll(".temp-value");

  if (tempUnit === " °C") {
    tempUnit = " °F";
  } else {
    tempUnit = " °C";
  }

  updateValues();
  updateUnits();
});

document.getElementById("search-location").addEventListener("submit", (e) => {
  e.preventDefault();
  const location = document.getElementById("search").value;
  getWeatherData(location);
});

const welcomeText = document.getElementById("welcome-text");
const welcomeIcon = document.getElementById("welcome-icon");
const actualHour = new Date().getHours();

if (actualHour >= 6 && actualHour < 12) {
  welcomeText.textContent = "Good morning";
  welcomeIcon.src = "icons/welcome-sunrise.svg";
} else if (actualHour >= 12 && actualHour < 18) {
  welcomeText.textContent = "Good afternoon";
  welcomeIcon.src = "icons/welcome-sun.svg";
} else if (actualHour >= 18 && actualHour < 21) {
  welcomeText.textContent = "Good evening";
  welcomeIcon.src = "icons/welcome-sunset.svg";
} else {
  welcomeText.textContent = "Good night";
  welcomeIcon.src = "icons/welcome-night.svg";
}