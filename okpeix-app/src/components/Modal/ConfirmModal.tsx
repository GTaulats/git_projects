import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
} from "@chakra-ui/react";
import React, { useState } from "react";

type ConfirmModalProps = {
  isOpen: boolean;
  message: string;
  onClose: () => void;
  setChoice: (choice: boolean) => void;
};

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  message,
  onClose,
  setChoice,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalBody>{message}</ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={onClose}>
            Enrere
          </Button>
          <Button
            bg="unset"
            border="3px solid"
            borderColor="red.300"
            color="red.300"
            fontWeight={700}
            _hover={{ bg: "red.50" }}
            onClick={() => {
              setChoice(true);
            }}
          >
            Sí
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
export default ConfirmModal;
