// controller/ping.js
const KeepRenderApiAlive = (req, res) => {
  const response = {
    message: "Server pinged successfully",
    timestamp: new Date().toISOString(),
  };

  console.log("Ping received:", JSON.stringify(response, null, 2));
  return res.status(200).json(response);
};

module.exports = { KeepRenderApiAlive };