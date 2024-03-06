// TODO: Image of product and elaboration methods

import { Flex, Divider, Text, Stack, Input, Button } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { doc, runTransaction, serverTimestamp } from "firebase/firestore";
import { uniqueId } from "@/src/algorithms/uniqueId";
import { firestore } from "@/src/firebase/clientApp";
import { useRecoilState, useSetRecoilState } from "recoil";
import { TasksPreset } from "@/src/components/Types/Task";
import { Product } from "@/src/components/Types/Product";
import { productModalState } from "@/src/atoms/objectAtoms/productModalAtom";

type ProductInputsProps = {
  initialState: Product | undefined;
};

const ProductInputs: React.FC<ProductInputsProps> = ({ initialState }) => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [productState, setProductState] = useRecoilState(productModalState);

  const [newProduct, setNewProduct] = useState<Product>();

  useEffect(() => {
    productState.open &&
      setNewProduct(
        initialState ? initialState : ({ productId: uniqueId() } as Product)
      );
  }, [productState]);

  const onChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setNewProduct(
      (prev) =>
        ({
          ...prev,
          [event.target.name]: event.target.value,
        } as Product)
    );
  };

  const handleCreate = async () => {
    if (error) setError("");

    // Input errors
    if (!newProduct?.name && !newProduct?.alias) {
      setError("Cal introduir un nom de producte o alias");
      return;
    }

    // Set final parameters if new, or update createdAt
    setNewProduct(
      (prev) =>
        ({
          ...prev,
          createdAt: serverTimestamp(),
        } as Product)
    );

    setLoading(true);

    try {
      const productDocRef = doc(firestore, "products", newProduct.productId);
      await runTransaction(firestore, async (transaction) => {
        // Create product
        transaction.set(productDocRef, newProduct);

        setProductState((prev) => ({
          ...prev,
          open: false,
          context: newProduct,
          action: productState.action,
        }));
      });
      if (initialState) {
        console.log(`"${newProduct.name}" client successfuly modified`);
      } else {
        console.log(`"${newProduct.name}" client successfuly created`);
      }
    } catch (error: any) {
      console.log("handleCreate error", error);
      setError(error.message);
    }

    setLoading(false);

    // Cleanup
    setNewProduct({} as Product);
    setProductState((prev) => ({
      ...prev,
      context: undefined,
      action: undefined,
    }));
  };

  const handleClose = () => {
    setNewProduct({} as Product);
    setProductState((prev) => ({
      ...prev,
      open: false,
      action: undefined,
      context: undefined,
    }));
  };

  return (
    <>
      <Stack pr={2} width="100%">
        <Text fontSize="11pt" color="red.400" pt={1}>
          {error}
        </Text>
        <Flex align="center">
          <Text ml="auto" mr={3}>
            Nom:
          </Text>
          <Input
            name="name"
            autoFocus
            required
            type="text"
            width="75%"
            placeholder="Ex: Mejillón"
            onChange={onChange}
            value={newProduct?.name}
          />
        </Flex>
        <Flex align="center">
          <Text ml="auto" mr={3}>
            Alias:
          </Text>
          <Input
            name="alias"
            type="text"
            width="75%"
            placeholder="Ex: Musclo Mejillón Mussel Mytilidae"
            onChange={onChange}
            value={newProduct?.alias}
          />
        </Flex>
        <Flex align="center">
          <Text ml="auto" mr={3}>
            Codi producte:
          </Text>
          <Input
            name="codeName"
            type="text"
            width="75%"
            placeholder="Ex: M"
            onChange={onChange}
            value={newProduct?.codeName}
          />
        </Flex>
        <Flex align="center">
          <Text ml="auto" mr={3}>
            Tipus:
          </Text>
          <Input
            name="type"
            type="text"
            width="75%"
            placeholder="Marisc Bivalva"
            onChange={onChange}
            value={newProduct?.type}
          />
        </Flex>
        <Flex align="center">
          <Text ml="auto" mr={3}>
            Detalls:
          </Text>
          <Input
            name="details"
            type="text"
            width="75%"
            placeholder="Tal qual en bossa"
            onChange={onChange}
            value={newProduct?.details}
          />
        </Flex>

        <Divider />

        <Flex mt={2} justify="right" align="center">
          <Flex>
            <Button
              variant="outline"
              height="30px"
              mr={3}
              onClick={handleClose}
            >
              Cancel·la
            </Button>
            <Button
              height="30px"
              onClick={handleCreate} // handleCreate
              isLoading={loading}
            >
              {initialState ? "Modifica producte" : "Crear producte"}
            </Button>
          </Flex>
        </Flex>
      </Stack>
    </>
  );
};
export default ProductInputs;
