"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = require("../generated/prisma");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma = new prisma_1.PrismaClient();
const router = (0, express_1.Router)();
const JWT_SECRET = process.env.JWT_SECRET || 'secret';
// JWT 驗證中介層
function auth(req, res, next) {
    var _a;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
    if (!token) {
        res.status(401).json({ error: '未授權' });
        return;
    }
    try {
        const payload = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        req.userId = payload.userId;
        next();
    }
    catch (_b) {
        res.status(401).json({ error: '無效 token' });
        return;
    }
}
// 取得所有記帳紀錄
router.get('/', auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    const records = yield prisma.record.findMany({ where: { userId }, orderBy: { date: 'desc' } });
    res.json(records);
}));
// 新增記帳
router.post('/', auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    const { type, amount, category, date, note } = req.body;
    const record = yield prisma.record.create({ data: { type, amount, category, date: new Date(date), note, userId } });
    res.json(record);
}));
// 編輯記帳
router.put('/:id', auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    const { id } = req.params;
    const { type, amount, category, date, note } = req.body;
    const record = yield prisma.record.updateMany({
        where: { id: Number(id), userId },
        data: { type, amount, category, date: new Date(date), note },
    });
    res.json(record);
}));
// 刪除記帳
router.delete('/:id', auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    const { id } = req.params;
    yield prisma.record.deleteMany({ where: { id: Number(id), userId } });
    res.json({ success: true });
}));
exports.default = router;
