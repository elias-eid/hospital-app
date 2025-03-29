import express from 'express';
import bodyParser from 'body-parser';
import nurseRoutes from './routes/nurseRoutes';
import wardRoutes from './routes/wardRoutes';
import cors from 'cors';

const app = express();
const port = 5000;

app.use(bodyParser.json());

// Enable CORS
app.use(cors());
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type']
}));


// Register routes
app.use('/api/nurses', nurseRoutes);
app.use('/api/wards', wardRoutes);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
