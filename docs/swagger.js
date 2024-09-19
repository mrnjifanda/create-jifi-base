const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./collections.json');

const options = {
  definition: {
    openapi: "3.1.0",
    info: {
      title: "API BASE",
      version: "1.0.0",
      description: "API de base pour la gestion de l'authentification et des logs.",
      license: {
        name: "MIT",
        url: "https://spdx.org/licenses/MIT.html",
      },
      contact: {
        name: "Mr NJIFANDA",
        url: "https://njifanda.com",
        email: "contact@njifanda.com",
      },
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
  },
  apis: ["./routes/*.route.js"],
};

const specs = swaggerJsdoc(options);

module.exports = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, specs, { explorer: true }));
}