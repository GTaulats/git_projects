import React, { useEffect, useState } from "react";
import { Button, Divider, Flex, Icon, Switch, Text } from "@chakra-ui/react";
import { Order } from "../../Types/Order";
import { Client } from "../../Types/AppUser";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  allClientsAtom,
  allProductsAtom,
  updatedAllClients,
} from "@/src/atoms/dataAtom";
import { findById, getDataArray } from "@/src/hooks/useGetData";
import { StoredProduct } from "../../Types/StoredProduct";
import { storedProductsListAtom } from "@/src/atoms/storedListAtom";
import { Task } from "../../Types/Task";
import { ordersListAtom } from "@/src/atoms/ordersListAtom";
import { firestore } from "@/src/firebase/clientApp";
import { doc, setDoc } from "firebase/firestore";
import { color } from "framer-motion";
import { TbClick } from "react-icons/tb";

type OrderElabElementProps = {
  order: Order;
};

const OrderElabElement: React.FC<OrderElabElementProps> = ({ order }) => {
  const allClients = useRecoilValue(allClientsAtom).allClients;
  const allProducts = useRecoilValue(allProductsAtom).allProducts;
  const allStored = useRecoilValue(storedProductsListAtom).storedProducts;

  const setOrdersListState = useSetRecoilState(ordersListAtom);

  const [targetClient, setTargetClient] = useState<Client | undefined>(
    order?.clientId
      ? (findById(allClients, "clientId", order.clientId) as unknown as Client)
      : undefined
  );

  const [orderShow, setOrderShow] = useState(true);

  const onTaskClick = (item: Task) => {
    // Replaces item in order.tasks by the new one
    const newTask = {
      ...item,
      readyElab: item.readyElab ? !item.readyElab : true,
    } as Task;

    const newOrder = {
      ...order,
      tasks: [
        ...order.tasks.filter((newTask) => {
          return !(newTask.taskId === item.taskId);
        }),
        newTask,
      ] as Task[],
    } as Order;

    // Update DB
    updateTaskDB(newOrder);
    // Update locally
    setOrdersListState((prev) => ({
      ...prev,
      orders: [
        ...prev.orders.filter((order) => {
          return !(order.orderId === newOrder.orderId);
        }),
        newOrder,
      ] as Order[],
    }));
  };

  const updateTaskDB = async (newOrder: Order) => {
    try {
      const orderDocRef = doc(firestore, "orders", order.orderId);
      await setDoc(orderDocRef, newOrder);
    } catch (error) {
      console.log("onTaskClick error:", error);
    }
  };

  const returnAssigSum = (task: Task) => {
    return task?.storedId?.reduce((total, storedId) => {
      // SP data from storedId
      const sp = allStored.find((sp) => {
        return sp.storedId === storedId;
      });
      // SP assigned data to task
      const assig = sp?.assigned?.find((assig) => {
        return assig.id === task.taskId;
      });
      return total + Number(assig?.amount?.value);
    }, 0);
  };

  return (
    <>
      <Flex
        // minWidth="250px"
        width={{ base: "100%", sm: "50%", md: "33.333%", xl: "25%" }}
        p={2}
        onClick={() => setOrderShow(!orderShow)}
      >
        <Flex
          width="100%"
          height="min-content"
          p={1}
          border="5px solid"
          borderColor="gray.300"
          borderRadius="10px"
          direction="column"
          shadow="1px 1px 4px gray"
          userSelect="none"
          cursor="pointer"
        >
          <Flex p={2} justify="space-between" align="center">
            <Text fontWeight={600} fontSize="14pt">
              {targetClient?.name}
            </Text>
            <Text color="gray.400" fontSize="10pt" mr={2}>
              {order?.deliverBy && String(order.deliverBy)}
            </Text>
          </Flex>
          <Divider borderColor="gray.500" />
          {orderShow && (
            <Flex direction="column">
              <Divider />
              <Flex direction="column">
                {order.tasks &&
                  order.tasks.map((item, index) => {
                    console.log("item", item);
                    if (item) {
                      const assignSum = returnAssigSum(item);
                      return (
                        <Flex
                          key={index}
                          minHeight="80px"
                          borderRadius={
                            index == order.tasks.length - 1
                              ? "0 0 6px 6px"
                              : "unset"
                          }
                          direction="column"
                          bg={
                            item.readyElab
                              ? "hsl(58, 97%, 87%)"
                              : "hsl(139, 73%, 87%)"
                          }
                          _hover={{
                            bg: item.readyElab
                              ? "hsl(58, 97%, 92%)"
                              : "hsl(139, 73%, 93%)",
                          }}
                          position="relative"
                          onClick={(
                            event: React.MouseEvent<HTMLDivElement, MouseEvent>
                          ) => {
                            event.stopPropagation();
                            onTaskClick(item);
                          }}
                        >
                          {index != 0 && (
                            <Divider
                              border="1px solid"
                              borderColor="gray.300"
                            />
                          )}
                          <Flex
                            p={2}
                            fontSize="14pt"
                            justify="space-between"
                            align="center"
                          >
                            {
                              allProducts.find((product) => {
                                return product.productId === item.productId;
                              })?.name
                            }
                            <Text
                              color={
                                assignSum == item.amount.value
                                  ? "green.300"
                                  : "yellow.500"
                              }
                            >
                              {assignSum}
                              {" / "}
                              {item.amount.value}
                              {item.amount.units}
                            </Text>
                          </Flex>
                          <Icon
                            as={TbClick}
                            position="absolute"
                            bottom="2px"
                            right="2px"
                            fontSize="10pt"
                            color="gray.500"
                          />
                          {item.details && (
                            <>
                              <Divider />
                              <Flex p={2}>Detalls: {item.details}</Flex>
                            </>
                          )}
                        </Flex>
                      );
                    }
                  })}
              </Flex>
              {order?.details && (
                <>
                  <Divider />
                  <Flex p={2} direction="column">
                    <Text fontWeight={600} mr={1}>
                      Detalls:
                    </Text>
                    <Text>{order.details}</Text>
                  </Flex>
                </>
              )}
            </Flex>
          )}
        </Flex>
      </Flex>
    </>
  );
};

export default OrderElabElement;
