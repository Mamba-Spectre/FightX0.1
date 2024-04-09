import express from "express";
import dayjs from "dayjs";
import { FightModal, FightRequestModal, createFight, createFightRequest } from "../db/fight";
import { getFightBiddingOdds } from "./biding";

export const registerFight = async (req: express.Request, res: express.Response) => {
    const { challenger, challenged, date, location } = req.body;
    if (!challenger || !challenged || !date || !location) {
        return res.status(400).send({ message: "Missing required fields" });
    }

    const selectedTime = dayjs(date).format('YYYY-MM-DD HH:mm');

    const currentDate = dayjs();
    const minimumTime = currentDate.add(1, 'day');

    if (dayjs(selectedTime).isBefore(minimumTime)) {
        return res.status(400).send({ message: "Selected time must be at least 1 day after the current time" });
    }

    await createFightRequest({
        challenger,
        challenged,
        date: selectedTime,
        location,
    });

    res.status(200).send({ message: "Fight requested" }).end();
}

export const getFightRequests = async (req: express.Request, res: express.Response) => {
    const { Authorization } = req.headers;
    const { username } = req.query;
    if (!username) {
        return res.status(400).send({ message: "Username is required" });
    }
    const fightRequests = await FightRequestModal.find({ challenged : username.toString()});
    res.status(200).send({ fightRequests }).end();
}

export const acceptFight = async (req: express.Request, res: express.Response) => {
    const { fightRequestId } = req.query;
    if(!fightRequestId){
        return res.status(400).send({ message: "Missing Fight Request ID" });
    }
    const fightRequest = await FightRequestModal.findById(fightRequestId);
    if(!fightRequest){
        return res.status(404).send({ message: "Fight Request not found" });
    }
    await createFight({
        challenger: fightRequest.challenger,
        challenged: fightRequest.challenged,
        date: fightRequest.date,
        location: fightRequest.location,
    });
    await FightRequestModal.findByIdAndDelete(fightRequestId);
    res.status(200).send({ message: "Fight accepted" }).end();
}

export const rejectFight = async (req: express.Request, res: express.Response) => {
    const { fightRequestId } = req.query;
    if(!fightRequestId){
        return res.status(400).send({ message: "Missing Fight Request ID" });
    }
    const fightRequest = await FightRequestModal.findById(fightRequestId);
    if(!fightRequest){
        return res.status(404).send({ message: "Fight Request not found" });
    }
    await FightRequestModal.findByIdAndDelete(fightRequestId);
    res.status(200).send({ message: "Fight request rejected" }).end();
}

export const getFights = async (req: express.Request, res: express.Response) => {
    const fights = await FightModal.find();
    res.status(200).send({ fights }).end();
}
export const getFightDetails = async (req: express.Request, res: express.Response) => {
    const { fightID } = req.query;
    if (!getFightBiddingOdds) {
        return res.status(400).send({ message: "Missing Fight ID" });
    }
    const fight = await FightModal.findById(fightID);
    if (!fight) {
        return res.status(404).send({ message: "Fight not found" });
    }
    res.status(200).send({ fight }).end();
}

// export const mockFIghts = async () => {
// const mockData = [{
//     challenger:"HarshVardhanSaroha",
//     challenged:"SaranshBibiyan",
//     date:"2024-05-01T00:00:00.000Z",
//     location:"Leisure Valley, Delhi Road Sonipat, Haryana",
// },{
//     challenger:"YashDahiya",
//     challenged:"ViditRaheja",
//     date:"2024-05-08T00:00:00.000Z",
//     location:"Haryana Sports Ground, Sonipat, Haryana",
// }];

// for (const data of mockData) {
//   await FightModal.create(data);
// }

// console.log('Mock data inserted successfully.');}