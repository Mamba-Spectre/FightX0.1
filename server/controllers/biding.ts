import express from 'express';
import { BidModal, createBid } from '../db/biding';
import { FightModal } from '../db/fight';
import { getUserTotalBalance, updateUserByUsername } from '../db/users';
import { createWalletTransaction, getWalletTransactionByUsername } from '../db/wallet';

export const registerBid = async (req: express.Request, res: express.Response) => {
    const { username,fightId } = req.query;
    const { fighter, amount } = req.body;
    if (!fighter || !amount || !username) {
        return res.status(400).send({ message: 'Missing required fields' });
    }
    if (amount < 0) {
        return res.status(400).send({ message: 'Amount must be positive' });
    }
    const getTotalBalance = await getUserTotalBalance(username.toString());
    if(getTotalBalance < amount){
        return res.status(400).send({ message: 'Insufficient balance' });
    }else{
        await createBid({
            fighter,
            amount,
            bidder:username,
        });
        await updateUserByUsername(username.toString(), { walletBalance: getTotalBalance - amount });
        
    }
    try {
        const fight:any = await FightModal.findById(fightId);
        if (!fight) {
            return res.status(404).send({ message: 'Fight not found' });
        }
        if(fight.challenger.name === fighter){
            fight.challenger.bids += amount;
        }
        else{
            fight.challenged.bids += amount;
        }
        await fight.save();
        let walletTransactions: any = await getWalletTransactionByUsername(
            username.toString()
          );
          const transactionsData = {
            amount,
            fightId,
            fighterName: fighter,
            credit: false,
            debit: true,
            timestamp: new Date(),
            isMarked: true,
            transactionAccepted: true,
          };
          if (!walletTransactions) {
            await createWalletTransaction({
              username,
              transactionRequests: true,
              transactions: [transactionsData],
            });
          } else {
            walletTransactions.transactions.push(transactionsData);
            walletTransactions.transactionRequests = true;
            await walletTransactions.save();
          }

        res.status(200).send({ message: 'Bid registered', updatedFight: fight }).end();
    } catch (error) {
        console.error('Error registering bid:', error);
        res.status(500).send({ message: 'Internal server error' });
    }
};

export const getBids = async (req: express.Request, res: express.Response) => {
    const { username } = req.query;
    if (!username) {
        return res.status(400).send({ message: 'Username is required' });
    }
    const bids = await BidModal.find({ bidder: username.toString() });
    res.status(200).send({ bids }).end();
}

export const getFightBiddingOdds = async (req: express.Request, res: express.Response) => {
    const fightingId = req.query.fightId;
    if (!fightingId) {
        return res.status(400).send({ message: 'Fight ID is required' });
    }
    const bookmakerEdge = 0.1;
    const fightDetails = await FightModal.findById(fightingId);
    const totalChallengerBids = fightDetails?.challenger?.bids;
    const totalChallengedBids = fightDetails?.challenged?.bids;
    if (!totalChallengerBids || !totalChallengedBids) {
        return res.status(400).send({ message: 'Bids not found' });
    }
    const totalBids = totalChallengerBids + totalChallengedBids;
    const impliedProbabilityChallenger = totalChallengedBids / totalChallengerBids;
    const impliedProbabilityChallenged = totalChallengerBids / totalChallengedBids;

    const adjustedImpliedProbabilityChallenger = impliedProbabilityChallenger * (1 - bookmakerEdge);
    const adjustedImpliedProbabilityChallenged = impliedProbabilityChallenged * (1 - bookmakerEdge);

    const challengerTeamOdds = 1 / adjustedImpliedProbabilityChallenged;
    const challengedTeamOdds = 1 / adjustedImpliedProbabilityChallenger;
    res.status(200).send({ challengedTeamOdds, challengerTeamOdds }).end();
}

