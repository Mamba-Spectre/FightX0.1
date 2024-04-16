import express from "express";
import {
  getWalletTransactions,
  getWalletTransactionByUsername,
  getWalletTransactionsRequests,
} from "../db/wallet";

export const getWalletTransaction = async (
  req: express.Request,
  res: express.Response
) => {
  const walletTransactions = await getWalletTransactions();
  res.status(200).send({ walletTransactions }).end();
};

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

export const approveOrRejectTransaction = async ( req: express.Request, res: express.Response) => {
    const { subTransactionId, transactionResult } = req.body;
    if (!subTransactionId) {
        return res.status(400).send({ message: "Transaction ID is required" });
    }
    try {
        const transaction = await getWalletTransactionById(transactionId);
        if (!transaction) {
        return res.status(404).send({ message: "Transaction not found" });
        }
        if (!isMarked) {
        transaction.isMarked = isMarked;
        if (transactionAccepted) {
        transaction.transactionAccepted = transactionAccepted;
        }
        }
        else{
            res.status(400).send({ message: "Transaction already marked" });
        }
        await transaction.save();
        res.status(200).send({ message: "Transaction updated", updatedTransaction: transaction }).end();
    } catch (error) {
        console.error("Error updating transaction:", error);
        res.status(500).send({ message: "Internal server error" });
    }
    };
