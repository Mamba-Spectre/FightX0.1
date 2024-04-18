import React, { useState } from "react";
import Modal from "../Modal";
import axios from "axios";
import s from "./BidModal.module.scss";
import { ToastContainer, toast } from "react-toastify";

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
  const [loading, setLoading] = useState(false);

  const handleBidChange = (e: any) => {
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
      onRequestClose();
    } catch (err:any) {
      toast.error(err?.response?.data?.message || "An error occurred", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      console.error(err);
    }
  };

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
      <ToastContainer
          position="top-center"
          autoClose={5000}
          hideProgressBar
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
    </Modal>
  );
};

export default BidModal;
