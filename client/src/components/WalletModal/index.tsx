import React, { useEffect, useState } from "react";
import s from "./WalletModal.module.scss";
import Modal from "../Modal";
import axios from "axios";
import AddMoneyModal from "../AddMoneyModal";
import dayjs from "dayjs";

const WalletModal = ({
  modalOpen,
  closeModal,
}: {
  modalOpen: boolean;
  closeModal: () => void;
}) => {
  const [walletData, setWalletData] = useState([]);
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
    const reversedTransactions =
      response?.data.walletTransactions.transactions.reverse();
    setWalletData(reversedTransactions);
    console.log(reversedTransactions);
  };

  useEffect(() => {
    fetchWalletData();
  }, []);

  return (
    <Modal isOpen={modalOpen} onRequestClose={closeModal}>
      <div className={s.root}>
        <div className={s.title}>Wallet Transactions</div>
        <div className={s.body}>
          {walletData.map((item: any, index) => {
            return (
              <div key={index} className={`${s.transaction} ${item.debit ? s.debitTransaction : ''}`}>
                <div className={s.transactionDetails}>
                  <div className={s.transactionAmount}>
                    {item.amount}
                    {item.debit && <span> on <span className={s.fighterName}>{item?.fighterName}</span> at {dayjs(item.timestamp).format('YYYY-MM-DD HH:mm:ss')}</span>}
                    {item.credit && (
                      <span>
                        to Wallet on{" "}
                        {new Date(item.timestamp).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  <div className={s.transactionDate}>
                    {item.UPItransactionID && (
                      <span>UPI Transaction ID: {item.UPItransactionID}</span>
                    )}
                    {item.fightId && <span>Fight ID: {item.fightId}</span>}
                  </div>
                </div>
                {!item.isMarked ? (
                  <div className={s.transactionStatus}>Approval Pending</div>
                ) : (
                  <div className={s.transactionStatusApproved}>Approved</div>
                )}
              </div>
            );
          })}
        </div>
        <div className={s.footer}>
          <div className={s.buttons} onClick={() => setMoneyModal(true)}>
            <button>Add Money to Wallet</button>
          </div>
        </div>
      </div>
      {moneyModal && (
        <AddMoneyModal
          modalOpen={moneyModal}
          closeModal={() => {setMoneyModal(false)
          fetchWalletData()}}
        />
      )}
    </Modal>
  );
};

export default WalletModal;
