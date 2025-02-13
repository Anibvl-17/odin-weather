const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const shortMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

async function getWeatherData(location) {
  const apiKey = 'EA5SLWEQCKVXL8BNXMZT8TWRY';
  const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?key=${apiKey}`;

  const response = await fetch(url);
  const data = await response.json();

  const todayData = getTodayData(data);
  const nextDaysData = getNextDaysData(data);

  updateActualWeather(todayData);
  updateTodaysHighlights(todayData);
  updateNextDays(nextDaysData);
}

function getTodayData(data) {
  return {
    // Actual related info
    location: data.resolvedAddress,
    datetimeEpoch: data.currentConditions.datetimeEpoch,
    description: data.description,
    feelslike: data.currentConditions.feelslike,
    temperature: data.currentConditions.temp,

    // Today's highlights
    humidity: data.currentConditions.humidity,
    uvindex: data.currentConditions.uvindex,
    visibility: data.currentConditions.visibility,
    windspeed: data.currentConditions.windspeed,
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

  const location = data.location;
  const temperature = data.temperature;
  const description = data.description;
  const feelsLike = data.feelslike;

  console.groupCollapsed('Actual Weather');
  console.log('Location:', location);
  console.log('Date:', fullDate);
  console.log('Weekday:', weekday);
  console.log('Hour:', hour);
  console.log('Temperature:', temperature);
  console.log('Description:', description);
  console.log('Feels Like:', feelsLike);
  console.groupEnd();
}

function updateTodaysHighlights(data) {
  const humidity = data.humidity;
  const uvindex = data.uvindex;
  const visibility = data.visibility;
  const windspeed = data.windspeed;
  const sunrise = data.sunrise;
  const sunset = data.sunset;

  console.groupCollapsed('Today\'s Highlights');
  console.log('Humidity:', humidity);
  console.log('UV Index:', uvindex);
  console.log('Visibility:', visibility);
  console.log('Windspeed:', windspeed);
  console.log('Sunrise:', sunrise);
  console.log('Sunset:', sunset);
  console.groupEnd();
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

getWeatherData('Cabrero');