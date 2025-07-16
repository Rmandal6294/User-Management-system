const {MongoClient} = require('mongodb');

const url = "mongodb://localhost:27017";
const dbName = "MongoDatabase";

let client;
let db;
const createDatabase = async () => {
  try {
    client = new MongoClient(url);

    await client.connect();
    db = client.db(dbName);

    console.log("✅ DataBase Created! / Connected");

    await db.createCollection("records");
    console.log("📖 Collections created !");

    return db;
    
  } catch (error) {
    console.log("❌ Error! ", error);
    throw err;
  }
};

const getDB = () =>{
    if(!db) {
        throw new Error ('⛓️‍💥 Database not connected ⛓️‍💥');
    }
    return db;
}

const closeDB = async () =>{
    if(client){
        await client.close();
        console.log(" ❌ Connections is closed!");
        client = null;
        db = null;
    }
}

module.exports = {
    createDatabase,
    getDB,
    closeDB
};

