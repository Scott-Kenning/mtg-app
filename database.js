require('dotenv').config();
const pgp = require('pg-promise')();
const connectionString = `postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;

const db = pgp(connectionString);

module.exports = db;
