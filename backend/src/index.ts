import express from 'express';
import bodyParser from 'body-parser';
import nurseRoutes from './routes/nurseRoutes';
import wardRoutes from './routes/wardRoutes';

const app = express();
const port = 5000;

app.use(bodyParser.json());

// Register routes
app.use('/api/nurses', nurseRoutes);
app.use('/api/wards', wardRoutes);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
