import express from "express";
import cors from "cors";
/* const { MongoClient, ServerApiVersion } = require("mongodb"); */
import { MongoClient, ObjectId, ServerApiVersion } from "mongodb";

import admin from "firebase-admin";
import jwt from "jsonwebtoken"
const secret = "UYIK8Agweffbtg213TFF6tu95ghG0TDRDYIUYFDRujhoRTUutd";
const  serviceAccount ="./smartDealToken.json";


admin.initializeApp({

  credential: admin.credential.cert(serviceAccount)

});

const app = express();
//middleware
app.use(cors());
app.use(express.json());
/* const logger = (req, res, next) => {
  console.log("info");
  next();
}; */

const fireBaseToken = async (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(401).json({status:false,message:"unauthorize token"})
  }
  const token = req.headers.authorization.split(" ")[1]
 if (!token) {
    return res
      .status(401)
      .send({ status: false, message: "unauthorize token" });
 }

 try {
 const userInfo = await admin.auth().verifyIdToken(token);

      req.encodeToken=userInfo.email
    
    next();
 } catch (error) {
   return res.status(401).send({ status: false, message: "unauthorize token" });
 }

};


const rowMadedJwtToken=(req,res,next)=>{
/* console.log(req.headers) */
const authorization = req.headers.authorization;
if (!authorization) {
  return res.status(400).json({message:"unauthorized",status:false})
  
}
const token=authorization.split(" ")[1]
if (!token) {
    return res.status(400).json({ message: "unauthorized", status: false });
}

jwt.verify(token,secret,(err,decoded)=>{

  if (err) {
      return res.status(400).json({ message: "unauthorized", status: false });
  }

  console.log("after decoded",decoded)
  req.token_email =  decoded.email
  next()
})
}
const uri =
  "mongodb+srv://simpleDbUser:vwVQUHe35oGdvGg1@cluster0.dnjrxcz.mongodb.net/?appName=Cluster0";




// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();
    const db = client.db("smartDb");
    const productCollection = db.collection("products");
    const bidsCollection = db.collection("bids");
    const usersCollection = db.collection("users");
//jwt related api
app.post("/getToken", (req,res)=>{
  const loggedUser=req.body
  console.log(loggedUser)
  const token =jwt.sign( loggedUser , secret,
    { expiresIn: "30d" }
  );
  res.json({ token :token});
})











    //userscollation
    app.post("/users", async (req, res) => {
      const newUser = req.body;
      const email = newUser.email;
      const exisingUser = await usersCollection.findOne({ email: email });
      if (exisingUser) {
        return res
          .status(400)
          .json({ status: false, message: "Already Have User" });
      }
      const result = await usersCollection.insertOne(newUser);
      res.send(result);
    });

    //product
    app.get("/latestProduct", async (req, res) => {
      const cursor = productCollection.find().sort({ created_at: -1 }).limit(6);
      const result = await cursor.toArray();
      res.send(result);
    });

    app.post("/product", async (req, res) => {
      const newProduct = req.body;
      const result = await productCollection.insertOne(newProduct);
      res.send(result);
    });
    app.get("/product", async (req, res) => {
      /* const projectFields = { _id: 0, title: 1 };
 const cursor = productCollection.find().sort({price_min:-1}).skip(1).limit(3).project(projectFields); */
      /*  console.log(req.query.email) */
      const email = req.query.email;
      const query = {};
      if (email) {
        query.email = email;
      }

      const cursor = productCollection.find(query);
      const result = await cursor.toArray();

      res.send(result);
    });

    app.put("/product/:id", async (req, res) => {
      const id = req.params.id;
      const updateProduct = req.body;
      const query = { _id: new ObjectId(id) };
      const update = {
        $set: {
          name: updateProduct.name,
          price: updateProduct.price,
        },
      };
      const result = await productCollection.updateOne(query, update, {});
      res.send(result);
    });

    app.delete("/product/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await productCollection.deleteOne(query);

      res.send(result);
    });

    //single product get
    app.get("/product/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await productCollection.findOne(query);

      res.send(result);
    });

    //bits related api

   /*  app.get("/bids", fireBaseToken, async (req, res) => {
     const encodedEmailToken=req.encodeToken
      const email = req.query.email;
      const query = {};

      if (email) {
        if (email !== encodedEmailToken) {
          return res.status(401).send({message:"please use your valid email",status:false})
        }
        query.buyer_email = email;
      }

      const cursor = bidsCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    }); */


       app.get("/bids", rowMadedJwtToken, async (req, res) => {
       const token_email = req.token_email;
       
         const email = req.query.email;
         const query = {};

         if (email) {
           if (email !== token_email) {
             return res
               .status(401)
               .send({ message: "please use your valid email", status: false });
           }
           query.buyer_email = email;
         }

         const cursor = bidsCollection.find(query);
         const result = await cursor.toArray();
         res.send(result);
       });
    //bitsby product id
    app.get("/bids/:productId",fireBaseToken, async (req, res) => {
      const productId = req.params.productId;

      const query = { product: productId };

      const cursor = bidsCollection.find(query).sort({ bid_price: -1 });
      const result = await cursor.toArray();
      res.send(result);
    });

    //post bid
    app.post("/bids", async (req, res) => {
      const newBid = req.body;

      const result = await bidsCollection.insertOne(newBid);
      res.send(result);
    });

    app.put("/bids/:id", async (req, res) => {
      const bidId = req.params.id;
      const newBid = req.body;
      const query = { _id: new ObjectId(bidId) };
      const updateDoc = {
        $set: {
          status: newBid.status,
        },
      };
      const result = await bidsCollection.updateOne(query, updateDoc);
      res.send(result);
    });

    //delete bid
    app.delete("/bids/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await bidsCollection.deleteOne(query);
      console.log(typeof bidsCollection._id);
      res.send(result);
    });

    await client.db("admin").command({ ping: 1 });

    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    /*  await client.close(); */
  }
}
run().catch(console.dir);

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log(`server running on  ${PORT} port`);
});
