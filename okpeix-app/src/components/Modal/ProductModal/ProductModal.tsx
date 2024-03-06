import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  Flex,
  ModalBody,
  Text,
} from "@chakra-ui/react";
import React from "react";
import ClientInputs from "../ClientModal/Elements/ClientInputs";
import ClientOptions from "../ClientModal/Elements/ClientOptions";
import { useRecoilState } from "recoil";
import { productModalState } from "@/src/atoms/objectAtoms/productModalAtom";
import ProductInputs from "./Elements/ProductInputs";
import ProductOptions from "./Elements/ProductOptions";

type ProductModalProps = {};

const ProductModal: React.FC<ProductModalProps> = () => {
  const [productState, setProductState] = useRecoilState(productModalState);

  const handleClose = () => {
    setProductState((prev) => ({
      ...prev,
      open: false,
      context: undefined,
      action: undefined,
    }));
  };
  // TODO: Mean weight/unit
  return (
    <>
      <Modal isOpen={productState.open} onClose={handleClose} size="xl">
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
                  {productState.context === undefined
                    ? "Crea nou producte"
                    : "Modifica producte"}
                </Text>
                {productState?.context?.productId && (
                  <Text fontSize="10pt" color="gray.200">
                    {productState?.context?.productId}
                  </Text>
                )}
              </Flex>
              {productState.context !== undefined && (
                <ProductOptions contextProduct={productState.context} />
              )}
            </Flex>
          </ModalHeader>
          <ModalBody padding="15px 20px">
            <ProductInputs initialState={productState.context} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
export default ProductModal;
