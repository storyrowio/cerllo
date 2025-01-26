import axios from "axios";

const countryApi = "https://raw.githubusercontent.com/dr5hn/countries-states-cities-database/refs/heads/master/json/countries%2Bstates%2Bcities.json";

export const GetCountries = async () => {
    try {
        const response = await axios.get(countryApi);
        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
};