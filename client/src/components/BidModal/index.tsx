import React, { useState } from "react";
import Modal from "../Modal";
import axios from "axios";
import s from "./BidModal.module.scss";

const BidModal = ({
  isOpen,
  onRequestClose,
  fightId,
  fighterName,
  person,
  odds
}: {
  isOpen: boolean;
  onRequestClose: () => void;
  fightId: string;
  fighterName: string;
    person: string;
  odds: string;
}) => {
  const [bid, setBid] = useState(1);

  const handleBidChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBid(parseInt(e.target.value));
  };

  const sendBid = async () => {
    const username = localStorage.getItem("username");
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/bids/registerBid`,
        { fighter: fighterName, amount: bid,person: person },
        {
          params: {
            username,
            fightId,
          },
        }
      );
      onRequestClose();
    } catch (err) {
      console.error(err);
    }
  };
console.log(odds)
  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose}>
      <div className={s.root}>
        <h4>BID on {fighterName}</h4>
        <input
          type="number"
          placeholder="Enter your bid"
          value={bid}
          onChange={handleBidChange}
          maxLength={4}
          max={1000}
          autoFocus
        />
        Expected Return: {(bid * Number(odds)).toFixed(2)}
        <button onClick={sendBid}>Enter BID</button>
      </div>
    </Modal>
  );
};

export default BidModal;
