import mongoose from "mongoose";

const WalletTransactionSchema = new mongoose.Schema({
  username: { type: String, required: false },
  totalBalance: { type: Number, required: true, default: 0},
  transactionRequests: {type: Boolean, required: false, default: false},
  transactions: [
    {
      amount: { type: Number, required: true },
    },
    {
      credit: { type: Boolean, required: false },
    },
    {
      debit: { type: Boolean, required: false },
    },
    {
      fightId: { type: String, required: false },
    },
    {
      timestamp: { type: Date, default: Date.now },
    },
    {
      isMarked: { type: Boolean, required: false },
    },
    {
      transactionAccepted: { type: Boolean, required: false },
    },
  ],
});

export const WalletTransactionModel = mongoose.model(
  "WalletTransaction",
  WalletTransactionSchema
);

export const getWalletTransactions = () => WalletTransactionModel.find();
export const getWalletTransactionById = (id: string) =>
  WalletTransactionModel.findById(id);
export const getWalletTransactionByUsername = (username: string) => WalletTransactionModel.find({ username });
export const createWalletTransaction = (values: Record<string, any>) => new WalletTransactionModel(values).save().then((transaction) => transaction.toObject());
export const deleteWalletTransactionById = (id: string) =>
  WalletTransactionModel.findOneAndDelete({ _id: id });
export const updateWalletTransactionById = (id: string, values: Record<string, any>) =>
  WalletTransactionModel.findByIdAndUpdate(id, values); 
