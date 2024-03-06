import {
  Flex,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import React from "react";

import { useRecoilState } from "recoil";
import { providerModalState } from "@/src/atoms/objectAtoms/providerModalAtom.ts";
import ProviderInputs from "./Elements/ProviderInputs.tsx";
import ProviderOptions from "./Elements/ProviderOptions.tsx";

const ProviderModal: React.FC = () => {
  const [providerState, setProviderState] = useRecoilState(providerModalState);

  const handleClose = () => {
    setProviderState((prev) => ({
      ...prev,
      open: false,
    }));
  };

  return (
    <>
      <Modal isOpen={providerState.open} onClose={handleClose} size="lg">
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
                  {providerState.context === undefined
                    ? "Crea nou proveïdor"
                    : "Modifica proveïdor"}
                </Text>
                {providerState?.context?.providerId && (
                  <Text fontSize="10pt" color="gray.200">
                    {providerState?.context?.providerId}
                  </Text>
                )}
              </Flex>
              {providerState.context !== undefined && (
                <ProviderOptions contextProvider={providerState.context} />
              )}
            </Flex>
          </ModalHeader>
          <ModalBody padding="5px 20px 15px 20px">
            <ProviderInputs initialState={providerState.context} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
export default ProviderModal;
