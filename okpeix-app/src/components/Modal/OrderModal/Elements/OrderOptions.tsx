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
import { orderModalState } from "@/src/atoms/objectAtoms/orderModalAtom";
import { Order } from "@/src/components/Types/Order";

type OrderOptionsProps = {
  context: Order;
};

const OrderOptions: React.FC<OrderOptionsProps> = ({ context }) => {
  const [dupLoading, setDupLoading] = useState(false);
  const [delLoading, setDelLoading] = useState(false);

  const [order, setOrder] = useState(context);
  const setOrderModal = useSetRecoilState(orderModalState);

  const [openConfirm, setOpenConfirm] = useState(false);
  const [confirmChoice, setConfirmChoice] = useState<undefined | boolean>(
    undefined
  );

  const duplicateOrder = async () => {
    const newId = uniqueId();
    setOrder((prev) => ({
      ...prev,
      orderId: newId,
    }));

    setDupLoading(true);
    try {
      const orderDocRef = doc(firestore, "orders", newId);

      await runTransaction(firestore, async (transaction) => {
        const orderDoc = await transaction.get(orderDocRef);
        if (orderDoc.exists()) {
          throw new Error(`Comanda ja existent.`);
        }

        // Create order
        transaction.set(orderDocRef, { ...order, orderId: newId }); // Dunno why it won't update by using setOrder's value

        setOrderModal((prev) => ({
          ...prev,
          open: false,
          context: { ...order, orderId: newId },
          action: "create",
        }));
      });
      console.log(`"${order.orderId}" order successfuly duplicated`);
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
      const orderDocRef = doc(firestore, "orders", order.orderId);
      await deleteDoc(orderDocRef);

      setOrderModal((prev) => ({
        ...prev,
        open: false,
        action: "delete",
      }));

      console.log(`"${order.orderId}" order successfuly deleted`);
    } catch (error: any) {
      console.log("handleCreate error", error);
    }
    setDelLoading(false);
  };

  const handleClose = () => {
    setOrderModal((prev) => ({
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
          context?.clientId === context?.creatorId // Tells user that it was created by the client
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
