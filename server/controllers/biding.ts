import express from 'express';
import { BidModal, createBid } from '../db/biding';
import { FightModal } from '../db/fight';
import { getUserTotalBalance } from '../db/users';

export const registerBid = async (req: express.Request, res: express.Response) => {
    const { username,fightId,person } = req.query;
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
    }
    // const qrCode = await axios.get("https://quickchart.io/qr",{
    //     params:{
    //         text: `upi://pay?pa=9996565776@paytm&pn=PaytmUser&mc=0000&mode=02&purpose=00&orgid=159761&cust=1170693112&am=${amount}`,
    //         format: 'base64',
    //     }
    // })
    // res.status(200).send({ message: 'Bid registeration requested!', qrCode: qrCode.data }).end();

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

