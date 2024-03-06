import { Button, Flex, Icon, Spinner, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";

import { uniqueId } from "../../../algorithms/uniqueId.js";
import { Task } from "../../Types/Task.ts";
import { orderModalState } from "@/src/atoms/objectAtoms/orderModalAtom.ts";
import { firestore } from "@/src/firebase/clientApp.ts";
import { query, collection, getDocs } from "firebase/firestore";
import { Provider } from "../../Types/AppUser.ts";
import { dataReciever, getDataArray } from "@/src/hooks/useGetData.tsx";
import { allProvidersAtom, allProductsAtom } from "@/src/atoms/dataAtom.ts";
import { Product } from "../../Types/Product.ts";
import PurchaseElement from "./PurchaseElement.tsx";
import PurchaseModal from "../../Modal/PurchaseModal/PurchaseModal.tsx";
import { storedProductsListAtom } from "@/src/atoms/storedListAtom.ts";
import { purchaseModalState } from "@/src/atoms/objectAtoms/purchaseModalAtom.ts";
import { StoredProduct } from "../../Types/StoredProduct.ts";
import SortedPurchases from "./SortedPurchases.tsx";

type ToPurchaseViewProps = {};

const ToPurchaseView: React.FC<ToPurchaseViewProps> = () => {
  dataReciever();

  const allProviders = useRecoilValue(allProvidersAtom).allProviders;
  const allProducts = useRecoilValue(allProductsAtom).allProducts;

  const allPurchases = useRecoilValue(storedProductsListAtom).storedProducts;
  const [purchaseState, setPurchaseState] = useRecoilState(purchaseModalState); // purchase modal
  const setAllPurchases = useSetRecoilState(storedProductsListAtom);

  const [loadingPurchases, setLoadingPurchases] = useState(false);

  useEffect(() => {
    // When closing modal, updates local setProviders
    if (!purchaseState.open && purchaseState.context !== undefined) {
      const modifyIndex = allPurchases?.findIndex((item) => {
        return item.storedId === purchaseState.context!.storedId;
      });
      switch (purchaseState.action) {
        case "create":
          setAllPurchases((prev) => ({
            ...prev,
            purchases: [
              ...prev.storedProducts,
              purchaseState.context,
            ] as StoredProduct[],
          }));
          return;
        case "modify":
          if (modifyIndex! > -1) {
            setAllPurchases((prev) => ({
              ...prev,
              purchases: [
                ...prev.storedProducts.slice(0, modifyIndex),
                purchaseState.context,
                ...prev.storedProducts.slice(modifyIndex + 1),
              ] as StoredProduct[],
            }));
          }
          return;
        case "delete":
          if (modifyIndex! > -1) {
            setAllPurchases((prev) => ({
              ...prev,
              purchases: [
                ...prev.storedProducts.slice(0, modifyIndex),
                ...prev.storedProducts.slice(modifyIndex + 1),
              ] as StoredProduct[],
            }));
          }
          return;
      }
      setPurchaseState((prev) => ({
        ...prev,
        context: undefined,
        action: undefined,
      }));
    }
  }, [purchaseState.open]);

  // console.log("allPurchases", allPurchases);
  // console.log("allProviders", allProviders);
  // console.log("allProducts", allProducts);

  // TODO: Local update purchase deletions
  // TODO: Element rework

  return (
    <>
      {purchaseState.open && <PurchaseModal />}
      <Flex
        position="fixed"
        right="50px"
        bottom="50px"
        p="14px"
        borderRadius="20px"
        bg="white"
        align="center"
        shadow="2px 2px 10px gray"
        cursor="pointer"
        onClick={() => {
          setPurchaseState((prev) => ({
            ...prev,
            open: true,
            context: undefined,
            action: "create",
          }));
        }}
      >
        <Text fontSize="20pt" fontWeight={700} mr={2}>
          +
        </Text>
        <Text fontSize="15pt" fontWeight={700}>
          Nova compra
        </Text>
      </Flex>
      <Flex>
        {loadingPurchases ? (
          <Spinner />
        ) : (
          allPurchases &&
          allProviders.length !== 0 &&
          allProducts.length !== 0 && ( // Makes sure everything is set to proceed
            <>
              <SortedPurchases
                allProducts={allProducts}
                allProviders={allProviders}
                allPurchases={allPurchases}
              />
            </>
          )
        )}
      </Flex>
    </>
  );
};
export default ToPurchaseView;
