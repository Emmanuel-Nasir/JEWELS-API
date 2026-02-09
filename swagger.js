const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info: {
        title: 'Jewels Api',
        description: 'Jewels Api'
    },
    host: "https://jewels-api.onrender.com/",
    schemes: ['https']
};
const outputFile ='./swagger.json';
const endpointsFIles = ['./routes/index.js'];


// this will generate swagger.json
swaggerAutogen(outputFile, endpointsFIles, doc);