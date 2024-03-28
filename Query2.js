const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();

const url = process.env.DATABASE_URL;
const client = new MongoClient(url);

client.connect().then(() => {
    const tweets = client.db("CS3200_Assignment_5").collection("tweets");
    tweets.aggregate([
        {
            $group: {
                _id: "$user.id",
                followers_count: { $addToSet: "$user.followers_count" },
                screen_name: { $addToSet: "$user.screen_name" }
            }
        }
    ])
        .sort({ followers_count: -1 })
        .limit(10)
        .toArray()
        .then(results => {
            results.map(result => {
                console.log(result.screen_name[0], result.followers_count.sort((a, b) => { return b - a })[0]);
            })
            client.close();
        });
})
