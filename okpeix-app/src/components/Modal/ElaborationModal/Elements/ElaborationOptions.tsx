import {
  Button,
  Flex,
  Icon,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Stack,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import ConfirmModal from "../../ConfirmModal";
import { firestore } from "@/src/firebase/clientApp";
import { deleteDoc, doc, runTransaction } from "firebase/firestore";
import { uniqueId } from "@/src/algorithms/uniqueId";
import { useSetRecoilState } from "recoil";
import { elaborationModalState } from "@/src/atoms/objectAtoms/elaborationModalAtom";
import { Elaboration } from "@/src/components/Types/Elaboration";

type ElaborationOptionsProps = {
  contextElaboration: Elaboration;
};

const ElaborationOptions: React.FC<ElaborationOptionsProps> = ({
  contextElaboration,
}) => {
  const [dupLoading, setDupLoading] = useState(false);
  const [delLoading, setDelLoading] = useState(false);

  const [elaboration, setElaboration] = useState(contextElaboration);
  const setElaborationModal = useSetRecoilState(elaborationModalState);

  const [openConfirm, setOpenConfirm] = useState(false);
  const [confirmChoice, setConfirmChoice] = useState<undefined | boolean>(
    undefined
  );

  const duplicateElaboration = async () => {
    const newId = uniqueId();
    setElaboration((prev) => ({
      ...prev,
      elaborationId: newId,
    }));

    setDupLoading(true);
    try {
      const elaborationDocRef = doc(firestore, "elaborations", newId);

      await runTransaction(firestore, async (transaction) => {
        const elaborationDoc = await transaction.get(elaborationDocRef);
        if (elaborationDoc.exists()) {
          throw new Error(`Elaboration ja existent.`);
        }

        // Create elaboration
        transaction.set(elaborationDocRef, {
          ...elaboration,
          elaborationId: newId,
        }); // Dunno why it won't update by using setElaboration

        setElaborationModal((prev) => ({
          ...prev,
          open: false,
          context: { ...elaboration, elaborationId: newId },
          action: "create",
        }));
      });
      console.log(`"${elaboration.name}" elaboration successfuly duplicated`);
    } catch (error: any) {
      console.log("handleCreate error", error);
    }
    setDupLoading(false);
  };

  useEffect(() => {
    if (confirmChoice) delElaboration();
  }, [confirmChoice]);

  const delElaboration = async () => {
    setConfirmChoice(false);
    setDelLoading(true);
    try {
      const elaborationDocRef = doc(
        firestore,
        "elaborations",
        elaboration.elaborationId
      );
      await deleteDoc(elaborationDocRef);

      setElaborationModal((prev) => ({
        ...prev,
        open: false,
        action: "delete",
      }));

      console.log(`"${elaboration.name}" elaboration successfuly deleted`);
    } catch (error: any) {
      console.log("handleCreate error", error);
    }
    setDelLoading(false);
  };

  const handleClose = () => {
    setElaborationModal((prev) => ({
      ...prev,
      open: false,
      action: undefined,
    }));
  };

  return (
    <>
      <ConfirmModal
        isOpen={openConfirm}
        message="Segur que vols eliminar el elaboration? No es podrà recuperar"
        onClose={() => {
          setOpenConfirm(false);
        }}
        setChoice={(choice: boolean) => {
          setConfirmChoice(choice);
        }}
      />
      <Popover>
        <PopoverTrigger>
          <Flex
            borderRadius="full"
            p="7px"
            height="min-content"
            width="min-content"
            align="center"
            m="auto 0"
            mr={2}
            cursor="pointer"
            _hover={{ bg: "gray.100" }}
          >
            <Icon as={BsThreeDots} />
          </Flex>
        </PopoverTrigger>
        <PopoverContent height="min-content" width="min-content">
          <PopoverArrow />
          <PopoverBody>
            <Stack>
              <Button onClick={duplicateElaboration} isLoading={dupLoading}>
                Duplica elaboration
              </Button>
              <Button
                color="red.400"
                onClick={() => setOpenConfirm(true)}
                isLoading={openConfirm}
              >
                Elimina elaboration
              </Button>
            </Stack>
          </PopoverBody>
        </PopoverContent>
      </Popover>
    </>
  );
};
export default ElaborationOptions;
