// Modal.tsx
import React, { ReactNode } from 'react';
import ReactModal from 'react-modal';
import s from "./Modal.module.scss";

interface ModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  children: ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onRequestClose, children }) => {
  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className={s.modalContent}
      overlayClassName={s.modalOverlay}
      ariaHideApp={false}
    >
      <button className={s.closeButton} onClick={onRequestClose}>X</button>
      {children}
    </ReactModal>
  );
};

export default Modal;
