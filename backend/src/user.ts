import { Router, Request, Response } from 'express';
import { PrismaClient } from '../generated/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'secret';

// 註冊
router.post('/register', async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ error: '缺少欄位' });
    return;
  }
  const exist = await prisma.user.findUnique({ where: { email } });
  if (exist) {
    res.status(400).json({ error: 'Email 已註冊' });
    return;
  }
  const hash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({ data: { email, password: hash } });
  res.json({ id: user.id, email: user.email });
});

// 登入
router.post('/login', async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    res.status(400).json({ error: '帳號或密碼錯誤' });
    return;
  }
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    res.status(400).json({ error: '帳號或密碼錯誤' });
    return;
  }
  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ token });
});

export default router; 