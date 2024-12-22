const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;

const { MongoClient, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.3tcc9mo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri);

// middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
client.connect();

const menuCollection = client.db("bistroWebsiteDb").collection("bistromenu");
const reviewsCollection = client.db("bistroWebsiteDb").collection("bistroReviews");
const cartsCollection = client.db("bistroWebsiteDb").collection("carts");

// GET carts
app.get('/carts', async (req, res) => {
  const email = req.query.email;
  const query = { email: email };
  const result = await cartsCollection.find(query).toArray();
  res.send(result);
});

// DELETE cart item
app.delete('/carts/:id', async (req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id) };
  const result = await cartsCollection.deleteOne(query);
  res.send(result);
});

// POST cart item
app.post('/carts', async (req, res) => {
  const cartItem = req.body;
  const result = await cartsCollection.insertOne(cartItem);
  res.send(result);
});

// GET menu
app.get('/menu', async (req, res) => {
  const result = await menuCollection.find().toArray();
  res.send(result);
});

// GET reviews
app.get('/reviews', async (req, res) => {
  const result = await reviewsCollection.find().toArray();
  res.send(result);
});

// Root route
app.get('/', (req, res) => {
  res.send('Server is running');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
