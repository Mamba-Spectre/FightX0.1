import express from "express";
import { AddMoney, createPaymentRequest, walletTransactionByUsername } from "../controllers/wallet";


const router = express.Router();

router.get('/getTransactions',walletTransactionByUsername);
router.get('/addMoney',AddMoney)
router.post('/markPaid',createPaymentRequest)


export default router;