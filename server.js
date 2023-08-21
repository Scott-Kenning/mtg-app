const express = require('express');
const bodyParser = require('body-parser');
const db = require('./database');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
const PORT = 3000;
app.use(bodyParser.json());

app.get('/card/*', async (req, res) => {
    try {
        const cardName = decodeURIComponent(req.params[0]);

        const card = await db.oneOrNone('SELECT * FROM cards WHERE name = $1', [cardName]);

        if (card) {
            const cardFaces = await db.any('SELECT * FROM card_faces WHERE card_id = $1', [card.id]);
            card.card_faces = cardFaces;
            console.log(card)
            res.json(card);
        } else {
            res.status(404).json({ message: 'Card not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

app.get('/search/:query', async (req, res) => {
    const { query } = req.params;
    const page = parseInt(req.query.page || '1');
    const limit = 10;
    const offset = (page - 1) * limit;

    try {
        const cards = await db.any('SELECT * FROM cards WHERE name ILIKE $1 ORDER BY name ASC LIMIT $2 OFFSET $3', [`%${query}%`, limit, offset]);

        const totalCount = await db.one('SELECT count(*) FROM cards WHERE name ILIKE $1', [`%${query}%`]);
        const totalCards = parseInt(totalCount.count);
        const totalPages = Math.ceil(totalCards / limit);
        
        if (!cards.length) {
            return res.status(404).json({ message: 'No cards found' });
        }

        const cardsWithFaces = await Promise.all(cards.map(async card => {
            const cardFaces = await db.any('SELECT * FROM card_faces WHERE card_id = $1', [card.id]);
            card.card_faces = cardFaces;
            return card;
        }));

        res.json({ cards: cardsWithFaces, totalPages });
    } catch (error) {
        console.error("Error fetching cards based on search:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
