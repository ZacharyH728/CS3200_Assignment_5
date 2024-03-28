const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();

const url = process.env.DATABASE_URL;
const client = new MongoClient(url);

async function main() {
    try {
        await client.connect();
        const tweets = client.db("ieeevisTweets").collection("tweet");
        const users = client.db("ieeevisTweets").collection("user");
        const onlyTweets = client.db("ieeevisTweets").collection("Tweets_Only");

        const distinctValues = await tweets.distinct('user.id')

        for (let value of distinctValues) {
            const user = await tweets.findOne({ 'user.id': value });
            await users.insertOne(user.user);
        }

        await onlyTweets.insertMany(await tweets.find({}).toArray())
        const results = await onlyTweets.find({}).toArray();
        for (let tweet of results) {
            var userId = tweet.user.id;

            await onlyTweets.updateOne({ _id: tweet._id }, { $set: { 'user': userId } });
        }

    } finally {
        client.close();
    }
}

main();