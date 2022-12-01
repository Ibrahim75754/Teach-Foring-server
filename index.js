const express = require('express')
const app = express()
const cors = require('cors');
require('dotenv').config();
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bvhfe.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        console.log("database connected");
        const database = client.db('tech-foring-job-portal');
        const categoriesCollection = database.collection('categories');
        const jobsCollection = database.collection('jobs');


        // insert one Category...............
        app.post('/categories', async (req, res) => {
            const category = req.body;
            const result = await categoriesCollection.insertOne(category);
            res.json(result);
        });

        //get all Categories..............
        app.get('/categories', async (req, res) => {
            const cursor = categoriesCollection.find({});
            const result = await cursor.toArray();
            res.json(result);
        });

        // insert one Job...............
        app.post('/jobs', async (req, res) => {
            const job = req.body;
            const result = await jobsCollection.insertOne(job);
            res.json(result);
        });
        //get all Jobs..............
        app.get('/jobs', async (req, res) => {
            const cursor = jobsCollection.find({});
            const result = await cursor.toArray();
            res.json(result);
        });
        //delete one Job..............
        app.delete('/jobs/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await jobsCollection.deleteOne(query);
            res.json(result);
        });

        //get one Job...............
        app.get('/jobs/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const job = await jobsCollection.findOne(query);
            res.json(job);
        });
        //update job.................
        app.put('/jobs/edit/:id', async (req, res) => {

            const id = req.params.id;
            const updateJob = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    jobName: updateJob.jobName,
                },
            };
            const result = await jobsCollection.updateOne(filter, updateDoc, options);
            res.json(result);
        });


    }
    finally {
        // await client.close();
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Tech Foring Job Portal Server Running !')
})

app.listen(port, () => {
    console.log(`listening at ${port}`)
})