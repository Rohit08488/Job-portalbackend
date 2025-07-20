const { MongoClient } = require("mongodb");
const url =  process.env.MONGO_URI;
const client = new MongoClient(url);

const dbName = "major";

async function main() {
  try {
    await client.connect();
    console.log("Connected successfully to server");
    const db = client.db(dbName); // Get the database
    return db; // Return the db object to be used elsewhere
  } catch (err) {
    console.error("Error connecting to the database:", err);
    throw err;
  }
}

module.exports = { main }; // Export the main function
