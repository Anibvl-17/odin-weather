async function getWeatherData(location) {
  const apiKey = 'EA5SLWEQCKVXL8BNXMZT8TWRY';
  const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?key=${apiKey}`;

  const response = await fetch(url);
  const data = await response.json();

  const todayData = getTodayData(data);
  const nextDaysData = getNextDaysData(data);
}

function getTodayData(data) {
  return {
    location: data.resolvedAddress,
    datetimeEpoch: data.currentConditions.datetimeEpoch,
    description: data.description,
    feelslike: data.currentConditions.feelslike,
    humidity: data.currentConditions.humidity,
    sunrise: data.currentConditions.sunrise,
    sunset: data.currentConditions.sunset,
    temperature: data.currentConditions.temp,
    uvindex: data.currentConditions.uvindex,
    visibility: data.currentConditions.visibility,
    windspeed: data.currentConditions.windspeed
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