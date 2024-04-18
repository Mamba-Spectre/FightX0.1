import React, { useEffect, useState } from "react";
import s from "./WalletModal.module.scss";
import Modal from "../Modal";
import axios from "axios";
import AddMoneyModal from "../AddMoneyModal";

const WalletModal = ({
  modalOpen,
  closeModal,
}: {
  modalOpen: boolean;
  closeModal: () => void;
}) => {
  const [walletData, setWalletData] = useState({} as any);
  const [moneyModal, setMoneyModal] = useState(false);

  const fetchWalletData = async () => {
    const username = localStorage.getItem("username");
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/wallet/getTransactions`,
      {
        params: {
          username,
        },
      }
    );
    console.log("Wallet Data", response.data);
  };


  useEffect(() => {
    console.log("WalletModal mounted");
    fetchWalletData();
  }, []);

  return (
    <Modal isOpen={modalOpen} onRequestClose={closeModal}>
      <div className={s.root}>
        <div className={s.title}>Wallet Transactions</div>
        <div className={s.body}>Body</div>
        <div className={s.footer}>
          <div className={s.buttons} onClick={()=> setMoneyModal(true)}>
            <button>Add Money to Wallet</button>
          </div>
        </div>
      </div>
      {
        moneyModal && <AddMoneyModal modalOpen={moneyModal} closeModal={()=>setMoneyModal(false)} />
      }
    </Modal>
  );
};

export default WalletModal;
