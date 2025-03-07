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
Object.defineProperty(exports, "__esModule", { value: true });
exports.syncCart = void 0;
const firebase_1 = require("../utils/firebase");
const syncCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    const cartData = req.body.cart;
    if (!userId || !cartData) {
        res.status(400).json({ error: 'Missing userId or cart data' });
        return;
    }
    try {
        yield firebase_1.db.collection('carts').doc(userId).set({
            items: cartData,
            updatedAt: new Date().toISOString(),
        }, { merge: true });
        res.status(200).json({ message: 'Cart synced successfully' });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to sync cart' });
    }
});
exports.syncCart = syncCart;
