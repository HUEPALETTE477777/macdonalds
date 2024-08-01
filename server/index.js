const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

const PORT = 4000;
const app = express();

// Middleware to handle CORS
app.use(cors());

// Middleware to parse req body
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@macdonalds-cluster.yl0dnpo.mongodb.net/?retryWrites=true&w=majority&appName=macdonalds-cluster`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
  },
});

async function run() {
  try {
    await client.connect();

    // DATABASE COLLECTIONS
    const menuCollection = client.db('macdonalds-client').collection('menu-items');
    const cartCollection = client.db('macdonalds-client').collection('cart-items');
    const ordersCollection = client.db('macdonalds-client').collection('orders');

    //MENU ITEM OPERATIONS
    app.get('/menu', async (req, res) => {
      try {
        const result = await menuCollection.find().toArray();
        res.send(result);
      } catch (error) {
        console.error('Failed to fetch menu items:', error);
        res.status(500).send({ message: 'Failed to fetch menu items', error });
      }
    });

    app.get('/menu/:id', async (req, res) => {
      try {
        const id = req.params.id
        const filter = { _id: id }
        const result = await menuCollection.findOne(filter);
        res.send(result)
      } catch (error) {
        console.error('Failed to find the item from menu:', error);
        res.status(500).send({ message: 'Failed to find the item from menu', error });
      }
    });

    //CART ITEM OPERATIONS
    app.get("/cart", async (req, res) => {
      try {
        const email = req.query.email;
        const filter = { email: email };
        const result = await cartCollection.find(filter).toArray();
        res.send(result);
      } catch (error) {
        console.error("Failed to get item to cart: ", error);
        res.status(500).send({ message: 'Failed to get item to cart', error });
      }
    });

    app.get('/cart/:id', async (req, res) => {
      try {
        const id = req.params.id;
        const filter = { _id: new ObjectId(id) };
        const result = await cartCollection.findOne(filter);
        res.send(result);
      } catch (error) {
        console.error('Failed to find the item from cart:', error);
        res.status(500).send({ message: 'Failed to find the item from cart:', error });
      }
    });

    app.post('/cart', async (req, res) => {
      try {
        const cartItem = req.body;
        const result = await cartCollection.insertOne(cartItem);
        res.send(result);
      } catch (error) {
        console.error('Failed to add item to cart:', error);
        res.status(500).send({ message: 'Failed to add item to cart', error });
      }
    });

    app.delete('/cart/:id', async (req, res) => {
      try {
        const id = req.params.id;
        const filter = { _id: new ObjectId(id) };
        const result = await cartCollection.deleteOne(filter);
        res.send(result);
      } catch (error) {
        console.error('Failed to delete item from cart:', error);
        res.status(500).send({ message: 'Failed to delete item from cart', error });
      }
    });

    app.put('/cart/:id', async (req, res) => {
      try {
        const id = req.params.id;
        const filter = { _id: new ObjectId(id) };
        const { quantity } = req.body;
        const options = { upsert: true };
        const updateDoc = {
          $set: {
            quantity: parseInt(quantity, 10)
          },
        };

        const result = await cartCollection.updateOne(filter, updateDoc, options);
        if (result.modifiedCount === 1) {
          res.status(200).send({ message: 'Quantity updated successfully' });
        } else {
          res.status(400).send({ message: 'Failed to update quantity' });
        }
      } catch (error) {
        console.error('Failed to update item quantity in cart:', error);
        res.status(500).send({ message: 'Failed to update item quantity in cart', error });
      }
    });

    // ALL CHECKOUT OPERATIONS
    app.post('/checkout', async (req, res) => {
      const { email, firstName, lastName, streetAddress, apartment, state, country, zipCode, townCity, SSN, creditCardNumber } = req.body;
      try {
          const cartItems = await cartCollection.find({ email: email }).toArray();
          
          if (cartItems.length === 0) { return res.status(400).send({ message: 'No items in the cart' }); }

          const order = {
              email: email,
              firstName: firstName,
              lastName: lastName,
              streetAddress: streetAddress,
              apartment: apartment,
              state: state,
              country: country,
              zipCode: zipCode,
              townCity: townCity,
              SSN: SSN,
              creditCardNumber: creditCardNumber,
              items: cartItems,
          };
          const result = await ordersCollection.insertOne(order);
          const deleteResult = await cartCollection.deleteMany({ email: email });

          res.status(200).send({ message: 'Order placed successfully', result, deleteResult });
      } catch (error) {
          console.error('Failed to place order:', error);
          res.status(500).send({ message: 'Failed to place order', error });
      }
  });
  
    await client.db('admin').command({ ping: 1 });
    console.log('Pinged your deployment. You successfully connected to MongoDB!');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
}
run().catch(console.dir);

// Default route
app.get('/', (req, res) => {
  res.send('GOKU BLACK');
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
