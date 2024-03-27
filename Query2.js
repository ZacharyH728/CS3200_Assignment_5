const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();

const url = process.env.DATABASE_URL;
const client = new MongoClient(url);

client.connect().then(() => {
    const tweets = client.db("CS3200_Assignment_5").collection("tweets");
    tweets.find({}, { projection: { 'user.screen_name': 1, _id: 0 } }).sort({ 'user.followers_count': 1 }).limit(10).toArray().then(results => {
        results.map(result => {
            console.log(result.user.screen_name)
        })
        client.close();
    })
});



