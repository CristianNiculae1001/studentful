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
const corsOptions = {
    // set origin to a specific origin.
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    
    // or, set origin to true to reflect the request origin
    //origin: true,
  
    credentials: true,
    optionsSuccessStatus: 200,
  };
  
app.use(cors(corsOptions));
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