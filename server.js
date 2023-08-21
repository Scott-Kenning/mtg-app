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
            res.json(card);
        } else {
            res.status(404).json({ message: 'Card not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

app.get('/search', async (req, res) => {
    const query = req.query.query;
    const page = parseInt(req.query.page || '1');
    const color = req.query.color;
    const rarity = req.query.rarity;
    const sort = req.query.sort || 'name';  // Default to alphabetical
    const limit = 10;
    const offset = (page - 1) * limit;

    let filterConditions = 'WHERE name ILIKE $1';
    let filterValues = [`%${query}%`];
    let orderBy = 'ORDER BY name ASC';

    if (color) {
        filterConditions += ' AND $' + (filterValues.length + 1) + ' = ANY(colors)';
        filterValues.push(color);
    }    

    if (rarity) {
        filterConditions += ' AND rarity = $' + (filterValues.length + 1);
        filterValues.push(rarity);
    }

    if (sort === 'rarity') {
        orderBy = `ORDER BY CASE
                     WHEN rarity = 'common' THEN 1
                     WHEN rarity = 'uncommon' THEN 2
                     WHEN rarity = 'rare' THEN 3
                     WHEN rarity = 'mythic' THEN 4
                     ELSE 5
                   END`;
    } else if (sort === 'cmc') {
        orderBy = 'ORDER BY cmc ASC';
    }
    

    try {
        const cards = await db.any(`SELECT * FROM cards ${filterConditions} ${orderBy} LIMIT $${filterValues.length + 1} OFFSET $${filterValues.length + 2}`, [...filterValues, limit, offset]);

        const totalCount = await db.one(`SELECT count(*) FROM cards ${filterConditions}`, filterValues);
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
