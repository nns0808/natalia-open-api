document.addEventListener('DOMContentLoaded', function() {
    async function fetchData() {
        try {
          const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=38.5816&longitude=-121.4944&current=temperature_2m,is_day,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&temperature_unit=fahrenheit&timezone=America%2FLos_Angeles&forecast_days=14');
            if (!response.ok) {
                throw new Error('Request failed');
            }

            const data = await response.json();
            console.log(data);

        } catch (error) {
            console.error('An error occurred:', error);
        }
    }

    fetchData();
});
