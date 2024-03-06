import { OrdersState } from "@/src/atoms/ordersAtom";
import { Button, Flex, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import { useRecoilState } from "recoil";
import MOrderInElement from "./OrderInElement.js";

import { uniqueId } from "../../../algorithms/uniqueId.js";
import { Task } from "../../Types/Task.js";
import { Order } from "../../Types/Order.js";

type InViewProps = {};

const InView: React.FC<InViewProps> = () => {
  const [ordersState, setOrdersState] = useRecoilState(OrdersState);

  const [openOrderModal, setOpenOrderModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<number | undefined>( // Stores the selected order's index
    undefined
  );

  // Generates random string for IDs

  const handleClose = () => {
    setOpenOrderModal(false);
    setSelectedOrder(undefined);
  };

  const onOrderClick = (item: number) => {
    setOpenOrderModal(true);
    setSelectedOrder(item);
  };

  const emptyOrder = {
    id: uniqueId(),
  } as Order;

  const emptyTask = {
    id: uniqueId(),
  } as Task;

  const createOrder = () => {
    setOrdersState((prev) => ({
      ...prev,
      orders: [...prev.orders, emptyOrder],
    }));
  };

  const delOrder = (index: number) => {
    setOrdersState((prev) => ({
      ...prev,
      orders: [...prev.orders.slice(0, index), ...prev.orders.slice(index + 1)],
    }));
  };

  const onOrderChange = (
    // Changes directly order's values
    event: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    let newOrder = ordersState.orders[index];
    newOrder = {
      ...newOrder,
      [event.target.name]: event.target.value,
    };
    setOrdersState((prev) => ({
      ...prev,
      orders: [
        ...prev.orders.slice(0, index),
        newOrder,
        ...prev.orders.slice(index + 1),
      ],
    }));
  };

  const createTask = (index: number) => {
    setOrdersState((prev) => ({
      ...prev,
      orders: [
        ...prev.orders.slice(0, index),
        {
          ...prev.orders[index],
          tasks: [...prev.orders[index].tasks, emptyTask],
        },
        ...prev.orders.slice(index + 1),
      ],
    }));
  };

  const onTaskChange = (
    // Changes directly order's task's values
    event: React.ChangeEvent<HTMLInputElement>,
    index: number,
    taskIndex: number
  ) => {
    setOrdersState((prev) => ({
      ...prev,
      orders: [
        ...prev.orders.slice(0, index),
        {
          ...prev.orders[index],
          tasks: [
            ...prev.orders[index].tasks.slice(0, taskIndex),
            {
              ...prev.orders[index].tasks[taskIndex],
              [event.target.name]: event.target.value,
            },
            ...prev.orders[index].tasks.slice(taskIndex + 1),
          ],
        },
        ...prev.orders.slice(index + 1),
      ],
    }));
  };

  // Duplicates task, placing it just under  NOW THAT WE MODIFY ORDER, UNIQUE KEYS ARE A MUST
  const copyTask = (index: number, taskIndex: number) => {
    setOrdersState((prev) => ({
      ...prev,
      orders: [
        ...prev.orders.slice(0, index),
        {
          ...prev.orders[index],
          tasks: [
            ...prev.orders[index].tasks.slice(0, taskIndex),
            prev.orders[index].tasks[taskIndex],
            ...prev.orders[index].tasks.slice(taskIndex),
          ],
        },
        ...prev.orders.slice(index + 1),
      ],
    }));
  };

  // Deletes task
  const delTask = (index: number, taskIndex: number) => {
    setOrdersState((prev) => ({
      ...prev,
      orders: [
        ...prev.orders.slice(0, index),
        {
          ...prev.orders[index],
          tasks: [
            ...prev.orders[index].tasks.slice(0, taskIndex),
            ...prev.orders[index].tasks.slice(taskIndex + 1),
          ],
        },
        ...prev.orders.slice(index + 1),
      ],
    }));
  };

  return (
    <>
      {/* <SubmitOrderModal
        open={openOrderModal}
        handleClose={handleClose}
        selectedOrder={selectedOrder}
      /> */}
      {/* <Button
        position="fixed"
        bottom="10%"
        right="5%"
        borderRadius="25px"
        height="50px"
        onClick={() => setOpenOrderModal(true)}
      >
        <Flex align="center" pb={1} justify="center">
          <Text mr={2}>Nova tasca</Text>
          <Text pb="1px" fontSize={28}>
            +
          </Text>
        </Flex>
      </Button> */}
      <Flex direction="column" p="4px" overflow="auto">
        <Flex onClick={createOrder}>Crea comanda</Flex>
        {ordersState.orders?.length !== 0 &&
          ordersState.orders?.map((item, index) => (
            <MOrderInElement
              key={item.id}
              item={item}
              index={index} // To trigger rerendering when changing order
              onClick={() => onOrderClick(index)}
              delOrder={() => delOrder(index)}
              onOrderChange={(event) => onOrderChange(event, index)}
              onTaskChange={(event, taskIndex) =>
                onTaskChange(event, index, taskIndex)
              }
              createTask={() => createTask(index)}
              copyTask={(taskIndex) => copyTask(index, taskIndex)}
              delTask={(taskIndex) => delTask(index, taskIndex)}
            />
          ))}
      </Flex>
    </>
  );
};
export default InView;
