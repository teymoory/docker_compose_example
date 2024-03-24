const express = require('express');
const axios = require('axios');
const redis = require('redis');
const os = require('os');

const app = express();
const port = 3000;

const redisHost = process.env.REDIS_HOST;
const redisPort = process.env.REDIS_PORT;


const redisClient = redis.createClient({
    host: redisHost,
    port: redisPort,
    db: 0,
});

app.get('/', async (req, res) => {
    try {
        const response = await axios.get('https://wttr.in');
        const weatherData = response.data;

        redisClient.select(0, () => {
            redisClient.set('weatherData', weatherData);
        });

        const ipAddress = getIpAddress();
        res.send(renderHTML(weatherData, ipAddress));
    } catch (error) {
        console.error('Error fetching weather data :', error.message);
        res.status(500).send('Internal Server Error');
    }
});

function renderHTML(weatherData, ipAddress) {
    return `
    <html>
        <head>
            <title>Weather Information</title>
            <style>
                body {
                    text-align: center;
                }
                pre {
                    display: inline-block;
                    text-align: left
                }
            </style>
        </head>
        <body>
                <h2>Weather Information</h2>
                <h1>${weatherData}</h1>
                <p>Server IP Address: ${ipAddress}</h2>

        </body>
    </html>
    `;
}

function getIpAddress() {
    const networkInterfaces = os.networkInterfaces();
    const ipAddress = Object.values(networkInterfaces)
        .flat()
        .find((iface) => iface.family === 'IPv4' && !iface.internal)?.address;

    return ipAddress || 'N/A';
}

app.listen(port, () => {
    console.log(`Server is runing at http://localhost:${port}`)
});