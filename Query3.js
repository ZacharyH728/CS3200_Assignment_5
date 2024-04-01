const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();

const url = process.env.DATABASE_URL;
const client = new MongoClient(url);

client.connect().then(() => {
    const tweets = client.db("ieeevisTweets").collection("tweet");
    tweets.aggregate([
        {
            $group: {
                _id: "$user.id",
                count: { $sum: 1 },
                screen_name: { $addToSet: "$user.screen_name" }
            }
        },
        {
            $sort: {
                count: -1
            }
        },
        {
            $limit: 1
        }
    ])
        .toArray()
        .then(results => {
            results.map(result => {
                console.log(result.screen_name[0], result.count);
            })
            client.close();
        })
});



