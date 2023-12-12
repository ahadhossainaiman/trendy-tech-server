const express = require("express");
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
require('dotenv').config()

const port = process.env.PORT || 5000;

// middleware
app.use(cors())
app.use(express.json())

// ahadaiman2

// 10GTjVm140uG6lGE

console.log(process.env.DB_USER);


app.get('/', (req, res) => {
  res.send('Trendy Tech Is running')
})



const uri = `mongodb+srv://${ process.env.DB_USER}:${ process.env.DB_PASSWORD}@trendy-tech.udal89b.mongodb.net/?retryWrites=true&w=majority`;

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
    await client.connect();
    const productsCollection = client.db('trendy-tech').collection('products');
    const userCollection = client.db('trendy-tech').collection('users');
    const reviewsCollection = client.db('trendy-tech').collection('reviews');


    app.post('/products',async(req,res)=>{
      const body = req.body;
      const product = {...body, creationDate: new Date().toISOString().split('T')[0],
      creationTime: new Date().toLocaleString("en-US",{
        hour:"numeric",
        minute:"numeric",
        hours12:true
      })}
      const result = await productsCollection.insertOne({...product,likes:[]}) 
      console.log(result);
      res.send(result);
    })
    
    app.post ('/users',async(req,res)=>{
      const users = req.body;
      console.log(users);
      const result = await userCollection.insertOne({...users,role:''});
      res.send(result);
    })
    app.post('/reviews',async(req,res)=>{
      const review = req.body;
      const result =  await reviewsCollection.insertOne({...review,creationDate: new Date().toISOString().split('T')[0],
      creationTime: new Date().toLocaleString("en-US",{
        hour:"numeric",
        minute:"numeric",
        hours12:true
      })});
      res.send(result)
    })
    
    app.get('/products',async(req,res)=>{
      const result = await productsCollection.find({}).toArray();
      res.send(result)
    })
    app.get('/reviews',async(req,res)=>{
      const reviews = await reviewsCollection.find({}).toArray();
      console.log(reviews);
      res.send(reviews)
    })

    // Connect the client to the server	(optional starting in v4.7)

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})