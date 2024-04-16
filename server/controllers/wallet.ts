import express from 'express';
import { getWalletTransactions, getWalletTransactionByUsername } from '../db/wallet';


export const getWalletTransaction = async (req: express.Request, res: express.Response) => {
    const walletTransactions = await getWalletTransactions()
    res.status(200).send({ walletTransactions }).end();
}

export const walletTransactionByUsername = async (req: express.Request, res: express.Response) => {
    const { username } = req.query;
    if (!username) {
        return res.status(400).send({ message: 'Username is required' });
    }
    const walletTransactions = await getWalletTransactionByUsername(username.toString());
    res.status(200).send({ walletTransactions }).end();
}
