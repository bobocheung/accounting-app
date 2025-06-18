import { Router, Request, Response, NextFunction } from 'express';
import { PrismaClient } from '../generated/prisma';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'secret';

// JWT 驗證中介層
function auth(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    res.status(401).json({ error: '未授權' });
    return;
  }
  try {
    const payload = jwt.verify(token, JWT_SECRET) as { userId: number };
    (req as any).userId = payload.userId;
    next();
  } catch {
    res.status(401).json({ error: '無效 token' });
    return;
  }
}

// 取得所有記帳紀錄
router.get('/', auth, async (req: Request, res: Response): Promise<void> => {
  const userId = (req as any).userId;
  const records = await prisma.record.findMany({ where: { userId }, orderBy: { date: 'desc' } });
  res.json(records);
});

// 新增記帳
router.post('/', auth, async (req: Request, res: Response): Promise<void> => {
  const userId = (req as any).userId;
  const { type, amount, category, date, note } = req.body;
  const record = await prisma.record.create({ data: { type, amount, category, date: new Date(date), note, userId } });
  res.json(record);
});

// 編輯記帳
router.put('/:id', auth, async (req: Request, res: Response): Promise<void> => {
  const userId = (req as any).userId;
  const { id } = req.params;
  const { type, amount, category, date, note } = req.body;
  const record = await prisma.record.updateMany({
    where: { id: Number(id), userId },
    data: { type, amount, category, date: new Date(date), note },
  });
  res.json(record);
});

// 刪除記帳
router.delete('/:id', auth, async (req: Request, res: Response): Promise<void> => {
  const userId = (req as any).userId;
  const { id } = req.params;
  await prisma.record.deleteMany({ where: { id: Number(id), userId } });
  res.json({ success: true });
});

export default router; 