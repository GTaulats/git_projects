import {
  Flex,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";

import { useRecoilState } from "recoil";
import { clientModalState } from "@/src/atoms/objectAtoms/clientModalAtom.ts";
import ClientInputs from "./Elements/ClientInputs.tsx";
import ClientOptions from "./Elements/ClientOptions.tsx";

const ClientModal: React.FC = () => {
  const [clientState, setClientState] = useRecoilState(clientModalState);

  const [error, setError] = useState<string>("");

  useEffect(() => {
    setError("");
  }, []);

  const handleClose = () => {
    setClientState((prev) => ({
      ...prev,
      open: false,
    }));
  };

  return (
    <>
      <Modal isOpen={clientState.open} onClose={handleClose} size="lg">
        <ModalOverlay bg="none" backdropFilter="auto" backdropBlur="2px" />
        <ModalContent
          pb={0}
          border="5px solid"
          borderColor="gray.300"
          borderRadius="10px"
        >
          <ModalHeader mt={1} mb={0} pb={0}>
            <Flex justify="space-between" align="center">
              <Flex align="center">
                <Text mr={2}>
                  {clientState.context === undefined
                    ? "Crea nou client"
                    : "Modifica client"}
                </Text>
                {clientState?.context?.clientId && (
                  <Text fontSize="10pt" color="gray.200">
                    {clientState?.context?.clientId}
                  </Text>
                )}
              </Flex>
              {clientState.context !== undefined && (
                <ClientOptions
                  setError={setError}
                  contextClient={clientState.context}
                />
              )}
            </Flex>
            <Text color="red.400" fontSize="12pt">
              {error}
            </Text>
          </ModalHeader>
          <ModalBody padding="5px 20px 15px 20px">
            <ClientInputs initialState={clientState.context} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
export default ClientModal;
