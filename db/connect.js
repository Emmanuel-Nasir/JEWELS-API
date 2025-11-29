const {MongoClient} = require('mongodb');
require('dotenv').config();

let database;

const initDb=async(callback)=>{
    if(database){
        console.log('Database is already initialized!');
        return callback(null,database);
    }
    MongoClient.connect(process.env.MONGODB_URL)
    .then((client)=>{
        database = client.db(process.env.DB_NAME || "jewelsDb");
        console.log("MongoDB connected");
        callback(null,database);
    })
    .catch((err) => {
        console.log('DB connection failed:',err);
        callback(err);
    });
};
const getDb=()=>{
    if(!database){
        throw new Error('Database not initialized!');
    }
    return database;
};

module.exports={initDb,getDb};