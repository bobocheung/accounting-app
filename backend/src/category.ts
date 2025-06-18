import { Router, Request, Response } from 'express';
import { PrismaClient } from '../generated/prisma';

const prisma = new PrismaClient();
const router = Router();

// 取得所有分類
router.get('/', async (req: Request, res: Response): Promise<void> => {
  const categories = await prisma.category.findMany();
  res.json(categories);
});

export default router; 