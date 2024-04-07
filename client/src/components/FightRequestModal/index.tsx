"use client"
import React, { useState } from "react";
import Modal from "../Modal";
import { UploadButton } from "../../utils/uploadthing"

const FightRequestModal = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const openModal = () => {
      setIsOpen(true);
    };
  
    const closeModal = () => {
      setIsOpen(false);
    };
  return (
    <Modal isOpen = {isOpen} onRequestClose={closeModal}>
      <div>
        Hi
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
  );
};

export default FightRequestModal;
