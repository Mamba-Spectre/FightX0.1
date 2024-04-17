import express from "express";
import {
  getWalletTransactions,
  getWalletTransactionByUsername,
  getWalletTransactionsRequests,
  createWalletTransaction,
  WalletTransactionModel,
  getUnmarkedWalletTransactions
} from "../db/wallet";
import { updateUserByUsername } from "../db/users";

export const getWalletTransaction = async (
  req: express.Request,
  res: express.Response
) => {
  const walletTransactions = await getWalletTransactions();
  res.status(200).send({ walletTransactions }).end();
};

export const acceptOrRejectTransaction = async ( req: express.Request, res: express.Response) => {
  const { username, transactionId, verdict } = req.body;
  if(!username || !transactionId || verdict === undefined){
    return res.status(400).send({ message: "Username, transaction ID and accept are required" });
  }
  try {
    const walletTransaction:any = await getWalletTransactionByUsername(username);
    if(!walletTransaction){
      return res.status(404).send({ message: "User not found" });
    }
    const transaction = walletTransaction.transactions.find((transaction:any) => transaction._id == transactionId);
    if(!transaction){
      return res.status(404).send({ message: "Transaction not found" });
    }
    if(transaction.transactionAccepted){
      return res.status(400).send({ message: "Transaction already accepted" });
    }
    if(verdict === true){
      transaction.transactionAccepted = true;
      transaction.isMarked = true;
      walletTransaction.totalBalance += transaction.amount;
      transaction.credit = true;
      await updateUserByUsername(username, { walletBalance: walletTransaction.totalBalance }); 
    }
    else{
      transaction.isMarked = true;
    }
    await walletTransaction.save();
    res.status(200).send({ message: "Transaction updated successfully" }).end();
  } catch (error) {
    console.error("Error accepting or rejecting transaction:", error);
    res.status(500).send({ message: "Internal server error" });
  }

}

export const getUnmarkedTransactions = async ( req: express.Request, res: express.Response) => {
  try{
    const unmarkedTransactions = await getUnmarkedWalletTransactions();
    res.status(200).send({ unmarkedTransactions }).end();
  }
  catch{
    res.status(500).send({ message: "Internal server error" });
  }
}

export const walletTransactionByUsername = async (
  req: express.Request,
  res: express.Response
) => {
  const { username } = req.query;
  if (!username) {
    return res.status(400).send({ message: "Username is required" });
  }
  const walletTransactions = await getWalletTransactionByUsername(
    username.toString()
  );
  res.status(200).send({ walletTransactions }).end();
};
export const getTransactionRequests = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const transactionRequests = await getWalletTransactionsRequests();
    res.status(200).send({ transactionRequests }).end();
  } catch (error) {
    res.status(500).send({ message: "Internal server error" });
    console.error("Error getting transaction requests:", error);
  }
};

export const createPaymentRequest = async (req: express.Request, res: express.Response) => {
   const { username, amount, UPItransactionID } = req.body;
    if(!username || !amount || !UPItransactionID){
        return res.status(400).send({ message: "Username, amount and UPI transaction ID are required" });
    }
    try {
        if(amount < 0){
            return res.status(400).send({ message: "Amount cannot be negative" });
        }
        const walletTransaction:any = await getWalletTransactionByUsername(username);
        if(!walletTransaction){
            await createWalletTransaction({ username, transactionRequests: true, transactions: [{ amount, UPItransactionID, credit: false, debit: true, timestamp: new Date(), isMarked: false, transactionAccepted: false }] });
        }
        else{
            walletTransaction.transactions.push({ amount, UPItransactionID, credit: false, debit: true, timestamp: new Date(), isMarked: false, transactionAccepted: false });
            await walletTransaction.save();
        }
    } catch (error) {
        console.error("Error creating payment request:", error);
        res.status(500).send({ message: "Internal server error" });
    }
}
