"use client"
import React, { useState } from "react";
import Modal from "../Modal";
import s from "./FightRequestModal.module.scss";
import { UploadButton } from "../../utils/uploadthing";
import axios from "axios";
import 'react-select-search/style.css'
import SelectSearch, { SelectSearchOption } from "react-select-search";

const FightRequestModal = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [options, setOptions] = useState<SelectSearchOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [challengedUser, setChallengedUser] = useState(null);
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");

  const getOptions = async (query: string) => {
    try {
      if (query.length < 3) return [];
      setLoading(true);
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/user`, {
        params: {
          username: query,
        },
      });
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

  const openModal = () => {
    setIsOpen(true);
  };

  // const payload = {
  //   challenger : "testuser1",
  //   challenged: challengedUser,
  //   location,
  //   date,
  // };
  // console.log("Payload: ", payload)
  // await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/fights/registerFight`, payload);
  const closeModal = async () => {
      setIsOpen(false);
  };

  const handleLocationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLocation(event.target.value);
  };

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDate(event.target.value);
  };

  return (
    <div>
      <Modal isOpen={isOpen} onRequestClose={closeModal}>
        <div className={s.modal}>
          <h2 className={s.header}>⚔️Challenger a Player⚔️</h2>
          <p>Search Opponent</p>
          <SelectSearch
            options={options}
            placeholder="Search Opponent"
            autoFocus
            className={s.selectSearch}
            search
            onChange={(value:any) => {
              setChallengedUser(value);
              console.log("Selected Value: ", value);
            }}
            getOptions={getOptions}
          />
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
          {/* <UploadButton
            endpoint="imageUploader"
            onClientUploadComplete={(res) => {
              console.log("Files: ", res);
              alert("Upload Completed");
            }}
            onUploadError={(error: Error) => {
              alert(`ERROR! ${error.message}`);
            }}
          /> */}
          <button className={s.button} onClick={closeModal}>Submit</button>

        </div>
      </Modal>
    </div>
  );
};

export default FightRequestModal;


