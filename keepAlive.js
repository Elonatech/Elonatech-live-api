const http = require("http");
const https = require("https");
const url = require("url");

const baseUrl = process.env.BASEURL || `http://localhost:8000`;

const pingServer = () => {
  if (!baseUrl) {
    console.error("BASEURL is not defined. Skipping server ping.");
    return;
  }

  const parsedUrl = url.parse(baseUrl);
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