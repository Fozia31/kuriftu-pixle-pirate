const getWeather = async (city) => {
    // Fallback generator for simulated weather
    const defaultWeather = () => {
        const weatherOptions = ["sunny", "rainy", "cloudy"];
        return {
            weather: weatherOptions[Math.floor(Math.random() * weatherOptions.length)],
            source: "simulated"
        };
    };

    const apiKey = process.env.WEATHER_API_KEY;

    // Check if API key exists
    if (!apiKey) {
        console.log("Using simulated weather fallback (No API key)");
        return defaultWeather();
    }

    // Set up a 1.5-second timeout
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 1500);

    try {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
        const response = await fetch(url, { signal: controller.signal });
        
        clearTimeout(timeout); // Clear the timeout if the request completes in time

        if (!response.ok) {
            console.log("Using simulated weather fallback (API response error)");
            return defaultWeather();
        }

        const data = await response.json();
        
        // Map OpenWeather map descriptions to our AI engine recognized formats
        let mappedWeather = "sunny"; // default safe fallback mapping
        if (data.weather && data.weather.length > 0) {
            const mainCondition = data.weather[0].main.toLowerCase();
            
            if (mainCondition.includes("clear")) {
                mappedWeather = "sunny";
            } else if (mainCondition.includes("rain") || mainCondition.includes("drizzle") || mainCondition.includes("thunderstorm")) {
                mappedWeather = "rainy";
            } else if (mainCondition.includes("cloud")) {
                mappedWeather = "cloudy";
            } else if (mainCondition.includes("snow")) {
                mappedWeather = "rainy"; // Group snow/extreme under lower demand
            }
        }
        
        console.log("Using real weather data");
        return {
            weather: mappedWeather,
            source: "api"
        };
    } catch (error) {
        clearTimeout(timeout);
        console.log(`Using simulated weather fallback (Network/Timeout: ${error.message})`);
        return defaultWeather();
    }
};

module.exports = {
    getWeather
};
