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
  odds,
}: {
  isOpen: boolean;
  onRequestClose: () => void;
  fightId: string;
  fighterName: string;
  person: string;
  odds: string;
}) => {
  const [bid, setBid] = useState(1);
  const [qrCode, setQrCode] = useState(null);

  const handleBidChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBid(parseInt(e.target.value));
  };

  const sendBid = async () => {
    const username = localStorage.getItem("username");
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/bids/registerBid`,
        { fighter: fighterName, amount: bid, person: person },
        {
          params: {
            username,
            fightId,
          },
        }
      );
      setQrCode(response.data.qrCode);
      console.log("Bid registered", response.data);
      // onRequestClose();
    } catch (err) {
      console.error(err);
    }
  };
  const paymentMade = async () => {
    
  }

  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose}>
      <div className={s.root}>
        {qrCode ?(<>
          <h4>Scan the QR code to complete the payment</h4>
        <img src={`data:image/png;base64,${qrCode}`} alt="QR Code" />
        <div className={s.qrButtons}>
          <button onClick={()=>onRequestClose()} className={s.cancelButton}>Cancel</button>
          <button onClick={()=>paymentMade()} className={s.successButton}>Paid</button>
        </div>
        </>
        ):(
        <>
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
        </>
        )}
      </div>
    </Modal>
  );
};

export default BidModal;
