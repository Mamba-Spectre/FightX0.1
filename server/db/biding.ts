import mongoose from "mongoose";

const BidSchema = new mongoose.Schema({
    fighter: { type: String, required: true },
    amount: { type: Number, required: true }, 
    bidder: { type: String, required: true }, 
    winning: { type: Boolean, default: false },
    timestamp: { type: Date, default: Date.now } 
});

export const BidModal = mongoose.model("Bid", BidSchema);

export const createBid = (values: Record<string, any>) => new BidModal(values).save().then((bid) => bid.toObject());