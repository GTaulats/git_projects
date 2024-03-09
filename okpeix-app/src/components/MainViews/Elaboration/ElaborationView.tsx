import { ordersListAtom } from "@/src/atoms/ordersListAtom.ts";
import { Button, Flex, Icon, Spinner, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";

import { uniqueId } from "../../../algorithms/uniqueId.js";
import { Task } from "../../Types/Task.ts";
import { Order } from "../../Types/Order.ts";
import OrderModal from "../../Modal/OrderModal/OrderModal.tsx";
import { orderModalState } from "@/src/atoms/objectAtoms/orderModalAtom.ts";
import { firestore } from "@/src/firebase/clientApp.ts";
import { query, collection, getDocs } from "firebase/firestore";
import { Client, Provider } from "../../Types/AppUser.ts";
import OrderInvoiceElement from "./OrderElabElement.tsx";
import { allClientsAtom, allProductsAtom } from "@/src/atoms/dataAtom.ts";
import { Product } from "../../Types/Product.ts";
import { storedProductsListAtom } from "@/src/atoms/storedListAtom.ts";
import OrderElabElement from "./OrderElabElement.tsx";
import { dataReciever } from "@/src/hooks/useGetData.tsx";

type ElaborationViewProps = {};

const ElaborationView: React.FC<ElaborationViewProps> = () => {
  dataReciever(); // Updates all recoli state values from DB

  const allClients = useRecoilValue(allClientsAtom).allClients;
  const allProducts = useRecoilValue(allProductsAtom).allProducts;

  const [ordersListState, setOrdersListState] = useRecoilState(ordersListAtom);

  const [loadingOrders, setLoadingOrders] = useState(false);

  // useEffect(() => {
  //   // When closing modal, updates local setClients
  //   if (!orderState.open && orderState.context !== undefined) {
  //     console.log("orderState", orderState);
  //     const modifyIndex = ordersListState?.orders?.findIndex((item) => {
  //       return item.orderId === orderState.context!.orderId;
  //     });
  //     switch (orderState.action) {
  //       case "create":
  //         setOrdersListState((prev) => ({
  //           ...prev,
  //           orders: [...prev.orders, orderState.context] as Order[],
  //         }));
  //         return;
  //       case "modify":
  //         if (modifyIndex! > -1) {
  //           setOrdersListState((prev) => ({
  //             ...prev,
  //             orders: [
  //               ...prev.orders.slice(0, modifyIndex),
  //               orderState.context,
  //               ...prev.orders.slice(modifyIndex + 1),
  //             ] as Order[],
  //           }));
  //         }
  //         return;
  //       case "delete":
  //         if (modifyIndex! > -1) {
  //           setOrdersListState((prev) => ({
  //             ...prev,
  //             orders: [
  //               ...prev.orders.slice(0, modifyIndex),
  //               ...prev.orders.slice(modifyIndex + 1),
  //             ] as Order[],
  //           }));
  //         }
  //         return;
  //     }
  //     setOrderState((prev) => ({
  //       ...prev,
  //       context: undefined,
  //       action: undefined,
  //     }));
  //   }
  // }, [orderState.open]);

  // const getOrders = async () => {
  //   //TODO: USE CUSTOM HOOK
  //   setLoadingOrders(true);
  //   try {
  //     const queryRef = query(collection(firestore, "orders"));
  //     const orderDocs = await getDocs(queryRef);
  //     const orders = orderDocs.docs.map((doc) => ({
  //       orderId: doc.id,
  //       ...doc.data(),
  //     }));
  //     setOrdersListState((prev) => ({
  //       ...prev,
  //       orders: orders as Order[],
  //     }));
  //   } catch (error) {}
  //   setLoadingOrders(false);
  // };

  // useEffect(() => {
  //   getOrders();
  // }, []);

  // console.log("invoice", ordersListState);
  // console.log("allClients", allClients);
  // console.log("allProducts", allProducts);

  // TODO: Sort clients, or at least avoid to change order when confirming elaboration
  // TODO: Same with tasks...

  return (
    <>
      <Flex flexWrap="wrap">
        {loadingOrders ? (
          <Spinner />
        ) : (
          ordersListState?.orders &&
          allClients.length !== 0 &&
          allProducts.length !== 0 &&
          ordersListState.orders.map((item, index) => {
            // console.log("item", item);
            return <OrderElabElement key={item.orderId} order={item} />;
          })
        )}
      </Flex>
    </>
  );
};
export default ElaborationView;
