import express from 'express';
import cors from 'cors';
import userRouter from './user';
import recordRouter from './record';
import accountRouter from './account';
import categoryRouter from './category';

const app = express();

app.use(cors({
  origin: [
    'https://accounting-app-silk.vercel.app',
    'https://accounting-app-nbqsh31l-bea95.vercel.app',
    'https://accounting-app-nbqsh31l-bobos-projects-d97be9a5.vercel.app',
    'http://localhost:5173'
  ],
  credentials: true
}));

app.use(express.json());

app.use('/api/user', userRouter);
app.use('/api/record', recordRouter);
app.use('/api/account', accountRouter);
app.use('/api/category', categoryRouter);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 