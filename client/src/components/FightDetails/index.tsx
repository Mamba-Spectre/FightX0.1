import React, { use, useEffect, useState } from "react";
import Modal from "../Modal";
import axios from "axios";
import s from "./FightDetails.module.scss";
import versus from "../../../assets/versus.png";
import dayjs from "dayjs";
import BidModal from "../BidModal";

interface FightDetails {
  _id: string;
  challenger: string;
  challenged: string;
  location: string;
  date: string;
  bids: {
    challenger: number;
    challenged: number;
  };
}

const FightDetails = ({
  modalOpen,
  closeModal,
  fightID,
}: {
  modalOpen: boolean;
  closeModal: () => void;
  fightID: string;
}) => {
  const [fightDetails, setFightDetails] = useState<FightDetails>({
    _id: "",
    challenger: "",
    challenged: "",
    location: "",
    date: "",
    bids: {
      challenger: 0,
      challenged: 0,
    },
  });
  const [bidModal, setBidModal] = useState(false);
  const [fighterName, setFighterName] = useState("");
  const fetchFightDetails = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/fights/getFightDetails`,
        { params: { fightID } }
      );
      console.log(response.data.fight);
      setFightDetails(response.data.fight);
    } catch (err: any) {
      console.log(err);
    }
  };
  useEffect(() => {
    fetchFightDetails();
  }, []);
  return (
    <Modal isOpen={modalOpen} onRequestClose={closeModal}>
      <div className={s.root}>
        <div className={s.userDetails}>
          <p>{fightDetails?.challenger}</p>
          <img src={versus.src} alt="versus" />
          <p>{fightDetails?.challenged}</p>
        </div>
        <div className={s.otherDetails}>
        <p>{fightDetails?.location}</p>
        <p>{dayjs(fightDetails?.date).format("MMMM D, HH:mm")}</p>
        </div>
        <div className={s.bids}>
          <h1>Bids</h1>
          <div className={s.bid}>
            <p onClick={()=>{setBidModal(true),setFighterName(fightDetails?.challenger)}}>{fightDetails?.bids?.challenger}</p>
            <p onClick={()=>{setBidModal(true),setFighterName(fightDetails?.challenged)}}>{fightDetails?.bids?.challenged}</p>
          </div>
        </div>
      </div>
      {bidModal && <BidModal isOpen={bidModal} fightId={fightID} onRequestClose={() => setBidModal(false)} fighterName = {fighterName} />}
    </Modal>
  );
};

export default FightDetails;
