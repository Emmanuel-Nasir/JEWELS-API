const express=require('express');
const bodyParser = require('body-parser');
const mongoDb = require('./db/connect');
const app =express();

const port = process.env.PORT || 3001;

app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Headers',
         'Origin, X-Requested-With, Content-Type, Accept, Z-key');
    res.setHeader('Access-Control-Allow-Methods',
         'GET, POST, PATCH, PUT, DELETE, OPTIONS');
    next();

})

//jewels routes
app.use('/',require('./routes'));

//connect to database before starting the server
mongoDb.initDb((err) => {
    if (err) {
        console.error(err);
    } else {
                   app.listen(port, () => {console.log(`Database is listening and node Running on port ${port}`)})

    }
});

    
