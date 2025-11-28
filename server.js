const express=require('express');
const app= express();
const mongoDb = require('./db/connect');
const jewelsRoutes = require('./routes/jewels');


app.use(express.json());

app.get('/',(req,res)=>{
    res.send('Jewels API is running!');
});
//jewels routes
app.use('/jewels',jewelsRoutes);

//connect to database before starting the server
mongoDb.initDb((err) => {
    if (err) {
        console.error(err);
    } else {
        app.listen(3000, () => console.log('Server running on port 3000'));
    }
});

    
