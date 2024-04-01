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
            try {
                await users.insertOne(user.user);
            } catch (err) {
                console.log("A user with that id already exists");
            }

        }

        try {
            await onlyTweets.insertMany(await tweets.find({}).toArray())
        } catch (err) {
            console.log("The tweet(s) with that id already exists")
        }

        const results = await onlyTweets.find({}).toArray();
        try {
            for (let tweet of results) {
                var userId = tweet.user.id;
                await onlyTweets.updateOne({ _id: tweet._id }, { $set: { 'user': userId } });
            }
        } catch (err) {
        }

    } finally {
        client.close();
    }
}

//add try catch

main();