import { taskModalState } from "@/src/atoms/objectAtoms/taskModalAtom";
import {
  Box,
  Button,
  Divider,
  Flex,
  Icon,
  Input,
  Menu,
  MenuItem,
  MenuList,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Portal,
  Select,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { Task } from "../../Types/Task";
import { uniqueId } from "@/src/algorithms/uniqueId";
import { Product } from "../../Types/Product";
import { firestore } from "@/src/firebase/clientApp";
import { query, collection, getDocs } from "firebase/firestore";
import { fuzzySearch } from "../../../algorithms/fuzzySearch.js";
import { RxCross2 } from "react-icons/rx";
import ProductModal from "../ProductModal/ProductModal.tsx";
import { productModalState } from "@/src/atoms/objectAtoms/productModalAtom";
import { allProductsAtom, allProvidersAtom } from "@/src/atoms/dataAtom.ts";
import { findById } from "@/src/hooks/useGetData.tsx";
import { storedProductsListAtom } from "@/src/atoms/storedListAtom.ts";
import { StoredProduct } from "../../Types/StoredProduct.ts";
import { storedModalState } from "@/src/atoms/objectAtoms/storedModalAtom.ts";
import PurchaseModal from "../PurchaseModal/PurchaseModal.tsx";
import ProductSelector from "./Elements/ProductSelector.tsx";
import StoredSelector from "./Elements/StoredSelector.tsx";
import { purchaseModalState } from "@/src/atoms/objectAtoms/purchaseModalAtom.ts";
import { orderModalState } from "@/src/atoms/objectAtoms/orderModalAtom.ts";

const TaskModal: React.FC = () => {
  const orderState = useRecoilValue(orderModalState); // For purchase's client

  const [taskState, setTaskState] = useRecoilState(taskModalState);

  const [newTask, setNewTask] = useState<Task>(taskState.context as Task);
  console.log("newestTask", newTask);
  const [newAllStored, setNewAllStored] = useState<StoredProduct[]>(
    taskState.newAllStored ? taskState.newAllStored : ([] as StoredProduct[])
  );

  const [targetProduct, setTargetProduct] = useState<Product>();
  const [targetStored, setTargetStored] = useState<StoredProduct[]>([]);

  const allProducts = useRecoilValue(allProductsAtom).allProducts;
  const allProviders = useRecoilValue(allProvidersAtom).allProviders;
  // allStored are modified upon newOrder submition. Inside tasks, it's used a temporal newAllStored.

  useEffect(() => {
    setError("");
    if (taskState.open) {
      if (taskState.newAllStored) {
        setNewAllStored(taskState.newAllStored);
      }
      // console.log("wtf");
      if (taskState.context !== undefined) {
        setNewTask(taskState.context as Task);
        taskState?.context?.productId
          ? setTargetProduct(
              findById(
                allProducts,
                "productId",
                taskState.context.productId
              ) as unknown as Product
            )
          : setTargetProduct({} as Product);
        console.log("taskState?.context", taskState?.context);
        console.log("newAllStored", newAllStored);
        taskState?.context?.storedId
          ? setTargetStored(
              taskState.context.storedId.map((item) => {
                return findById(
                  newAllStored,
                  "storedId",
                  item
                ) as unknown as StoredProduct;
              })
            )
          : setTargetStored([] as StoredProduct[]);
      } else {
        setNewTask({
          taskId: uniqueId(),
          amount: {
            units: "kg",
          },
          realAmount: {
            units: "kg",
          },
          priceOut: {
            coin: "€",
            units: "kg",
          },
        } as Task);
        setTargetProduct({} as Product);
        setTargetStored([] as StoredProduct[]);
      }
    }
  }, [taskState.open]);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    branch: keyof Task | undefined = undefined
  ) => {
    if (branch) {
      setNewTask((prev) => ({
        ...prev,
        [branch]: {
          ...(prev[branch] as object as Task), // Direct dynamic access to custom types is not supported yet in TS
          [event.target.name]: event.target.value,
        } as Task,
      }));
    }
    setNewTask((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };
  const handleSubmit = () => {
    setLoading(true);

    if (!newTask.productId) {
      setError("Cal introduir un producte");
      setLoading(false);
      return;
    }

    setNewTask({} as Task); // Clear newTask
    // Apply all changes from targetStored

    // console.log;
    const modAllStored = [
      ...newAllStored.filter((item) => {
        // stored not inside targetStored
        return !targetStored
          .map((id) => {
            return id.storedId;
          })
          .includes(item.storedId);
      }),
      ...targetStored,
    ];

    // console.log("targetStored", targetStored);
    // console.log("newAllStored", newAllStored);
    // console.log("modAllStored", modAllStored);

    setNewAllStored(modAllStored);

    setTaskState((prev) => ({
      ...prev,
      open: false,
      action: taskState.action,
      context: newTask,
      newAllStored: targetStored,
    }));

    setLoading(false);
    console.log(`"${taskState.action}" operation completed`);
  };

  const handleClose = () => {
    setNewTask({} as Task); // Clear newTask
    setTaskState((prev) => ({
      ...prev,
      open: false,
      action: undefined,
      context: undefined,
      newAllStored: undefined,
    }));
  };

  const onProductClick = (item: Product) => {
    // setProductListShow(false);
    setNewTask((prev) => ({
      ...prev,
      productId: item.productId,
    }));
    setTargetProduct(item);
  };

  const [productState, setProductState] = useRecoilState(productModalState);
  const setAllPurchases = useSetRecoilState(storedProductsListAtom);
  const allPurchases = useRecoilValue(storedProductsListAtom).storedProducts;
  const [purchaseState, setPurchaseState] = useRecoilState(purchaseModalState);

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

  const modifyStored = (
    newArray: StoredProduct[],
    unassign: StoredProduct | undefined
  ) => {
    // Updates storedId array in task
    setTargetStored(newArray);
    setNewTask(
      (prev) =>
        ({
          ...prev,
          storedId: newArray.map((item) => item.storedId),
        } as Task)
    );
    // Unassign tasks for the deleted SPs
    unassign &&
      setNewAllStored(
        newAllStored.map((sp) => {
          if (sp?.assigned && sp.storedId === unassign.storedId) {
            return {
              ...sp,
              assigned: sp.assigned.filter((item) => {
                return item.id !== unassign.storedId;
              }),
            } as StoredProduct;
          }
          return sp;
        })
      );
  };

  const sumSP = targetStored?.reduce((total, item) => {
    const assigned = item?.assigned?.find((id) => {
      return id.id === newTask.taskId;
    });
    if (assigned) {
      return total + Number(assigned.amount.value);
    }
    return total;
  }, 0);

  // console.log("newTask", newTask);
  console.log("newAllStored", newAllStored);

  return (
    // BUG: Update list of Genere upon creation without refresh
    // TODO: Rework of genere list elements
    // TODO: Set the Genere created as assigned upon created
    // TODO: Confirm cancel when new data is inserted?
    // TODO: Elaborations
    <>
      {productState.open && <ProductModal />}
      {purchaseState.open && <PurchaseModal />}
      <Modal isOpen={taskState.open} onClose={handleClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            display="flex"
            flexDirection="column"
            textAlign="center"
            fontSize={15}
            padding={3}
          >
            {taskState.action === "create" && "Crea nova tasca"}
            {taskState.action === "modify" && "Modifica tasca"}
          </ModalHeader>
          <ModalBody>
            <Flex justify="center" m="10px 0">
              <Flex
                direction="column"
                height="100%"
                align="center"
                justify="center"
              >
                <Stack>
                  <Flex>
                    <Flex
                      ml="auto"
                      mr={2}
                      width="25%"
                      minWidth="70px"
                      align="center"
                      justify="right"
                    >
                      Producte
                    </Flex>
                    {/* Depends on who is making the task. If Client, it can only choose from product pool.
                    If employee, it chooses from storedProduct pool. If a product is chosen, for employees
                    it will show as a banner ontop of the input */}
                    <ProductSelector // For clients usage
                      target={targetProduct}
                      allProducts={allProducts}
                      handleDel={() => {
                        setTargetProduct(undefined);
                        setNewTask((prev) => ({
                          ...prev,
                          productId: "",
                        }));
                      }}
                      onProductClick={onProductClick}
                      onNewProductClick={() => {
                        setProductState((prev) => ({
                          ...prev,
                          open: true,
                          context: undefined,
                          action: "create",
                        }));
                      }}
                    />
                  </Flex>
                  {/* {newTask?.productId && (
                    <Flex justify="center">
                      Producte sol·licitat:{" "}
                      <Text ml={2} fontWeight={600}>
                        {
                          findById(allProducts, "productId", newTask.productId)
                            .name
                        }
                      </Text>
                    </Flex>
                  )} */}
                  <Divider />
                  <Flex align="center">
                    <Flex width="25%">
                      <Flex
                        ml="auto"
                        mr={1}
                        direction="column"
                        justify="center"
                        align="center"
                      >
                        <Text>Genere</Text>
                        {newTask?.amount && (
                          <Flex
                            p="0 5px"
                            color={
                              Number(sumSP) < Number(newTask.amount.value)
                                ? "yellow.500"
                                : sumSP == newTask.amount.value && sumSP != 0
                                ? "green.300"
                                : "red"
                            }
                            bg={
                              Number(sumSP) > Number(newTask.amount.value)
                                ? "red.100"
                                : "unset"
                            }
                          >
                            <>
                              {/* Total acumulated in targetStored (by checking assigned with same taskId) */}
                              {[undefined, 0, "", false].includes(
                                newTask.amount.value
                              )
                                ? "..."
                                : sumSP + "/ " + newTask.amount.value}{" "}
                              {newTask.amount.units}
                            </>
                          </Flex>
                        )}
                      </Flex>
                    </Flex>
                    <Flex
                      direction="column"
                      ml={2}
                      pl={2}
                      borderLeft="1px solid"
                      borderColor="gray.300"
                      flex={1}
                    >
                      {newTask?.taskId !== undefined && (
                        <StoredSelector
                          targetStored={targetStored}
                          targetProduct={targetProduct}
                          task={newTask}
                          allStored={newAllStored}
                          setAllStored={(newAllStored: StoredProduct[]) => {
                            setNewAllStored(newAllStored);
                          }}
                          allProducts={allProducts}
                          allProviders={allProviders}
                          modifyStored={modifyStored}
                          onNewPurchaseClick={() => {
                            setPurchaseState((prev) => ({
                              // Create new purchase
                              ...prev,
                              open: true,
                              context: {
                                // clientId: orderState.context?.clientId
                                //   ? orderState.context?.clientId
                                //   : undefined,
                                amount: newTask?.amount
                                  ? newTask?.amount
                                  : undefined,
                                gotBy: orderState.context?.deliverBy
                                  ? orderState.context.deliverBy
                                  : undefined,
                              } as StoredProduct,
                              action: "create",
                            }));
                          }}
                        />
                      )}
                    </Flex>
                  </Flex>
                  <Divider />
                  <Flex align="center">
                    <Flex
                      ml="auto"
                      mr={3}
                      width="25%"
                      minWidth="70px"
                      justify="right"
                    >
                      Quantitat
                    </Flex>
                    <Flex width="75%">
                      <Input
                        type="number"
                        name="value"
                        value={newTask?.amount?.value || ""}
                        onChange={(event) => onChange(event, "amount")}
                      />
                      <Select
                        ml={2}
                        width="25%"
                        minWidth="68px"
                        name="units"
                        value={newTask?.amount?.units}
                        onChange={(event) => onChange(event, "amount")}
                      >
                        <option value="u">u.</option>
                        <option value="kg">kg</option>
                        <option value="g">g</option>
                      </Select>
                    </Flex>
                  </Flex>

                  <Flex align="center">
                    <Flex
                      ml="auto"
                      mr={3}
                      width="25%"
                      minWidth="70px"
                      justify="right"
                    >
                      Pes real
                    </Flex>
                    <Flex width="75%">
                      <Input
                        type="number"
                        name="value"
                        value={newTask?.realAmount?.value || ""}
                        onChange={(event) => onChange(event, "realAmount")}
                      />
                      <Select
                        ml={2}
                        width="25%"
                        minWidth="68px"
                        name="units"
                        value={newTask?.realAmount?.units}
                        onChange={(event) => onChange(event, "realAmount")}
                      >
                        <option value="kg">kg</option>
                        <option value="kg">g</option>
                      </Select>
                    </Flex>
                  </Flex>

                  <Flex align="center">
                    <Flex
                      ml="auto"
                      mr={3}
                      width="25%"
                      minWidth="70px"
                      justify="right"
                    >
                      Preu
                    </Flex>
                    <Flex width="75%">
                      <Input
                        type="number"
                        name="value"
                        value={newTask?.priceOut?.value || ""}
                        onChange={(event) => onChange(event, "priceOut")}
                      />
                      <Flex align="center">
                        <Select
                          ml={2}
                          minWidth="68px"
                          name="coin"
                          value={newTask?.priceOut?.coin}
                          onChange={(event) => onChange(event, "priceOut")}
                        >
                          <option value="€">€</option>
                        </Select>
                        <Text m="0 3px" fontSize="18pt">
                          /
                        </Text>
                        <Select
                          minWidth="68px"
                          name="units"
                          value={newTask?.priceOut?.units}
                          onChange={(event) => onChange(event, "priceOut")}
                        >
                          <option value="€/u">€/u.</option>
                          <option value="kg">kg</option>
                          <option value="€/g">€/g</option>
                        </Select>
                      </Flex>
                    </Flex>
                  </Flex>
                  {/* TODO: Elaborations */}
                  <Flex align="center">
                    <Flex
                      ml="auto"
                      mr={3}
                      width="25%"
                      minWidth="70px"
                      justify="right"
                    >
                      Detalls
                    </Flex>
                    <Input
                      width="75%"
                      type="text"
                      name="details"
                      value={newTask?.details || ""}
                      onChange={(event) => onChange(event)}
                    />
                  </Flex>
                  {/* <Flex
                          p={2}
                          bg="gray.300"
                          cursor="pointer"
                          _hover={{ bg: "gray.400" }}
                          onClick={()=>{})}
                        >
                          {newOrder?.tasks &&
                          newOrder.tasks.length &&
                          selectedTask !== undefined ? (
                            <Text>Modifica producte</Text>
                          ) : (
                            <Text>+ Nou producte</Text>
                          )}
                        </Flex> */}
                </Stack>
              </Flex>
            </Flex>
            <Text>{error}</Text>
          </ModalBody>
          <ModalFooter borderRadius="0px 0px 10px 10px">
            <Button
              variant="outline"
              height="30px"
              mr={3}
              onClick={handleClose}
            >
              Cancel·la
            </Button>
            <Button height="30px" onClick={handleSubmit} isLoading={loading}>
              {taskState.action === "create" && "Crea tasca"}
              {taskState.action === "modify" && "Modifica tasca"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
export default TaskModal;
