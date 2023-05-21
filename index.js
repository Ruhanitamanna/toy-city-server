const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT ||5000;


// Middleware

app.use(cors());
app.use(express.json());

app.get('/',(req,res)=>{
    res.send('TOY CITY IS RUNNING')
});




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lruiqni.mongodb.net/?retryWrites=true&w=majority`;


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


    const toysCollection = client.db('toyCity').collection('toys');
    const bookedToysCollection = client.db('toyCity').collection('bookedToys');

    app.get('/toys',async(req,res)=>{
        const cursor = toysCollection.find();
        const result = await cursor.toArray();
        res.send(result);
    }) 


    app.get('/toys/:id', async(req,res)=>{
        const id = req.params.id;
        const query = {_id: new ObjectId(id)};
        console.log('id:', id);
        console.log('_id:', ObjectId);
        const result = await toysCollection.findOne(query);
        res.send(result)
    })

    // booked toys

   

    app.get('/bookedToys', async(req,res)=>{
        console.log(req.query.email);
        let query ={};
        if (req.query?.email){
            query = {email:req.query.email}
        }
        const result = await bookedToysCollection.find().toArray();
        res.send(result);

    });

    app.patch('/bookedToys/:id', async (req,res)=>{
      const updateBookedToys = req.body;
    })

    app.delete('/bookedToys/:id', async(req,res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await bookedToysCollection.deleteOne(query)
      res.send(result)

    })

    app.post('/bookedToys', async (req,res)=>{const booked = req.body;
    console.log(booked)
    const result = await bookedToysCollection.insertOne(booked);
    res.send(result);

})



    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.listen(port,()=>{
    console.log(`Toy city is running on port, ${port}`)
})
