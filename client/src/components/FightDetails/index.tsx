import React, { use, useEffect } from 'react'
import Modal from '../Modal'

const FightDetails = ({modalOpen,closeModal,fightID}:{
    modalOpen: boolean;
    closeModal: () => void;
    fightID: string;
  }) => {
    useEffect(() => {
        console.log("HI")
    }, [])
  return (
    <Modal isOpen={modalOpen} onRequestClose={closeModal}>
    {fightID}
    </Modal>
    )
}

export default FightDetails