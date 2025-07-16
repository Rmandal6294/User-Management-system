const express = require('express');
const path = require('path');
const fs = require('fs');
const { createDatabase, getDB, closeDB } = require('./database.js');

const app = express();
const PORT = 8000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/api/records', async (req, res) => {
    try {
        const db = getDB();
        const records = await db.collection("records").find({}).toArray();
        res.json({
            success: true,
            count: records.length,
            data: records,
        });
    } catch (error) {
        console.log('⚠️Error fetching records');
        res.status(500).json({ error: '⛓️‍💥 Failed to fetch' })
    }
});

app.post('/api/records', async (req, res) => {
    try {
        const db = getDB();
        console.log("req -> ", req.body);
        const value = await req.body;
        console.log(" jj->", value);
        if (!value || Object.keys(value).length === 0) {
            return res.status(400).json({ error: "Data should not be empty!" });
        }

        const newRecord = { ...value, createdAt: new Date(), _id: new Date().getTime() };
        console.log(" jjkk", newRecord);
        const result = await db.collection('records').insertOne(newRecord);
        res.status(201).json({
            success: true,
            message: "✅Record Inserted.",
            id: result.insertedId,
            records: newRecord
        })
    } catch (error) {
        console.log('⚠️ Error listening records', error);
        res.status(500).json({ error: '⛓️‍💥 Failed to listening' });
    }
});

app.delete('/api/records/:id', async(req, res)=>{
    try{

        const {id} = req.params;
        const db = getDB();
        
        const result = await db.collection('records').deleteOne({_id: Number(id)});

        if(result.deleteCount === 0){
            return res.status(404).json({
                success: false,
                error: "⚠️ Not found..."
            });
        }

        res.json({
            success: true,
            message: `✅ Recorded data deleted successfully.`,
            deleteCount: result.deleteCount
        })

    }catch (error) {
        console.log('⚠️ Error to deleting data', error);
        res.status(500).json({ error: '⛓️‍💥 Failed to deleting' });
    }
})

app.use((err, req, res, next) => {
    console.error("⛓️‍💥 Unhandled Error!", err);
    res.status(500).json({ error: 'API endpoint not found' });
    next();
})

const startServer = async () => {
    try {
        await createDatabase();

        app.listen(PORT, () => {
            console.log(`Applications Running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.log("❌ Failed to start.", error);
        process.exit(1);
    }
}

process.on('SIGINT', async () => {
    console.log("🔚 shutting down server.........");
    await closeDB();
    process.exit(0);
})

process.on('SIGTERM', async () => {
    console.log("🔚 shutting down server.........");
    await closeDB();
    process.exit(0);
})

startServer();