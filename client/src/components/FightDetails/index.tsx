import React, { useEffect, useState } from "react";
import Modal from "../Modal";
import axios from "axios";
import s from "./FightDetails.module.scss";
import versus from "../../../assets/versus.png";
import dayjs from "dayjs";
import Loader from "../Loader";
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
  const [odds,setOdds] = useState("")
  const [loading, setLoading] = useState(false);
  const [bids, setBids] = useState({
    challengerTeamOdds: 0,
    challengedTeamOdds: 0,
  });

  const fetchFightDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/fights/getFightDetails`,
        { params: { fightID } }
      );
      setFightDetails(response.data.fight);
      setLoading(false);
    } catch (err: any) {
      console.log(err);
      setLoading(false);
    }
  };
  const fetchBids = async () => {
    try{
      setLoading(true);
      const response = await axios.get( `${process.env.NEXT_PUBLIC_API_URL}/bids/getFightBiddingOdds`, { params: { fightId:fightID} });
      console.log(response.data);
      setBids(response.data);
      setLoading(false);
    }catch(err:any){
      setLoading(false);
    }
  }
  const currentTime = dayjs();
  const isBiddingEnabled = currentTime.isBefore(dayjs(fightDetails.date));

  useEffect(() => {
    fetchFightDetails();
    fetchBids();
  }, []);

  return (
    <Modal isOpen={modalOpen} onRequestClose={closeModal}>
      {loading ? (
        <div className={s.loader}>
          <Loader />

        </div>
      ) : (
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
              <button
                onClick={() => {
                  setPerson("challenger"),
                  setOdds(bids.challengerTeamOdds.toFixed(2)),
                  setBidModal(true),
                  setFighterName(fightDetails?.challenger?.name)
                }}
                disabled={!localStorage.getItem("username") || !isBiddingEnabled}
              >
                {bids?.challengerTeamOdds !== undefined ? bids.challengerTeamOdds.toFixed(2) : ""}
              </button>
              <button
                onClick={() => {
                  setPerson("challenged"),
                  setOdds(bids.challengedTeamOdds.toFixed(2)),
                  setBidModal(true),
                  setFighterName(fightDetails?.challenged?.name)
                }}
                disabled={!localStorage.getItem("username") || !isBiddingEnabled}
              >
                {bids?.challengedTeamOdds !== undefined ? bids.challengedTeamOdds.toFixed(2) : ""}
              </button>
            </div>
          </div>
        </div>
      )}
      {bidModal && <BidModal isOpen={bidModal} fightId={fightID} onRequestClose={() => {setBidModal(false),fetchBids()}} fighterName = {fighterName} person={person} odds={odds}/>}
    </Modal>
  );
};

export default FightDetails;
