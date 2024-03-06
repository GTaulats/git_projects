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
import { elaborationModalState } from "@/src/atoms/objectAtoms/elaborationModalAtom.ts";
import ElaborationInputs from "./Elements/ElaborationInputs.tsx";
import ElaborationOptions from "./Elements/ElaborationOptions.tsx";

const ElaborationModal: React.FC = () => {
  const [elaborationState, setElaborationState] = useRecoilState(
    elaborationModalState
  );

  const handleClose = () => {
    setElaborationState((prev) => ({
      ...prev,
      open: false,
    }));
  };

  return (
    <>
      <Modal isOpen={elaborationState.open} onClose={handleClose} size="lg">
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
                  {elaborationState.context === undefined
                    ? "Crea nova elaboració"
                    : "Modifica elaboració"}
                </Text>
                {elaborationState?.context?.elaborationId && (
                  <Text fontSize="10pt" color="gray.200">
                    {elaborationState?.context?.elaborationId}
                  </Text>
                )}
              </Flex>
              {elaborationState.context !== undefined && (
                <ElaborationOptions
                  contextElaboration={elaborationState.context}
                />
              )}
            </Flex>
          </ModalHeader>
          <ModalBody padding="5px 20px 15px 20px">
            <ElaborationInputs initialState={elaborationState.context} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
export default ElaborationModal;
