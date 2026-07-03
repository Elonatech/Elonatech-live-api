const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Elonatech API",
      version: "1.0.0",
      description: "API documentation for Elonatech Nigeria Limited backend",
    },
    servers: [
      {
        url: "http://localhost:8000",
        description: "Development server",
      },
      {
        url: "https://elonatech-live-api.onrender.com",
        description: "Production server",
      },
    ],
    // Defines reusable security scheme — JWT token sent via x-access-token header
    components: {
      securitySchemes: {
        TokenAuth: {
          type: "apiKey",
          in: "header",
          name: "x-access-token",
          description: "JWT access token from login response",
        },
      },
    },
  },
  // Tell swagger-jsdoc where to find your route files to read the comments
  apis: ["./routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;