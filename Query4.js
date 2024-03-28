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
                sum: { $sum: "$retweet_count" }
            }
        },
        {
            $sort: {
                sum: -1
            }
        },
        // {
        //     $limit: 10
        // }
    ])
        .toArray()
        .then(results => {
            let count = 0;
            results.map(result => {
                count += result.sum
                // console.log(result);
            })
            const average = parseFloat((count / results.length).toFixed(2))
            tweets.aggregate([
                {
                    $group: {
                        _id: "$user.screen_name",
                        retweet_count: { $sum: "$retweet_count" }
                    }
                },
                {
                    $match: {
                        retweet_count: { $gt: average + 3 }
                    }
                },
                {
                    $sort: {
                        retweet_count: -1
                    }
                },
                {
                    $limit: 10
                }
            ]).toArray().then(results => {
                results.map(result => {
                    console.log(result._id, result.retweet_count);
                })
                client.close();
            })
        })
});



