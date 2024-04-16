import mongoose from "mongoose";

interface IWalletTransaction {
    user: string;
    amount: number;
    credit: boolean;
    timestamp: Date;
    totalBalance: number;
    }

const WalletTransactionSchema = new mongoose.Schema({
    user: { type: String, required: true },
    amount: { type: Number, required: true },
    credit: { type: Boolean, required: true },
    timestamp: { type: Date, default: Date.now },
    totalBalance: { type: Number, required: true }
});

const MoneyTransferSchema = new mongoose.Schema({
    sender: { type: String, required: true },
    amount: { type: Number, required: true },
    timestamp: { type: Date, default: Date.now }
});

export const WalletTransactionModel = mongoose.model("WalletTransaction", WalletTransactionSchema);

