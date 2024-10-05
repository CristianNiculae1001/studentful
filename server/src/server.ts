import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import * as routes from './routes';
import db from './db/connection';
const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet());
app.use(cors());
app.use(morgan('dev'));

app.use(express.urlencoded({extended: false}));
app.use(express.json());

Object.values(routes).forEach((value) => {
    app.use('/api/v1', value);
})

app.use('*', (req, res) => {
    res.status(404).json({
        message: 'Route not found',
    });
})

app.listen(PORT, () => {
    // DB Connection
    db.raw('SELECT 1').then(() => {
        console.log('Connected to DB');
    });
    console.log(`Listening on http://localhost:${PORT}`);
});