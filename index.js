const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');

require('dotenv').config();
const cors = require('cors');
const app = express();

const port = process.env.PORT || 5000;

// middleware
app.use(cors(
  {
    origin: ["http://localhost:5173", ""],
    credentials: true,
  }
));
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.z8prdbu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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

    const touristSpotCollection = client.db('touristSpotDB').collection('touristSpot');
    const userCollection = client.db('touristSpotDB').collection('user');


    app.get('/addSpot', async (req, res) => {
      const cursor = touristSpotCollection.find();
      const result = await cursor.toArray();
      res.send(result)


    })


    app.post('/addSpot', async (req, res) => {
      const newSpotAdd = req.body;
      console.log(newSpotAdd);
      const result = await touristSpotCollection.insertOne(newSpotAdd);
      res.send(result);
    })

    // user related api

    app.get('/user', async (req, res) => {
      const cursor = userCollection.find();
      const user = await cursor.toArray();
      res.send(user);
    })

    app.post('/user', async (req, res) => {
      const user = req.body;
      console.log(user);
      const result = await userCollection.insertOne(user);
      res.send(result);
    });

    // API endpoints
    app.post('/addSpot', (req, res) => {
      const newItem = new Item({
        userId: req.user._id,
        name: req.body.name,
        description: req.body.description
      });

      newItem.save((err, item) => {
        if (err) {
          res.status(500).send(err);
        } else {
          res.status(201).send(item);
        }
      });
    });

    

    app.get('/addSpot-email/:userEmail', async(req, res) => {
      const userEmail = req.params.userEmail;
      const cursor = touristSpotCollection.find({userEmail});
      const user = await cursor.toArray();
      res.send(user);
    })

    app.get('/addSpot/:id', async(req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await touristSpotCollection.findOne(query);
      res.send(result);

    })
   

    app.put('/addSpot/:id', async(req, res) => {
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)}
      const options = {upsert: true};
      const updatedSpot = req.body;
      const spot = {
        $set: {
          countryName:updatedSpot.countryName, 
          spotName:updatedSpot.spotName, 
          image:updatedSpot.image, 
          location:updatedSpot.location, 
          shortDescription:updatedSpot.shortDescription, 
          averageCost:updatedSpot.averageCost, 
          seasonality: updatedSpot.seasonality,
          travelTime: updatedSpot.travelTime,
          visitors: updatedSpot.visitors,
        }
      }

      const result = await touristSpotCollection.updateOne(filter, spot, options)
      res.send(result);
    })

    app.delete('/addSpot/:id', async(req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await touristSpotCollection.deleteOne(query);
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










// middleware
app.use(cors());

app.use(express.json());

app.get('/', (req, res) => {
  res.send('tourism managment server is runnig ')


})

app.listen(port, () => {
  console.log(`tourism managment is running: ${port}`);
})