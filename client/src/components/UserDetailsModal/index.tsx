import React, { useEffect, useState } from "react";
import Modal from "../Modal";
import axios from "axios";
import s from "./UserModal.module.scss";
import Loader from "../Loader";

const UserModal = ({
  modalOpen,
  closeModal,
}: {
  modalOpen: boolean;
  closeModal: () => void;
}) => {
  const [userData, setUserData] = useState({
    username: "",
    fullname: "",
    email: "",
    profilePicture: "",
    totalWinning: 0,
  });
  const [loading, setLoading] = useState(true);
  const fecthUserDetails = async () => {
    try {
        setLoading(true);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/user/details`,
        {
          params: {
            username: localStorage.getItem("username"),
          },
        }
      );
      setUserData(response.data.user);
        setLoading(false);
    } catch (err) {
        setLoading(false);
      console.log(err);
    }
  };
  useEffect(() => {
    fecthUserDetails();
  }, []);
  return (
    <Modal isOpen={modalOpen} onRequestClose={closeModal}>
      <div className={s.root}>
        {loading? <div className={s.loader}><Loader/></div>: (
        <div className={s.details}>
          <img src={userData.profilePicture} alt="User Profile" />
          <div className={s.userDetails}>
            <span className={s.userName}>---- <p>{userData.username}</p></span>
            <span className={s.fullname}>--  <p>{userData.fullname}</p></span>
            <span className={s.email}>-- <p>{userData.email}</p></span>
            <span className={s.winning}>---- <p>{userData.totalWinning}</p></span>
          </div>
        </div>
        )}
      </div>
    </Modal>
  );
};

export default UserModal;
