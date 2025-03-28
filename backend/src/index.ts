import express from 'express';
import { Client } from 'pg';

const app = express();
const port = 5000;

const client = new Client({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432'),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

client.connect()
    .then(() => console.log('Connected to PostgreSQL'))
    .catch((err) => console.error('Failed to connect to PostgreSQL', err));

app.get('/', (req, res) => {
    res.send('Hello from Node.js with PostgreSQL!');
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
