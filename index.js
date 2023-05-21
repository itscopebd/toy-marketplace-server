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
  res.send("Rofiq")
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
    await client.connect();
    // Send a ping to confirm a successful connection
    const database = client.db("toyfriends");
    const toysCollection = database.collection("toys");

    const catCollection = database.collection("category");
    const subCatCollection = database.collection("subCategory");

    app.get("/toys", async (req, res) => {

      const result = await toysCollection.find().toArray();
      res.send(result)

    })

    // find single data 

    app.get("/toy/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };

      const result = await toysCollection.findOne(query);
      res.send(result)
    })



    // app.get("/main-cat", async (req, res) => {
    //   const result = await catCollection.find().toArray()
    //   res.send(result)
    // })

    // app.get("/sub-cat", async (req, res) => {
    //   const result = await subCatCollection.find().toArray()
    //   res.send(result)
    // })

    // app.get("/filterData/:id", async (req, res) => {

    //   const id = req.params.id;
    //   const filter = { catId: new ObjectId(id) }
    //   // console.log(filter)
    //   const option = {
    //     sort: {
    //       catId: id
    //     }
    //   }
    //   const result = await toysCollection.find(filter, option).toArray();
    //   res.send(result)

    // })


    // add toy 

    app.post("/addtoy", async (req, res) => {
      const data = req.body;
      const result = await toysCollection.insertOne(data);
      res.send(result)
    })


    // delete toy 

    app.delete("/delete/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      console.log(query)
    })


    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {

  }
}
run().catch(console.dir);










app.listen(port, () => {
  console.log("server Running")
})