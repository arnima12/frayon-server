const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
const jwt = require('jsonwebtoken');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.mwroqof.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
//middle wars
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('frayon server is running')
})


async function run() {
  try {
    const productsCollection = client.db('frayon').collection('products');
    const reviewsCollection = client.db('frayon').collection('reviews');
    const usersCollection = client.db('frayon').collection('users');
    const cartCollection = client.db('frayon').collection('cart');
    const orderCollection = client.db('frayon').collection('order');
    
    
    app.get('/products', async (req, res) => {
      const query = {};
      const cursor = productsCollection.find(query);
      const products = await cursor.toArray();
      res.send(products);
    })
    app.get('/reviews', async (req, res) => {
      const query = {};
      const cursor = reviewsCollection.find(query);
      const reviews = await cursor.toArray();
      res.send(reviews);
    })
    app.get('/users', async (req, res) => {
      const query = {};
      const users = await usersCollection.find(query).toArray();
      res.send(users);
    })
    app.get('/cart', async (req, res) => {
      const email = req.query.email;
      const query = { email: email }
      const cart = await cartCollection.find(query).toArray();
      res.send(cart);
    })
    app.get('/order', async (req, res) => {
      const email = req.query.email;
      const query = { email: email }
      const order = await orderCollection.find(query).toArray();
      res.send(order);
    })
    app.get('/order/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const order = await orderCollection.findOne(query);
      res.send(booking);
  })
    app.get('/users/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new  ObjectId(id) };
      const result = await usersCollection.findOne(query);
      res.send(result);
  })
  app.get('/jwt', async (req, res) => {
    const email = req.query.email;
    const query = { email: email };
    const user = await usersCollection.findOne(query);
    if (user) {
        const token = jwt.sign({ email }, process.env.ACCESS_TOKEN, { expiresIn: '1h' })
        return res.send({ accessToken: token });
    }
    res.status(403).send({ accessToken: '' })
});
    app.get('/users/admin/:email', async (req, res) => {
      const email = req.params.email;
      const query = { email }
      const user = await usersCollection.findOne(query)
      res.send({ isAdmin: user?.role === 'admin' })
      console.log(user)
    })
    app.post('/users', async (req, res) => {
      const user = req.body;
      console.log(user);
      const result = await usersCollection.insertOne(user);
      res.send(result);
    })
    app.post('/cart', async (req, res) => {
      const cart = req.body;
      console.log(cart);
      const result = await cartCollection.insertOne(cart);
      res.send(result);
    })
    app.post('/order', async (req, res) => {
      const order = req.body;
      console.log(order);
      const result = await orderCollection.insertOne(order);
      res.send(result);
    })
    
    app.put('/users/admin/:id',async (req, res) => {

      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedDoc = {
        $set: {
          role: 'admin'
        },
      };
      const result = await usersCollection.updateOne(filter, updatedDoc, options);
      res.send(result)
      console.log("result", result);
    })
    app.delete('/cart/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await cartCollection.deleteOne(query);
      console.log("result", result);
      res.send(result);
      // console.log('trying to delete', id);
    })
    app.delete('/users/admin/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await usersCollection.deleteOne(query);
      console.log("result", result);
      res.send(result);

    })
  }
  finally {

  }
}
run().catch(err => console.log(err));
app.listen(port, () => {
  console.log(`Frayon server is running on ${port}`);
})