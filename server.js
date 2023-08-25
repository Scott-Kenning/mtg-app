const express = require('express');
const bodyParser = require('body-parser');
const sql = require('./database.js');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

app.use(cors());
const PORT = 3000;
app.use(bodyParser.json());

app.get('/card/*', async (req, res) => {
    try {
        const cardName = decodeURIComponent(req.params[0]);

        const [card] = await sql`SELECT * FROM cards WHERE name = ${cardName}`;

        if (card) {
            const cardFaces = await sql`SELECT * FROM card_faces WHERE card_id = ${card.id}`;
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
    const sort = req.query.sort || 'name'; 
    const limit = 10;
    const offset = (page - 1) * limit;

    let filterConditions = sql`name ILIKE ${'%'+query+'%'}`;
    let orderBy = sql`ORDER BY name ASC`;

    if (color) {
        filterConditions = sql`${filterConditions} AND ${color} = ANY(colors)`;
    }    

    if (rarity) {
        filterConditions = sql`${filterConditions} AND rarity = ${rarity}`;
    }

    if (sort === 'rarity') {
        orderBy = sql`ORDER BY CASE
                     WHEN rarity = 'common' THEN 1
                     WHEN rarity = 'uncommon' THEN 2
                     WHEN rarity = 'rare' THEN 3
                     WHEN rarity = 'mythic' THEN 4
                     ELSE 5
                   END`;
    } else if (sort === 'cmc') {
        orderBy = sql`ORDER BY cmc ASC`;
    }
    
    try {
        const cards = await sql`SELECT * FROM cards WHERE ${filterConditions} ${orderBy} LIMIT ${limit} OFFSET ${offset}`;

        const [{ count: totalCards }] = await sql`SELECT count(*) FROM cards WHERE ${filterConditions}`;
        const totalPages = Math.ceil(totalCards / limit);
        
        if (!cards.length) {
            return res.status(404).json({ message: 'No cards found' });
        }

        const cardsWithFaces = await Promise.all(cards.map(async card => {
            const cardFaces = await sql`SELECT * FROM card_faces WHERE card_id = ${card.id}`;
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
    console.log(`Server is running on ${PORT}`);
});
