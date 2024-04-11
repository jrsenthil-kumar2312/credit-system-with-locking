/**
 * Swagger definition configuration file
 *
 *
 */
/* eslint max-len: ["error", { "ignoreComments": true, "ignoreStrings": true }] */
import swaggerJSDoc from 'swagger-jsdoc';

/**
 * @constant {object} swaggerDefinition - OpenAPI specification details
 */
const swaggerDefinition = {
  openapi: '3.0.3',
  info: {
    title: 'Credit System API',
    version: '1.0.0',
    description: 'Credit System API',
    contact: {
      name: 'Senthil Kumar',
    },
  },
  components: {
    securitySchemes: {
      Authorization: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        value: 'Bearer <JWT token here>',
      },
    },
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Development server',
    },
  ],
};

/**
 * @constant {object} options - object holding swaggerDefintion and apis paths required for JSDoc parsing
 */
const options = {
  definition: swaggerDefinition,
  // Paths to files containing OpenAPI definitions
  apis: ['src/routes/**/*.route.js'],
};

/**
 * @constant {object} swaggerSpec - swaggerJSDoc parsed specifications
 */
const swaggerSpec = swaggerJSDoc(options);

export {
  swaggerSpec,
};
