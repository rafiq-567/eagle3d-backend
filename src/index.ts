import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import authRouter from './routes/auth';
import productRouter from './routes/productRoutes';

import cookieParser from 'cookie-parser';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;


const allowedOrigins = ['http://localhost:3000']; 
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true,
}));



app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 


app.use(cookieParser());


app.get('/', (req: Request, res: Response) => {
    res.send('Eagle3D Backend API is running!');
});


app.use('/api/auth', authRouter);
app.use('/api/products', productRouter);


app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).send({ message: 'Something broke!', error: err.message });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});