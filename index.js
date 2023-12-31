const express = require("express");
const app = express();
const cors = require("cors");
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;
//  middleware

app.use(cors())
app.use(express.json())

app.get("/", (req, res) => {
  res.send("Toys")
})





const uri = `mongodb+srv://${process.env.DB_DataBase}:${process.env.DB_PASS}@cluster0.loltiyt.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    // Send a ping to confirm a successful connection
    const database = client.db("toyfriends");
    const toysCollection = database.collection("toys");


    app.get("/toys", async (req, res) => {

      const getData = toysCollection.find().limit(20);
      const result = await getData.toArray()
      res.send(result)

    })

    // find single data 

    app.get("/toy/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await toysCollection.findOne(query);
      res.send(result)

    })


    // find match email data 

    app.get("/mytoys", async (req, res) => {
      let query = {};
      if (req.query?.email) {
        console.log(query)
        query = { email: req.query.email };
      }
      console.log(query)
      const result = await toysCollection.find(query).toArray();
      res.send(result)

    })

    // update data 

    app.patch("/update/:id", async (req, res) => {
      const id = req.params.id;
      const data = req.body;
      const filter = { _id: new ObjectId(id) };
      const option = { upsert: true };
      const updateDos = {
        $set: {
          ...data
        }
      }
      const result = await toysCollection.updateOne(filter, updateDos)
      res.send(result)
    })


    // add toy 

    app.post("/addtoy", async (req, res) => {
      const data = req.body;
      const result = await toysCollection.insertOne(data);
      res.send(result)
    })


    // delete toy 

    app.delete("/del/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await toysCollection.deleteOne(query);
      res.send(result)
    })

    // search data 
    app.get("/search/:text", async (req, res) => {
      const text = req.params.text;
      console.log(text)

      // const query = { name: text }
      const result = await toysCollection.find(
        { name: { $regex: text, $options: "i" } }).toArray();
      res.send(result)
    })


    // low price api

    app.get("/low", async (req, res) => {

      const query = {}
   
      const result = await toysCollection.find().sort({price:1}).toArray()
      res.send(result)
    })
// high price 

app.get("/high", async (req, res) => {

  const query = {}

  const result = await toysCollection.find().sort({price:-1}).toArray()
  res.send(result)
})


    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {

  }
}
run().catch(console.dir);



app.listen(port, () => {
  console.log("server Running")
})