"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const user_1 = __importDefault(require("./user"));
const record_1 = __importDefault(require("./record"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: [
        'https://accounting-app-silk.vercel.app',
        'http://localhost:5173'
    ],
    credentials: true
}));
app.use(express_1.default.json());
app.use('/api/user', user_1.default);
app.use('/api/record', record_1.default);
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
