import { Router, Request, Response } from 'express';
import { PrismaClient } from '../generated/prisma';

const prisma = new PrismaClient();
const router = Router();

// 取得所有帳戶
router.get('/', async (req: Request, res: Response): Promise<void> => {
  const userId = (req as any).userId;
  const accounts = await prisma.account.findMany({ where: { userId } });
  res.json(accounts);
});

// 新增帳戶
router.post('/', async (req: Request, res: Response): Promise<void> => {
  const userId = (req as any).userId;
  const { name, icon } = req.body;
  const account = await prisma.account.create({ data: { name, icon, userId } });
  res.json(account);
});

// 編輯帳戶
router.put('/:id', async (req: Request, res: Response): Promise<void> => {
  const userId = (req as any).userId;
  const { id } = req.params;
  const { name, icon } = req.body;
  const account = await prisma.account.updateMany({ where: { id: Number(id), userId }, data: { name, icon } });
  res.json(account);
});

// 刪除帳戶
router.delete('/:id', async (req: Request, res: Response): Promise<void> => {
  const userId = (req as any).userId;
  const { id } = req.params;
  await prisma.account.deleteMany({ where: { id: Number(id), userId } });
  res.json({ success: true });
});

export default router; 