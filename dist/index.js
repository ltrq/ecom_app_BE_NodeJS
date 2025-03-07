"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const verify_1 = require("./auth/verify");
const sync_1 = require("./carts/sync");
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
app.use(express_1.default.json());
app.get('/', (req, res) => {
    res.send('LTRQ E-commerce Backend is running!');
});
app.post('/api/auth/verify', verify_1.verifyToken, (req, res) => {
    res.status(200).json({
        uid: req.userId,
        message: 'Token verified successfully',
    });
});
app.post('/api/carts/sync', verify_1.verifyToken, sync_1.syncCart);
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
