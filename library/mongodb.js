const mongo = require('mongodb');
const mongoClient = mongo.MongoClient;

const connectionUrl = process.env.MONGODB_URL;

mongoClient.connect(connectionUrl, (err, client) => {
    if(!err) {
        console.log(client, 'connected');
    }

    const db = client.db(db_name);
    db.collection('users').insertOne({"name": "harshit", "age": 24});
});

