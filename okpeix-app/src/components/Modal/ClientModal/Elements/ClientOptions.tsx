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
import { Client } from "@/src/components/Types/AppUser";
import { useSetRecoilState } from "recoil";
import { clientModalState } from "@/src/atoms/objectAtoms/clientModalAtom";

type ClientOptionsProps = {
  contextClient: Client;
};

const ClientOptions: React.FC<ClientOptionsProps> = ({ contextClient }) => {
  const [dupLoading, setDupLoading] = useState(false);
  const [delLoading, setDelLoading] = useState(false);

  const [client, setClient] = useState<Client>(contextClient as Client);
  const setClientModal = useSetRecoilState(clientModalState);

  const [openConfirm, setOpenConfirm] = useState(false);
  const [confirmChoice, setConfirmChoice] = useState<undefined | boolean>(
    undefined
  );

  const duplicateClient = async () => {
    const newId = uniqueId();
    setClient((prev) => ({
      ...prev,
      clientId: newId,
    }));

    setDupLoading(true);
    try {
      const clientDocRef = doc(firestore, "clients", newId);

      await runTransaction(firestore, async (transaction) => {
        const clientDoc = await transaction.get(clientDocRef);
        if (clientDoc.exists()) {
          throw new Error(`Client ja existent.`);
        }

        // Create client
        transaction.set(clientDocRef, { ...client, clientId: newId }); // Dunno why it won't update by using setClient

        setClientModal((prev) => ({
          ...prev,
          open: false,
          context: { ...client, clientId: newId },
          action: "create",
        }));
      });
      console.log(`"${client.name}" client successfuly duplicated`);
    } catch (error: any) {
      console.log("handleCreate error", error);
    }
    setDupLoading(false);
  };

  useEffect(() => {
    if (confirmChoice) delClient();
  }, [confirmChoice]);

  const delClient = async () => {
    setConfirmChoice(false);
    setDelLoading(true);
    try {
      const clientDocRef = doc(firestore, "clients", client.clientId);
      await deleteDoc(clientDocRef);

      setClientModal((prev) => ({
        ...prev,
        open: false,
        action: "delete",
      }));

      console.log(`"${client.name}" client successfuly deleted`);
    } catch (error: any) {
      console.log("handleCreate error", error);
    }
    setDelLoading(false);
  };

  const handleClose = () => {
    setClientModal((prev) => ({
      ...prev,
      open: false,
      action: undefined,
    }));
  };

  return (
    <>
      {openConfirm && (
        <ConfirmModal
          isOpen={openConfirm}
          message="Segur que vols eliminar el client? No es podrà recuperar"
          onClose={() => {
            setOpenConfirm(false);
          }}
          setChoice={(choice: boolean) => {
            setConfirmChoice(choice);
          }}
        />
      )}
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
              <Button onClick={duplicateClient} isLoading={dupLoading}>
                Duplica client
              </Button>
              <Button
                color="red.400"
                onClick={() => setOpenConfirm(true)}
                isLoading={openConfirm}
              >
                Elimina client
              </Button>
            </Stack>
          </PopoverBody>
        </PopoverContent>
      </Popover>
    </>
  );
};
export default ClientOptions;
