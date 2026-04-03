import axios from 'axios';

export const getLiveWeather = async (city = 'Bishoftu') => {
    try {
        // Using wttr.in for a robust, keyless, hackathon-friendly live JSON weather feed
        const response = await axios.get(`https://wttr.in/${city}?format=j1`, { timeout: 10000 });
        const desc = response.data.current_condition[0].weatherDesc[0].value.toLowerCase();
        const tempC = response.data.current_condition[0].temp_C;

        let weatherCategory = 'sunny';
        // Parse raw string into our AI engine clusters
        if (desc.includes('rain') || desc.includes('shower') || desc.includes('drizzle') || desc.includes('thunder')) {
            weatherCategory = 'rainy';
        } else if (desc.includes('cloud') || desc.includes('overcast') || desc.includes('fog')) {
            weatherCategory = 'cloudy';
        } else if (desc.includes('clear') || desc.includes('night') || desc.includes('dark')) {
            // Native wttr.in payload detects clear skies at night
            const currentHour = new Date().getHours();
            if (currentHour >= 18 || currentHour <= 6) {
                weatherCategory = 'clear night';
            }
        }

        return {
            city: city,
            rawDescription: desc,
            category: weatherCategory,
            tempC: tempC
        };
    } catch (error) {
        console.error('Error fetching live weather, falling back to sunny baseline:', error.message);
        return { city, rawDescription: "Fallback Mode", category: 'sunny', tempC: 25 };
    }
};
