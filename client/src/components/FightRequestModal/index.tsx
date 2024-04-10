"use client";
import React, { useState } from "react";
import Modal from "../Modal";
import s from "./FightRequestModal.module.scss";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import "react-select-search/style.css";
import SelectSearch, { SelectSearchOption } from "react-select-search";
import versus from "../../../assets/versus.png";

const FightRequestModal = ({
  modalOpen,
  closeModal,
}: {
  modalOpen: boolean;
  closeModal: () => void;
}) => {
  const [options, setOptions] = useState<SelectSearchOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [challengedUser, setChallengedUser] = useState(null);
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");

  const getOptions = async (query: string) => {
    try {
      if (query.length < 3) return [];
      setLoading(true);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/user`,
        {
          params: {
            username: query,
          },
        }
      );
      const newOptions = response?.data?.usernames?.map((user: object) => ({
        name: user,
        value: user,
      }));
      setOptions(newOptions);
      setLoading(false);
      return newOptions;
    } catch (error) {
      console.error("Error fetching options:", error);
      setLoading(false);
      return [];
    }
  };
  const handleSubmit = async () => {
    setLoading(true);
    try {
      const challenger = localStorage.getItem("username");
      const commonAuth = localStorage.getItem("common-auth");
      const payload = {
        challenger,
        challenged: challengedUser,
        location,
        date,
      };
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/fights/registerFight`,
        payload,
        {
          headers: {
            "common-auth": commonAuth,
          },
        }
      );
    } catch (err: any) {
      setLoading(false);
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
    }
  };

  const handleLocationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLocation(event.target.value);
  };

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDate(event.target.value);
  };

  return (
    <div>
      <Modal isOpen={modalOpen} onRequestClose={closeModal}>
        <div className={s.modal}>
          <h2 className={s.header}>⚔️Challenger a Player⚔️</h2>
          <p>Search Opponent</p>
          <SelectSearch
            options={options}
            placeholder="Search Opponent"
            autoFocus
            className={s.selectSearch}
            search
            onChange={(value: any) => {
              setChallengedUser(value);
            }}
            getOptions={getOptions}
          />
          {challengedUser && (
            <span className={s.versus}>
              <p className={s.name}>{challengedUser}</p>
              <img src={versus.src} />
              <p className={s.name}>{localStorage.getItem("username")}</p>
            </span>
          )}
          <p>Date and Time</p>
          <input
            className={s.input}
            type="datetime-local"
            placeholder="Enter date and time"
            value={date}
            onChange={handleDateChange}
          />
          <p>Location</p>
          <input
            className={s.input}
            type="text"
            name="Location"
            placeholder="Enter location"
            value={location}
            onChange={handleLocationChange}
          />
          <button className={s.button} onClick={() => handleSubmit()}>
            Submit
          </button>
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
    </div>
  );
};

export default FightRequestModal;
