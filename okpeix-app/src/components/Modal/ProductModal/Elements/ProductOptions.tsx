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
import { Product } from "@/src/components/Types/Product";
import { productModalState } from "@/src/atoms/objectAtoms/productModalAtom";

type ProductOptionsProps = {
  contextProduct: Product;
};

const ProductOptions: React.FC<ProductOptionsProps> = ({ contextProduct }) => {
  const [dupLoading, setDupLoading] = useState(false);
  const [delLoading, setDelLoading] = useState(false);

  const [product, setProduct] = useState(contextProduct);
  const setProductModal = useSetRecoilState(productModalState);

  const [openConfirm, setOpenConfirm] = useState(false);
  const [confirmChoice, setConfirmChoice] = useState<undefined | boolean>(
    undefined
  );

  const duplicateProduct = async () => {
    const newId = uniqueId();
    setProduct((prev) => ({
      ...prev,
      productId: newId,
    }));

    setDupLoading(true);
    try {
      const productDocRef = doc(firestore, "products", newId);

      await runTransaction(firestore, async (transaction) => {
        const productDoc = await transaction.get(productDocRef);
        if (productDoc.exists()) {
          throw new Error(`Producte ja existent.`);
        }

        // Create product
        transaction.set(productDocRef, { ...product, productId: newId }); // Dunno why it won't update by using setProduct

        setProductModal((prev) => ({
          ...prev,
          open: false,
          context: { ...product, productId: newId },
          action: "create",
        }));
      });
      console.log(`"${product.name}" product successfuly duplicated`);
    } catch (error: any) {
      console.log("handleCreate error", error);
    }
    setDupLoading(false);
  };

  useEffect(() => {
    if (confirmChoice) delProduct();
  }, [confirmChoice]);

  const delProduct = async () => {
    setConfirmChoice(false);
    setDelLoading(true);
    try {
      const productDocRef = doc(firestore, "products", product.productId);
      await deleteDoc(productDocRef);

      setProductModal((prev) => ({
        ...prev,
        open: false,
        action: "delete",
      }));

      console.log(`"${product.name}" product successfuly deleted`);
    } catch (error: any) {
      console.log("handleCreate error", error);
    }
    setDelLoading(false);
  };

  const handleClose = () => {
    setProductModal((prev) => ({
      ...prev,
      open: false,
      action: undefined,
    }));
  };

  return (
    <>
      <ConfirmModal
        isOpen={openConfirm}
        message="Segur que vols eliminar el producte? No es podrà recuperar"
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
              <Button onClick={duplicateProduct} isLoading={dupLoading}>
                Duplica producte
              </Button>
              <Button
                color="red.400"
                onClick={() => setOpenConfirm(true)}
                isLoading={openConfirm}
              >
                Elimina producte
              </Button>
            </Stack>
          </PopoverBody>
        </PopoverContent>
      </Popover>
    </>
  );
};
export default ProductOptions;
