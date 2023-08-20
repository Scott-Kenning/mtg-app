const express = require('express');
const bodyParser = require('body-parser');
const db = require('./database');  // Assuming database.js is in the same directory
const cors = require('cors'); // Import CORS
require('dotenv').config();


const app = express();

app.use(cors()); // Use CORS

const PORT = 3000;

app.use(bodyParser.json());

// Route to fetch card info by card name
app.get('/card/:name', async (req, res) => {
    try {
        const cardName = req.params.name;
        const card = await db.oneOrNone('SELECT * FROM cards WHERE name = $1', [cardName]);

        if (card) {
            res.json(card);
        } else {
            res.status(404).json({ message: 'Card not found' });
        }
    } catch (error) {
        console.error(error);  // This will print the error to the server console
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

app.get('/search/:query', async (req, res) => {
    const { query } = req.params;
    const page = parseInt(req.query.page || '1');  // Default to the first page if not specified

    const limit = 20;  // Number of cards per page
    const offset = (page - 1) * limit;

    try {
        const cards = await db.any('SELECT * FROM cards WHERE name ILIKE $1 LIMIT $2 OFFSET $3', [`%${query}%`, limit, offset]);
        
        if (!cards.length) {
            return res.status(404).json({ message: 'No cards found' });
        }

        res.json(cards);
    } catch (error) {
        console.error("Error fetching cards based on search:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});




app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
