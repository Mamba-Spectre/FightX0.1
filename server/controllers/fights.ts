import express from "express";
import { FightModal, FightRequestModal, createFight, createFightRequest } from "../db/fight";

export const registerFight = async (req: express.Request, res: express.Response) => {
    const { challenger, challenged, time, location } = req.body;
    if (!challenger || !challenged || !time || !location) {
        return res.status(400).send({ message: "Missing required fields" });
    }
    const currentDate = new Date();
    const currentTime = currentDate.getTime();
    const minimumTime = new Date(currentTime + 24 * 60 * 60 * 1000);
    const selectedTime = new Date(time);
    if (selectedTime <= minimumTime) {
        return res.status(400).send({ message: "Selected time must be at least 1 day after the current time" });
    }
 await createFightRequest({
        challenger,
        challenged,
        time: selectedTime,
        location,
    });

    res.status(200).send({ message: "Fight requested" }).end();
}

export const getFightRequests = async (req: express.Request, res: express.Response) => {
    const { username } = req.query;
    if (!username) {
        return res.status(400).send({ message: "Username is required" });
    }
    const fightRequests = await FightRequestModal.find({ challenged : username.toString()});
    res.status(200).send({ fightRequests }).end();
}

export const acceptFight = async (req: express.Request, res: express.Response) => {
    const { fightRequestId } = req.body;
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

export const getFights = async (req: express.Request, res: express.Response) => {
    const fights = await FightModal.find();
    res.status(200).send({ fights }).end();

}