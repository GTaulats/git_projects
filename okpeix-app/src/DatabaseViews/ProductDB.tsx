import React, { useEffect, useState } from "react";
import ProductModal from "../components/Modal/ProductModal/ProductModal";
import { Flex, Button, Spinner } from "@chakra-ui/react";
import ClientElement from "../components/Database/ClientElement";
import { productModalState } from "../atoms/objectAtoms/productModalAtom";
import { useRecoilState } from "recoil";
// import ProductElement from "../components/Database/ProductElement";
import { query, collection, getDocs, orderBy } from "firebase/firestore";
import { firestore } from "../firebase/clientApp";
import { Product } from "../components/Types/Product";
import ProductElement from "../components/Database/ProductElement";

type ProductDBProps = {};

const ProductDB: React.FC<ProductDBProps> = () => {
  const [loading, setLoading] = useState(false);

  const [productState, setProductState] = useRecoilState(productModalState);

  const [products, setProducts] = useState([] as Product[]); //Retrieved data from DB

  useEffect(() => {
    // When closing modal, updates local setClients
    if (!productState.open && productState.context !== undefined) {
      const modifyIndex = products?.findIndex((item) => {
        return item.productId === productState?.context?.productId;
      });
      switch (productState.action) {
        case "create":
          setProducts((prev) => [...prev, productState.context] as Product[]);
          return;
        case "modify":
          if (modifyIndex! > -1) {
            setProducts(
              (prev) =>
                [
                  ...prev.slice(0, modifyIndex),
                  productState.context,
                  ...prev.slice(modifyIndex + 1),
                ] as Product[]
            );
          }
          return;
        case "delete":
          if (modifyIndex! > -1) {
            setProducts(
              (prev) =>
                [
                  ...prev.slice(0, modifyIndex),
                  ...prev.slice(modifyIndex + 1),
                ] as Product[]
            );
          }
          return;
      }
      setProductState((prev) => ({
        ...prev,
        context: undefined,
        action: undefined,
      }));
    }
  }, [productState.open]);

  const getProducts = async () => {
    setLoading(true);
    try {
      const queryRef = query(
        collection(firestore, "products"),
        orderBy("name", "asc")
      );
      const productDocs = await getDocs(queryRef);
      const products = productDocs.docs.map((doc) => ({
        productId: doc.id,
        ...doc.data(),
      }));
      setProducts(products as Product[]);
    } catch (error) {
      console.log("getProducts error: ", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    getProducts();
  }, []);

  const onClick = (item: Product) => {
    setProductState((prev) => ({
      ...prev,
      open: true,
      context: item,
      action: "modify",
    }));
  };

  return (
    <>
      <ProductModal />
      <Flex direction="column" align="center" width="100%" height="100%">
        <Button
          onClick={() =>
            setProductState((prev) => ({
              ...prev,
              open: true,
              context: undefined,
              action: "create",
            }))
          }
        >
          Crea nou producte
        </Button>
        <Flex p={2} width="100%" height="650px">
          <Flex
            flexWrap="wrap"
            width="100%"
            height="100%"
            border="1px solid black"
            overflow="auto"
          >
            {loading ? (
              <Spinner />
            ) : (
              <>
                {/* All product info is stored inside */}
                {products.map((item) => {
                  return (
                    <ProductElement
                      key={item.productId}
                      product={item}
                      onClick={() => onClick(item)}
                    />
                  );
                })}
              </>
            )}
          </Flex>
        </Flex>
      </Flex>
    </>
  );
};
export default ProductDB;
