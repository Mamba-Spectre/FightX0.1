import React, { useState } from "react";
import Modal from "../Modal";
import s from "./AddMoneyModal.module.scss";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { kMaxLength } from "buffer";

const AddMoneyModal = ({
  modalOpen,
  closeModal,
}: {
  modalOpen: boolean;
  closeModal: () => void;
}) => {
  const [showQrField, setShowQrField] = useState(false);
  const [qrCode, setQrCode] = useState(null);
  const [qrFields, setQrFields] = useState(false);
  const [amount, setAmount] = useState<number>();
  const [loading, setLoading] = useState(false);
  const [transactionId, setTransactionId] = useState();

  const getQrCode = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/wallet/addMoney`,
        {
          params: {
            amount: amount,
          },
        }
      );
      setQrCode(response.data.qrCode);
      setQrFields(true);
      console.log("QR Code generated", response.data);
    } catch (err: any) {
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

  const markPaid = async () => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/wallet/markPaid`,
        {
          username: localStorage.getItem("username"),
          "UPItransactionID":transactionId,
          amount,
        }
      );
      console.log("Transaction marked as paid", response.data);
      closeModal();
    } catch (err: any) {
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
  }

  return (
    <Modal isOpen={modalOpen} onRequestClose={closeModal}>
      <div className={s.root}>
        <div className={s.title}>Add Money to Wallet</div>
        {qrCode && (
          <div className={s.img}>
            <img src={`data:image/png;base64, ${qrCode}`} alt="QR Code" />
          </div>
        )}

        {!qrFields && (
          <input
            type="number"
            placeholder="Enter amount"
            value={amount}
            onChange={(e: any) => {
              e.target.value = e.target.value.slice(0, e.target.maxLength);
              setAmount(e.target.value);
            }}
            maxLength={5}
          />
        )}
        {qrFields && <input type="text" onChange={(e:any)=> setTransactionId(e.target.value)} placeholder="Enter Transaction ID" />}
        {!qrFields && (
          <span className={s.info}>
            <p>
              It may take upto 24hrs for the money to be credited in your Wallet
            </p>
          </span>
        )}
        <div className={s.buttons}>
          {!qrFields && (
            <button
              disabled={!amount}
              onClick={() => {
                getQrCode();
              }}
            >
              Pay via UPI QR
            </button>
          )}
          {qrFields && (
            <>
              <button onClick={()=> closeModal()}>Cancel</button>
              <button disabled={!transactionId} onClick={()=>markPaid()}>Paid</button>
            </>
          )}
        </div>
      </div>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar
        closeOnClick
        pauseOnHover
        draggable
        theme="dark"
      />
    </Modal>
  );
};

export default AddMoneyModal;
