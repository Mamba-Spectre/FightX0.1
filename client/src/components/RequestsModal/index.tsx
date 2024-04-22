import React, { useEffect, useState } from "react";
import Modal from "../Modal";
import axios from "axios";
import s from "./RequestModal.module.scss";
import versus from "../../../assets/versus.png";
import dayjs from "dayjs";
import Loader from "../Loader";

const RequestsModal = ({
  isOpen,
  closeModal,
}: {
  isOpen: boolean;
  closeModal: () => void;
}) => {
  const [requestsData, setRequestsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const fetchRequests = async () => {
    try {
        setLoading(true);
      const auth = localStorage.getItem("common-auth");
      const username = localStorage.getItem("username");
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/fights/fightRequests`,
        {
          params: {
            username,
          },
        }
      );
      setLoading(false);
      setRequestsData(response.data.fightRequests);
    } catch (err) {
        setLoading(false);
      console.log(err);
    }
  };
  const acceptFight = async (fightRequestId: string) => {
    try {
      const commonAuth = localStorage.getItem("common-auth");
      await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/fights/acceptFight`, {
        params: {
          fightRequestId,
        },
        headers: {
          "common-auth": commonAuth,
        },
      });
      fetchRequests();
    } catch (err) {
      console.log(err);
    }
  };
  const rejectFight = async (fightRequestId: string) => {
    try {
      await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/fights/rejectFight`, {
        params: {
          fightRequestId,
        },
      });
      fetchRequests();
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <div className={s.root}>
      <Modal
        isOpen={isOpen}
        onRequestClose={() => {
          closeModal();
        }}
      >
        <div className={s.wrapper}>
          <h2 style={{ marginBottom: "8" }}>Requests</h2>
          {loading ? ( 
            <div className={s.nan}>
                <Loader />
            </div>
          ) : requestsData.length === 0 ? (
            <div className={s.nan}>No fight requests. Happy TRAINING</div>
          ) : (
            requestsData.map((request: any) => (
              <div key={request._id} className={s.request}>
                <div className={s.fightDetails}>
                  <div className={s.people}>
                    <p className={s.names}>{request.challenger}</p>
                    <img src={versus.src} alt="versus" />
                    <p className={s.names}>{request.challenged}</p>
                  </div>
                </div>
                <div className={s.buttons}>
                  <button onClick={() => acceptFight(request._id)}>
                    Accept
                  </button>
                  <button onClick={() => rejectFight(request._id)}>
                    Reject
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </Modal>
    </div>
  );
};

export default RequestsModal;
