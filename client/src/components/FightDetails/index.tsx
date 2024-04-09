import React, { use, useEffect, useState } from "react";
import Modal from "../Modal";
import axios from "axios";
import s from "./FightDetails.module.scss";
import versus from "../../../assets/versus.png";
import dayjs from "dayjs";
import BidModal from "../BidModal";

interface FightDetails {
  _id: string;
  challenger: {
    name: string;
    bids: number;
  };
  challenged: {
    name: string;
    bids: number;
  };
  location: string;
  date: string;
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
    challenger: {
      name: "",
      bids: 0,
    },
    challenged: {
      name: "",
      bids: 0,
    },
    location: "",
    date: "",
  });
  const [bidModal, setBidModal] = useState(false);
  const [fighterName, setFighterName] = useState("");
  const [person,setPerson] = useState("")
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
          <p>{fightDetails?.challenger?.name}</p>
          <img src={versus.src} alt="versus" />
          <p>{fightDetails?.challenged?.name}</p>
        </div>
        <div className={s.otherDetails}>
        <p>{fightDetails?.location}</p>
        <p>{dayjs(fightDetails?.date).format("MMMM D, HH:mm")}</p>
        </div>
        <div className={s.bids}>
          <h1>Bids</h1>
          <div className={s.bid}>
            <p onClick={()=>{setPerson("challenger"),setBidModal(true),setFighterName(fightDetails?.challenger?.name)}}>{fightDetails?.challenger?.bids}</p>
            <p onClick={()=>{setPerson("challenged"),setBidModal(true),setFighterName(fightDetails?.challenged?.name)}}>{fightDetails?.challenged?.bids}</p>
          </div>
        </div>
      </div>
      {bidModal && <BidModal isOpen={bidModal} fightId={fightID} onRequestClose={() => setBidModal(false)} fighterName = {fighterName} person={person}/>}
    </Modal>
  );
};

export default FightDetails;
