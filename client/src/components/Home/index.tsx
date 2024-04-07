"use client"
import React, { useState } from "react";
import Modal from "../Modal";
import s from "./Home.module.scss";
import { UploadButton } from "../../utils/uploadthing";
import axios from "axios";
import 'react-select-search/style.css'
import SelectSearch, { SelectSearchOption } from "react-select-search";

const Home1 = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<SelectSearchOption[]>([]);
  const [loading, setLoading] = useState(false);

  const debounce = (func, delay) => {
    let timer;
    return function (...args) {
      const context = this;
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        func.apply(context, args);
      }, delay);
    };
  };
  console.log("Home1")
  const getOptions = async (query: string) => {
    try {
      if (query.length < 3) return [];
      setLoading(true);
      const response = await axios.get(`http://localhost:8080/user`, {
        params: {
          username: query,
        },
      });
      const newOptions = response.data.usernames.map((user) => ({
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

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <div>
      <button onClick={openModal}>Open Modal</button>
      <Modal isOpen={isOpen} onRequestClose={closeModal}>
        <div className={s.modal}>
          <h2 className={s.header}>⚔️Challenger a Player⚔️</h2>
          <SelectSearch
            options={options}
            search
            loading={loading}
            onChange={(value) => {
              console.log("Selected Value: ", value);
            }}
            getOptions={debounce(getOptions, 300)}
          />
          <UploadButton
            endpoint="imageUploader"
            onClientUploadComplete={(res) => {
              console.log("Files: ", res);
              alert("Upload Completed");
            }}
            onUploadError={(error: Error) => {
              alert(`ERROR! ${error.message}`);
            }}
          />
        </div>
      </Modal>
    </div>
  );
};

export default Home1;
