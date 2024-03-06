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
import { Provider } from "@/src/components/Types/AppUser";
import { useSetRecoilState } from "recoil";
import { providerModalState } from "@/src/atoms/objectAtoms/providerModalAtom";

type ProviderOptionsProps = {
  contextProvider: Provider;
};

const ProviderOptions: React.FC<ProviderOptionsProps> = ({
  contextProvider,
}) => {
  const [dupLoading, setDupLoading] = useState(false);
  const [delLoading, setDelLoading] = useState(false);

  const [provider, setProvider] = useState(contextProvider);
  const setProviderModal = useSetRecoilState(providerModalState);

  const [openConfirm, setOpenConfirm] = useState(false);
  const [confirmChoice, setConfirmChoice] = useState<undefined | boolean>(
    undefined
  );

  const duplicateProvider = async () => {
    const newId = uniqueId();
    setProvider((prev) => ({
      ...prev,
      providerId: newId,
    }));

    setDupLoading(true);
    try {
      const providerDocRef = doc(firestore, "providers", newId);

      await runTransaction(firestore, async (transaction) => {
        const providerDoc = await transaction.get(providerDocRef);
        if (providerDoc.exists()) {
          throw new Error(`Provider ja existent.`);
        }

        // Create provider
        transaction.set(providerDocRef, { ...provider, providerId: newId }); // Dunno why it won't update by using setProvider

        setProviderModal((prev) => ({
          ...prev,
          open: false,
          context: { ...provider, providerId: newId },
          action: "create",
        }));
      });
      console.log(`"${provider.name}" provider successfuly duplicated`);
    } catch (error: any) {
      console.log("handleCreate error", error);
    }
    setDupLoading(false);
  };

  useEffect(() => {
    if (confirmChoice) delProvider();
  }, [confirmChoice]);

  const delProvider = async () => {
    setConfirmChoice(false);
    setDelLoading(true);
    try {
      const providerDocRef = doc(firestore, "providers", provider.providerId);
      await deleteDoc(providerDocRef);

      setProviderModal((prev) => ({
        ...prev,
        open: false,
        action: "delete",
      }));

      console.log(`"${provider.name}" provider successfuly deleted`);
    } catch (error: any) {
      console.log("handleCreate error", error);
    }
    setDelLoading(false);
  };

  const handleClose = () => {
    setProviderModal((prev) => ({
      ...prev,
      open: false,
      action: undefined,
    }));
  };

  return (
    <>
      <ConfirmModal
        isOpen={openConfirm}
        message="Segur que vols eliminar el provider? No es podrà recuperar"
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
              <Button onClick={duplicateProvider} isLoading={dupLoading}>
                Duplica provider
              </Button>
              <Button
                color="red.400"
                onClick={() => setOpenConfirm(true)}
                isLoading={openConfirm}
              >
                Elimina provider
              </Button>
            </Stack>
          </PopoverBody>
        </PopoverContent>
      </Popover>
    </>
  );
};
export default ProviderOptions;
