//Surge service matlab time ,wheather ,trafic ke hissab se ride pe surge charges exatra lagte ha wo batana and compare karwana 
import fetch from 'node-fetch';
const options = { method: 'GET', headers: { accept: 'application/json' } };

function getCurrentTime() {
    const currentTime = new Date();
    return currentTime;
}

// Location string → { latitude, longitude, name, country } 
async function getCoordinates(location) {
    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(location)}&count=1`;

    const response = await fetch(geoUrl, options);
    const data = await response.json();

    if (!data.results || data.results.length === 0) {
        throw new Error(`Location "${location}" not found`);
    }

    const { latitude, longitude, name, country } = data.results[0];
    return { latitude, longitude, name, country };
}

// Coordinates se weather fetch karta hai 
async function weatherData(latitude, longitude) {
    try {
        url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;

        const response = await fetch(url, options);
        const data = await response.json();

        console.log(' Weather data:', data.current_weather.weathercode);

        const code = data.current_weather.weathercode;

        return code;
    } catch (error) {
        console.error(' Error fetching weather data:', error);
        throw error;
    }
}

//Time dekh ke traffic status batata hai 
function getTrafficFromTime() {
    const getTrafficDataTime = getCurrentTime();
    const hour = getTrafficDataTime.getHours();

    let trafficStatus;

    if (hour >= 8 && hour < 11) {
        trafficStatus = " Heavy traffic - Morning rush hour";
    } else if (hour >= 11 && hour < 17) {
        trafficStatus = " Moderate traffic - Daytime";
    } else if (hour >= 17 && hour < 21) {
        trafficStatus = "Heavy traffic - Evening rush hour";
    } else {
        trafficStatus = " Light traffic - Off hours";
    }

    console.log(`Current Time: ${getTrafficDataTime.toLocaleTimeString()}`);
    console.log(` Traffic Status: ${trafficStatus}`);

    return trafficStatus;
}


function calculateSurgeMultiplier(currentTime, code, trafficStatus) {
    const hour = currentTime.getHours();

    const baseMultiplier = 1.0;

    let weatherCheckMultiplier;

    if (code === 0) {
        weatherCheckMultiplier = 0.0;        // Clear sky → no extra charge
    } else if (code >= 1 && code <= 3) {
        weatherCheckMultiplier = 0.1;        // Partly cloudy → thoda sa
    } else if (code >= 51 && code <= 67) {
        weatherCheckMultiplier = 0.5;        // Rain → +0.5
    } else if (code >= 71 && code <= 77) {
        weatherCheckMultiplier = 0.7;        // Snow → +0.7
    } else if (code === 95) {
        weatherCheckMultiplier = 0.8;        // Thunderstorm → +0.8
    } else {
        weatherCheckMultiplier = 0.0;
    }


    let trafficMultiplier;

    if (trafficStatus.includes("Heavy")) {
        trafficMultiplier = 0.5;
    } else if (trafficStatus.includes("Moderate")) {
        trafficMultiplier = 0.2;
    } else {
        trafficMultiplier = 0.0;   // Light traffic
    }


    let timeMultiplier;

    if ((hour >= 8 && hour < 11) || (hour >= 17 && hour < 21)) {
        timeMultiplier = 0.3;        // Rush hours
    } else if (hour >= 0 && hour < 5) {
        timeMultiplier = 0.2;        // Late night
    } else {
        timeMultiplier = 0.0;        // Normal hours
    }

    const total = baseMultiplier + weatherCheckMultiplier + trafficMultiplier + timeMultiplier;

    return {
        surgeMultiplier: Math.min(total, 3.0),
        breakdown: {
            base: baseMultiplier,
            weather: weatherCheckMultiplier,
            traffic: trafficMultiplier,
            time: timeMultiplier
        }
    };
}

function applySurgeToRide(ride , surgeMultiplier){
    const basePrice = ride.price;
    
    const surgedPrice = basePrice * surgeMultiplier;
    return {
        ...ride,
        surgedPrice:surgedPrice
    }
}

module.exports = {
    applySurgeToRide
};
