const { MongoClient } = require("mongodb");

// Substitua pelo seu URI do MongoDB Atlas
const uri = "mongodb+srv://ToneShare:toneshare96124805@toneshare.jidmmxx.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri);

async function connectDB() {
  try {
    await client.connect();
    console.log("Conectado ao MongoDB 🚀");
    return client.db("ToneShareDB"); // Nome do seu banco
  } catch (err) {
    console.error("Erro ao conectar ao MongoDB:", err);
  }
}

module.exports = connectDB;