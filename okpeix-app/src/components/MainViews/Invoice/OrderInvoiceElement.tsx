import React, { useEffect, useState } from "react";
import { Button, Divider, Flex, Switch, Text } from "@chakra-ui/react";
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

type OrderInvoiceElementProps = {
  order: Order;
  onClick: () => void;
};

const OrderInvoiceElement: React.FC<OrderInvoiceElementProps> = ({
  order,
  onClick,
}) => {
  const allClients = useRecoilValue(allClientsAtom).allClients;
  const allProducts = useRecoilValue(allProductsAtom).allProducts;
  const allStored = useRecoilValue(storedProductsListAtom).storedProducts;

  const [targetClient, setTargetClient] = useState<Client | undefined>(
    order?.clientId
      ? (findById(allClients, "clientId", order.clientId) as unknown as Client)
      : undefined
  );

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
        width={{ base: "100%", sm: "50%", md: "33.333%", xl: "25%" }}
        p={2}
        onClick={onClick}
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
          cursor="pointer"
          _hover={{ borderColor: "gray.100" }}
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
          <Flex direction="column">
            <Divider />
            <Flex direction="column">
              {order.tasks &&
                order.tasks.map((item, index) => {
                  if (item) {
                    const assignSum = returnAssigSum(item);
                    return (
                      <Flex key={index} direction="column">
                        <Divider />
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
        </Flex>
      </Flex>
    </>
  );
};

export default OrderInvoiceElement;
