import express from 'express';
import cors from 'cors';
import userRouter from './user';
import recordRouter from './record';

const app = express();

app.use(cors({
  origin: [
    'https://accounting-app-silk.vercel.app',
    'http://localhost:5173'
  ],
  credentials: true
}));

app.use(express.json());

app.use('/api/user', userRouter);
app.use('/api/record', recordRouter);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 