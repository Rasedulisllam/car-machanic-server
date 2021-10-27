const express =require('express')
const { MongoClient,ObjectId} = require('mongodb');
require('dotenv').config();
const cors=require('cors');
const app=express();
const port=process.env.PORT || 5000;

app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.hfrdj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

app.get('/',(req,res)=>{
    res.send('server connecting')
})

async function run(){
    try{
        await client.connect();
        const database=client.db('carMachanic');
        const carServices=database.collection('carServices');

        // post services data
        app.post('/addService', async (req,res)=>{
            const service=req.body;
            const result=await carServices.insertOne(service);
            res.json(result)
        })

        // get all services data
        app.get('/services',async(req,res)=>{
            const cursor= carServices.find({});
            const result = await cursor.toArray();
            res.json(result)
        })

        // get a single service data
        app.get('/services/:id', async(req,res)=>{
            const id=req.params.id;
            const query={_id:ObjectId(id)}
            const result= await carServices.findOne(query);
            res.json(result)
        })

        // update a single service data 
        app.put('/services/:id', async (req,res)=>{
            const id=req.params.id;
            const service=req.body;
            const query={_id:ObjectId(id)};
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                  name:service.name,
                  price:service.price,
                  image:service.image,
                  time:service.time,
                  details:service.details,
                },
              };
            const result = await carServices.updateOne(query,updateDoc,options);
            res.json(result);
        })

        // delete a service of database
        app.delete('/services/:id', async(req,res)=>{
            const id=req.params.id;
            const query={_id:ObjectId(id)}
            const result = await carServices.deleteOne(query);
            res.json(result)
        })
    }
    finally{
        // await client.close();
    }
}
run().catch(console.dir)

app.listen(port,()=>{
    console.log('server raning port:', port)
})