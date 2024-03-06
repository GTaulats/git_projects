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
import { purchaseModalState } from "@/src/atoms/objectAtoms/purchaseModalAtom";
import { StoredProduct } from "@/src/components/Types/StoredProduct";

type OrderOptionsProps = {
  context: StoredProduct;
};

const OrderOptions: React.FC<OrderOptionsProps> = ({ context }) => {
  const [dupLoading, setDupLoading] = useState(false);
  const [delLoading, setDelLoading] = useState(false);

  const [purchase, setPurchase] = useState(context);
  const setPurchaseModal = useSetRecoilState(purchaseModalState);

  const [openConfirm, setOpenConfirm] = useState(false);
  const [confirmChoice, setConfirmChoice] = useState<undefined | boolean>(
    undefined
  );

  const duplicateOrder = async () => {
    const newId = uniqueId();
    setPurchase(
      (prev) =>
        ({
          ...prev,
          storedId: newId,
        } as StoredProduct)
    );

    setDupLoading(true);
    try {
      const purchaseDocRef = doc(firestore, "storage", newId);

      await runTransaction(firestore, async (transaction) => {
        const purchaseDoc = await transaction.get(purchaseDocRef);
        if (purchaseDoc.exists()) {
          throw new Error(`Comanda ja existent.`);
        }

        // Create purchase
        transaction.set(purchaseDocRef, { ...purchase, storedId: newId }); // Dunno why it won't update by using setPurchase's value

        setPurchaseModal((prev) => ({
          ...prev,
          open: false,
          context: { ...purchase, storedId: newId },
          action: "create",
        }));
      });
      console.log(`"${purchase.storedId}" purchase successfuly duplicated`);
    } catch (error: any) {
      console.log("handleCreateOrder error", error);
    }
    setDupLoading(false);
  };

  useEffect(() => {
    if (confirmChoice) delOrder();
  }, [confirmChoice]);

  const delOrder = async () => {
    setConfirmChoice(false);
    setDelLoading(true);
    try {
      const purchaseDocRef = doc(firestore, "storage", purchase.storedId);
      await deleteDoc(purchaseDocRef);

      setPurchaseModal((prev) => ({
        ...prev,
        open: false,
        action: "delete",
      }));

      console.log(`"${purchase.storedId}" purchase successfuly deleted`);
    } catch (error: any) {
      console.log("handleCreate error", error);
    }
    setDelLoading(false);
  };

  const handleClose = () => {
    setPurchaseModal((prev) => ({
      ...prev,
      open: false,
      action: undefined,
    }));
  };

  return (
    <>
      <ConfirmModal
        isOpen={openConfirm}
        message={
          context?.providerId === context?.creatorId // Tells user that it was created by the client
            ? "Aquesta comanda la va crear el propi client. Segur que vols eliminar aquesta comanda? No es podrà recuperar."
            : "Segur que vols eliminar aquesta comanda? No es podrà recuperar."
        }
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
              <Button onClick={duplicateOrder} isLoading={dupLoading}>
                Duplica comanda
              </Button>
              <Button
                color="red.400"
                onClick={() => setOpenConfirm(true)}
                isLoading={delLoading}
              >
                Elimina comanda
              </Button>
            </Stack>
          </PopoverBody>
        </PopoverContent>
      </Popover>
    </>
  );
};
export default OrderOptions;
