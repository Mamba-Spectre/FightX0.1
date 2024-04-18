import express from "express";
import { AddMoney, walletTransactionByUsername } from "../controllers/wallet";


const router = express.Router();

router.get('/getTransactions',walletTransactionByUsername);
router.get('/addMoney',AddMoney)


export default router;