const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();

const url = process.env.DATABASE_URL;
const client = new MongoClient(url);

client.connect().then(() => {
    const tweets = client.db("CS3200_Assignment_5").collection("tweets");
    tweets.countDocuments({ retweet_count: 0, text: /RT/i }).then(count => {
        console.log(count);
        client.close();
    })
});



