// This file defines a function to ping the server at regular intervals to keep it alive. It uses the http or https module based on the protocol of the base URL, which is obtained from an environment variable. The function sends a GET request to the /api/v2/ping endpoint and logs the response status. If there is an error during the request, it logs the error message. The pingServer function is set to run every 10 minutes using setInterval.
// keepAlive.js
const http = require("http");
const https = require("https");
// const url = require("url");

const baseUrl = process.env.BASEURL || `http://localhost:8000`;

const pingServer = () => {
  if (!baseUrl) {
    console.error("BASEURL is not defined. Skipping server ping.");
    return;
  }

  const parsedUrl = new URL (baseUrl);
  const protocol = parsedUrl.protocol === "https:" ? https : http;
  const target = `${baseUrl}/api/v2/ping`;

  console.log(`Pinging server at: ${target}`);

  protocol
    .get(target, (res) => {
      console.log(`Ping status: ${res.statusCode}`);
      if (res.statusCode === 200) {
        console.log("✅ Server pinged successfully");
      } else {
        console.error(`❌ Failed to ping server. Status code: ${res.statusCode}`);
      }
    })
    .on("error", (err) => {
      console.error("❌ Error pinging server:", err.message, JSON.stringify(err));
    });
};

// Ping the server every 10 minutes
setInterval(pingServer, 10 * 60 * 1000);

module.exports = pingServer;


// const http = require("http");
// const https = require("https");

// const BASE_URL = process.env.BASEURL || process.env.RENDER;

// function pingServer() {
//   if (!BASE_URL) return console.error("BASEURL not defined.");

//   const protocol = BASE_URL.startsWith("https") ? https : http;
//   const target = `${BASE_URL}/api/v2/ping`;

//   protocol
//     .get(target, (res) => {
//       if (res.statusCode === 200) {
//         console.log(`[${new Date().toISOString()}] Ping successful ✅`);
//       } else {
//         console.log(`[${new Date().toISOString()}] Ping failed (${res.statusCode})`);
//       }
//     })
//     .on("error", (err) => {
//       console.error(`[${new Date().toISOString()}] Ping error:`, err.message);
//     });
// }

// // Ping every 10 minutes
// setInterval(pingServer, 10 * 60 * 1000);

// module.exports = pingServer;