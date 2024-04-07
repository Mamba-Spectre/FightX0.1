import express from 'express';
import { BidModal, createBid } from '../db/biding';
import { FightModal } from '../db/fight';

export const registerBid = async (req: express.Request, res: express.Response) => {
    const { username } = req.query;
    const fightId = req.params.id;
    const { fighter, amount } = req.body;
    if (!fighter || !amount || !username) {
        return res.status(400).send({ message: 'Missing required fields' });
    }
    if (amount < 0) {
        return res.status(400).send({ message: 'Amount must be positive' });
    }
    await createBid({
        fighter,
        amount,
        bidder:username,
    });
    try {
        const fight:any = await FightModal.findById(fightId);
        if (!fight) {
            return res.status(404).send({ message: 'Fight not found' });
        }
        fight.bids[fighter] += amount;
        await fight.save();

        res.status(200).send({ message: 'Bid registered', updatedFight: fight }).end();
    } catch (error) {
        console.error('Error registering bid:', error);
        res.status(500).send({ message: 'Internal server error' });
    }
    res.status(200).send({ message: 'Bid registered' }).end();
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
    const fightingId = req.params.id;
    if (!fightingId) {
        return res.status(400).send({ message: 'Fight ID is required' });
    }
    const bookmakerEdge = 0.1;
    const fightDetails = await FightModal.findById(fightingId);
    const totalChallengerBids = fightDetails?.bids.challenger;
    const totalChallengedBids = fightDetails?.bids.challenged;
    if (!totalChallengerBids || !totalChallengedBids) {
        return res.status(400).send({ message: 'Bids not found' });
    }
    const totalBids = totalChallengerBids + totalChallengedBids;
    const impliedProbabilityChallenger = totalChallengedBids / totalChallengerBids;
    const impliedProbabilityChallenged = totalChallengerBids / totalChallengedBids;

    const adjustedImpliedProbabilityChallenger = impliedProbabilityChallenger * (1 - bookmakerEdge);
    const adjustedImpliedProbabilityChallenged = impliedProbabilityChallenged * (1 - bookmakerEdge);

    const challengerTeamOdds = 1 / adjustedImpliedProbabilityChallenger;
    const challengedTeamOdds = 1 / adjustedImpliedProbabilityChallenged;

    // const stake = 1;

    // const payoutTeam1 = challengerTeamOdds * stake;
    // const payoutTeam2 = challengedTeamOdds * stake;
    res.status(200).send({ challengedTeamOdds, challengerTeamOdds }).end();
}

