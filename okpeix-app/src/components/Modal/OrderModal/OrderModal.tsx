import { clientModalState } from "@/src/atoms/objectAtoms/clientModalAtom";
import { taskModalState } from "@/src/atoms/objectAtoms/taskModalAtom";
import { Task, TasksPreset } from "@/src/components/Types/Task";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Flex,
  Input,
  Divider,
  ModalFooter,
  Button,
  Text,
  Icon,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Spinner,
  Select,
  Textarea,
  Checkbox,
  Stack,
} from "@chakra-ui/react";
import { useState, useEffect, useRef } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import TaskModal from "../TaskModal/TaskModal";
import { orderModalState } from "@/src/atoms/objectAtoms/orderModalAtom";
import { Order } from "../../Types/Order";
import { uniqueId } from "@/src/algorithms/uniqueId";
import { fuzzySearch } from "@/src/algorithms/fuzzySearch";
import { RxCross2 } from "react-icons/rx";
import { Client } from "../../Types/AppUser";
import { firestore } from "@/src/firebase/clientApp";
import {
  query,
  collection,
  getDocs,
  doc,
  runTransaction,
  serverTimestamp,
} from "firebase/firestore";
import { Product } from "../../Types/Product";
import ClientModal from "../ClientModal/ClientModal";
import TaskElement from "./TaskElement";
import OrderOptions from "./Elements/OrderOptions";
import ConfirmModal from "../ConfirmModal";
import { dataReciever, findById, getDataArray } from "@/src/hooks/useGetData";
import { allClientsAtom, allProductsAtom } from "@/src/atoms/dataAtom";
import { storedProductsListAtom } from "@/src/atoms/storedListAtom";
import { splitStored } from "@/src/hooks/useUtils";
import { StoredProduct } from "../../Types/StoredProduct";

const OrderModal: React.FC = () => {
  // const [user] = useAuthState(auth);

  // To create a preset, it's returned an order with the action "preset"
  // Client will be set by user. In case of "preset" state, an "order" is returned

  const allProducts = useRecoilValue(allProductsAtom).allProducts;
  const allClients = useRecoilValue(allClientsAtom).allClients;
  const setAllClients = useSetRecoilState(allClientsAtom);
  const allStored = useRecoilValue(storedProductsListAtom).storedProducts;
  const setAllStored = useSetRecoilState(storedProductsListAtom);

  // Keeps track of all changes in storage. Usefull to be able to cancel
  const [newAllStored, setNewAllStored] = useState<StoredProduct[]>(allStored);
  const [listModStored, setListModStored] = useState<StoredProduct[]>([]);

  const [orderState, setOrderState] = useRecoilState(orderModalState);
  const [taskState, setTaskState] = useRecoilState(taskModalState);

  const [newPreset, setNewPreset] = useState<boolean>(false);
  const [presetName, setPresetName] = useState<string>();

  const [newOrder, setNewOrder] = useState<Order>({
    orderId: uniqueId(),
  } as Order);
  const [targetClient, setTargetClient] = useState<Client | undefined>(
    undefined
  );

  useEffect(() => {
    if (orderState.open) {
      if (orderState.context !== undefined) {
        setNewOrder(orderState.context as Order);
      } else {
        setNewOrder({
          orderId: uniqueId(),
          tasks: [] as Task[],
        } as Order);
      }
      setTargetClient(
        orderState?.context?.clientId
          ? (findById(
              allClients,
              "clientId",
              orderState.context.clientId
            ) as unknown as Client)
          : undefined
      );
      setNewAllStored(allStored ? allStored : []);
    }
  }, [orderState.open]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Process recieved data upon TaskModal closing
  useEffect(() => {
    if (!taskState.open && taskState?.context) {
      // Updates newAllStored with applied changes
      // console.log("taskState", taskState);

      const modAllStored = taskState?.newAllStored && [
        ...newAllStored.filter((item) => {
          // stored not inside targetStored
          return !taskState
            ?.newAllStored!.map((id) => {
              return id.storedId;
            })
            .includes(item.storedId);
        }),
        ...taskState.newAllStored,
      ];
      modAllStored && setNewAllStored(modAllStored);
      taskState?.newAllStored && setListModStored(taskState?.newAllStored);

      const modifyIndex = newOrder?.tasks.findIndex((item) => {
        return item.taskId === taskState.context?.taskId;
      });

      switch (taskState.action) {
        case "create":
          setNewOrder(
            (prev) =>
              ({
                ...prev,
                tasks: [...prev.tasks, taskState.context] as Task[],
              } as Order)
          );
          break;

        case "modify":
          if (modifyIndex! > -1) {
            setNewOrder((prev) => ({
              ...prev,
              tasks: [
                ...prev.tasks.slice(0, modifyIndex),
                taskState.context,
                ...prev.tasks.slice(modifyIndex + 1),
              ] as Task[],
            }));
          }
          break;
      }

      setTaskState((prev) => ({
        ...prev,
        context: undefined,
        action: undefined,
      }));
    }
  }, [taskState.open]);

  const [openConfirm, setOpenConfirm] = useState(false);
  const [confirmChoice, setConfirmChoice] = useState<undefined | boolean>(
    undefined
  );

  useEffect(() => {
    if (confirmChoice) handleCreate();
  }, [confirmChoice]);

  const handleCreate = async () => {
    setOpenConfirm(false);
    setConfirmChoice(false);
    setError("");
    // Check if name has been given
    if (!newOrder.clientId) {
      setError("Cal introduir un client");
      return;
    }
    if (newOrder.tasks?.length == 0) {
      setError("Cal introduir alguna tasca");
      return;
    }
    if (newPreset && !presetName) {
      setError("Cal un nom per la plantilla");
      return;
    }

    // For presets
    const newClient = findById(
      allClients,
      "clientId",
      newOrder.clientId
    ) as Client;

    if (
      newPreset &&
      newClient.presets.find((item) => item.name === presetName)
    ) {
      setError("Ja existeix una plantilla amb aquest nom");
      return;
    }

    setLoading(true);

    ////////////////////////////////////
    // Get to tasks and split all storedproducts as needed
    // All storedproducts are still unsetted!

    // let NewSplitStored = [] as StoredProduct[]; // Necessary to update DB
    // const newOrderTasks = newOrder.tasks.map((task, taskIndex) => {
    //   const newStoredIds =
    //     task.storedId &&
    //     task.storedId.map((storedId, storedIndex) => {
    //       const stored = allStored.find((item) => item.storedId === storedId);
    //       if (!stored?.amount?.value) return storedId;

    //       // stored is the current state in DB
    //       // newOrder|task carries all data to modify DB

    //       if (stored.amount.value === task.amount.value) {
    //         // stored doesn't need to be splitted
    //         const newStored = { ...stored, clientId: newOrder.clientId };
    //         const newAllStored = allStored.map((stored) => {
    //           if (stored.storedId === newStored.storedId) return newStored;
    //           return stored;
    //         });
    //         // Updates allStored in DB
    //         NewSplitStored.push(newStored);
    //         // Updates allStored locally
    //         setAllStored((prev) => ({ ...prev, storedProducts: newAllStored }));
    //         // Returns the assigned stored ID to update newStoredIds
    //         return newStored.storedId;
    //       }

    //       const newStored = {
    //         ...stored,
    //         clientId: undefined,
    //         amount: {
    //           ...stored.amount,
    //           value: stored.amount.value - task.amount.value,
    //         },
    //       } as StoredProduct;
    //       const splitStored = {
    //         ...stored,
    //         storedId: uniqueId(),
    //         clientId: newOrder.clientId,
    //         amount: {
    //           ...stored.amount,
    //           value: task.amount.value,
    //         },
    //       } as StoredProduct;
    //       // Modify allStored with updated item
    //       const modifyAllStored = allStored.map((stored) => {
    //         if (stored.storedId === newStored.storedId) return newStored;
    //         return stored;
    //       });

    //       // Adds new split item
    //       const newAllStored = [
    //         ...modifyAllStored,
    //         splitStored,
    //       ] as StoredProduct[];

    //       // Add new splits' Ids items to the list to update Ids
    //       NewSplitStored.push(splitStored);
    //       NewSplitStored.push(newStored);

    //       // Updates allStored
    //       setAllStored((prev) => ({ ...prev, storedProducts: newAllStored }));

    //       // Returns the splitStored ID to update newStoredIds
    //       return splitStored.storedId;
    //     });
    //   // Returns updated newStoredIds to newTasksOrder
    //   return {
    //     ...task,
    //     storedId: newStoredIds,
    //   } as Task;
    // });

    // Set final parameters
    // console.log(newOrder.tasks);

    const NEWOrder = {
      ...newOrder,
      // tasks: newOrderTasks,
      createdAt: serverTimestamp(),
    } as Order;

    const NEWClient = newPreset
      ? ({
          ...newClient,
          presets: [
            ...newClient.presets,
            {
              name: presetName,
              tasks: newOrder.tasks,
            } as TasksPreset,
          ],
        } as Client)
      : undefined;

    setAllStored((prev) => ({ ...prev, storedProducts: newAllStored }));
    NEWClient !== undefined &&
      setAllClients((prev) => ({
        ...prev,
        allClients: [
          ...prev.allClients.filter((item) => {
            return item.clientId !== NEWOrder.clientId;
          }),
          NEWClient,
        ] as Client[],
      }));

    console.log("NEWClient", NEWClient);

    setNewOrder(
      // This f*cking thing doesn't work inside async functions
      (prev) =>
        ({
          ...prev,
          // tasks: newOrderTasks,
          createdAt: serverTimestamp(),
        } as Order)
    );

    try {
      const orderDocRef = doc(firestore, "orders", NEWOrder.orderId);
      const clientDocRef = NEWClient
        ? doc(firestore, "clients", NEWClient.clientId)
        : undefined;
      await runTransaction(firestore, async (transaction) => {
        // Create order in DB
        transaction.set(orderDocRef, NEWOrder);
        if (clientDocRef) {
          transaction.set(clientDocRef, NEWClient);
        }

        // Create new entries of splitted StoredProducts
        listModStored.forEach((modStored) => {
          const storedDocRef = doc(firestore, "storage", modStored.storedId);
          transaction.set(storedDocRef, modStored);
        });

        setOrderState((prev) => ({
          ...prev,
          open: false,
          context: NEWOrder,
          action: orderState.action,
        }));
      });
      if (orderState.context) {
        console.log(`"${NEWOrder.orderId}" order successfuly modified`);
      } else {
        console.log(`"${NEWOrder.orderId}" order successfuly created`);
      }
    } catch (error: any) {
      console.log("handleCreate error", error);
      setError(error.message);
      // Undo all splitting of storedProducts
    }

    setLoading(false);

    // Cleanup
    setPresetName("");
    setNewPreset(false);
    setNewOrder({} as Order);
    setOrderState((prev) => ({
      ...prev,
      context: undefined,
      action: undefined,
    }));
  };

  const onChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setNewOrder(
      (prev) =>
        ({
          ...prev,
          [event.target.name]: event.target.value,
        } as Order)
    );
  };

  const handleClose = () => {
    setNewOrder({} as Order);
    setOrderState((prev) => ({
      ...prev,
      open: false,
      context: undefined,
      action: undefined,
    }));
  };

  const onTaskClick = (task: Task) => {
    setTaskState((prev) => ({
      ...prev,
      open: true,
      action: "modify",
      context: task,
      newAllStored: newAllStored,
    }));
  };

  const [listShow, setListShow] = useState(false);
  const [clientInput, setClientInput] = useState("");
  const [clientLoading, setClientLoading] = useState(false);
  // const [clientsList, setClientsList] = useState<Client[] | undefined>(
  //   undefined
  // );

  // const getClients = async () => {
  //   setClientLoading(true);
  //   try {
  //     const queryRef = query(collection(firestore, "clients"));
  //     const clientDocs = await getDocs(queryRef);
  //     const clients = clientDocs.docs.map((doc) => ({
  //       clientId: doc.id,
  //       ...doc.data(),
  //     })) as Client[];
  //     setClientsList(clients);
  //   } catch (error) {
  //     console.log("getClients error: ", error);
  //   }
  //   setClientLoading(false);
  // };

  useEffect(() => {
    //TODO: Set new id's to the task presets
    clientInput !== "" ? setListShow(true) : setListShow(false);
  }, [clientInput]);

  const onClientClick = (item: Client) => {
    setClientInput("");
    // setListShow(false);
    setNewOrder((prev) => ({
      ...prev,
      clientId: item.clientId,
    }));
    setTargetClient(item);
  };

  const setClientState = useSetRecoilState(clientModalState);

  const focusRef = useRef(null);

  const [selectedPreset, setSelectedPreset] = useState<TasksPreset | undefined>(
    undefined
  );

  useEffect(() => {
    if (selectedPreset) {
      setNewOrder((prev) => ({
        ...prev,
        tasks: selectedPreset.tasks,
      }));
    }
  }, [selectedPreset]);

  console.log("allClients", allClients);

  return (
    <>
      <ConfirmModal
        isOpen={openConfirm}
        message={
          "Modificaràs la comanda. Procedim?"
          // newOrder?.clientId === newOrder?.creatorId // Tells user that it was created by the client
          //   ? "Estas modificant una comanda creada pel client. Segur que vols modificar-la?"
          //   : "Modificaràs la comanda. Procedim?"
        }
        onClose={() => {
          setOpenConfirm(false);
        }}
        setChoice={(choice: boolean) => {
          setConfirmChoice(choice);
        }}
      />
      <ClientModal />
      {taskState.open && <TaskModal />}
      <Modal isOpen={orderState.open} onClose={handleClose} size="xl">
        <ModalOverlay />
        <ModalContent padding="25px 35px">
          <ModalHeader p={0} m={0}>
            <Flex fontSize="14pt" justify="space-between" align="center">
              <Flex align="center">
                <Text mr={2}>
                  {orderState.context === undefined
                    ? "Crea nova comanda"
                    : "Modifica comanda"}
                </Text>
                {orderState?.context?.orderId && (
                  <Text fontSize="10pt" color="gray.200">
                    {orderState?.context?.orderId}
                  </Text>
                )}
              </Flex>
              {orderState.context !== undefined && (
                <OrderOptions context={orderState.context} />
              )}
            </Flex>
          </ModalHeader>

          <ModalBody p={0} m={0}>
            <Divider m="10px 0" />
            <Flex justify="space-between">
              <Flex align="center" width="50%" mr={10}>
                <Flex
                  ml="auto"
                  mr={3}
                  width="25%"
                  minWidth="70px"
                  justify="right"
                >
                  Client:
                </Flex>
                {allClients?.find((item) => {
                  return item.clientId === targetClient?.clientId;
                }) ? (
                  <Flex
                    p={2}
                    borderRadius={4}
                    bg="gray.200"
                    justify="left"
                    width="75%"
                  >
                    <Flex
                      p="5px 5px 5px 5px"
                      borderRadius={5}
                      cursor="pointer"
                      _hover={{ bg: "gray.100" }}
                      onClick={() => {
                        // Remove client from socket
                        setTargetClient(undefined);
                        setNewOrder(
                          (prev) =>
                            ({
                              ...prev,
                              clientId: undefined,
                            } as Order)
                        );
                      }}
                    >
                      <Icon as={RxCross2} />
                    </Flex>
                    <Flex ml={2} fontWeight={600}>
                      {targetClient?.name}
                    </Flex>
                  </Flex>
                ) : (
                  <Popover
                    initialFocusRef={focusRef}
                    isOpen={listShow}
                    // onClose={() => setListShow(false)}
                  >
                    <PopoverTrigger>
                      <Input
                        autoComplete="off"
                        autoFocus
                        width="75%"
                        type="text"
                        name="name"
                        ref={focusRef}
                        // value={newTask?.product?.name}
                        // onChange={(event) => onChange(event, "product")}
                        value={clientInput}
                        onChange={(event) => setClientInput(event.target.value)}
                        // onBlur={() => setListShow(false)}
                      />
                    </PopoverTrigger>
                    {/* <Flex minWidth="200px" minHeight="100px"> */}
                    <PopoverContent
                      border="1px solid black"
                      shadow="2px 2px 10px gray"
                      overflow="hidden"
                    >
                      {clientLoading ? (
                        <Spinner />
                      ) : (
                        allClients &&
                        fuzzySearch(
                          clientInput,
                          allClients.map((item) => {
                            return [
                              `${item.name ? item.name : ""} ${
                                item.alias ? item.alias : ""
                              }`.split(/[, ]/g),
                              item,
                            ];
                          })
                        ).map((item: any, index: number) => {
                          return (
                            <Flex key={item[1].clientId} direction="column">
                              <Flex
                                p={2.5}
                                cursor="pointer"
                                _hover={{ bg: "gray.100" }}
                                onClick={() => {
                                  onClientClick(item[1]);
                                }}
                              >
                                {String(item[0])}
                              </Flex>
                              <Divider borderColor="gray.300" />
                            </Flex>
                          );
                        })
                      )}
                      <Divider />
                      <Flex
                        p={2.5}
                        cursor="pointer"
                        _hover={{ bg: "gray.100" }}
                        onClick={() => {
                          setClientInput("");
                          setClientState((prev) => ({
                            ...prev,
                            open: true,
                            context: undefined,
                            action: "create",
                          }));
                        }}
                      >
                        + Crea nou client
                      </Flex>
                    </PopoverContent>
                    {/* </Flex> */}
                  </Popover>
                )}
              </Flex>

              <Flex align="center" width="50%">
                <Flex
                  ml="auto"
                  mr={3}
                  width="25%"
                  minWidth="70px"
                  justify="right"
                >
                  Data entrega:
                </Flex>
                <Flex width="75%">
                  <Input
                    type="date"
                    name="deliverBy"
                    value={String(newOrder?.deliverBy)}
                    onChange={onChange}
                  />
                </Flex>
              </Flex>
            </Flex>
            <Flex align="center" m="15px 0 5px 0">
              <Flex
                ml="auto"
                mr={3}
                width="25%"
                minWidth="70px"
                justify="right"
              >
                Plantilles:
              </Flex>
              <Flex width="75%">
                {targetClient?.presets ? (
                  <Select
                    onChange={(event) => {
                      event.target.value
                        ? setSelectedPreset(JSON.parse(event.target.value))
                        : setSelectedPreset(undefined);
                    }}
                  >
                    <option value={undefined}></option>
                    {targetClient.presets.map((item) => {
                      return (
                        <option key={item.name} value={JSON.stringify(item)}>
                          {item.name}
                        </option>
                      );
                    })}
                  </Select>
                ) : (
                  <Text>Cap Plantilla</Text>
                )}
              </Flex>
            </Flex>
            <Divider m="15px 0" />
            <Stack p={2}>
              <Flex justify="right">
                <Checkbox
                  size="md"
                  isChecked={newPreset}
                  onChange={() => setNewPreset(!newPreset)}
                >
                  Estableix aquesta ordre com plantilla
                </Checkbox>
              </Flex>
              {newPreset && (
                <Flex align="center">
                  <Text ml="auto" mr={2} width="25%">
                    Nom de plantilla:
                  </Text>
                  <Input
                    width="75%"
                    value={presetName}
                    onChange={(event) => setPresetName(event.target.value)}
                  />
                </Flex>
              )}
            </Stack>
            {/* <Text>{JSON.stringify(selectedPreset)}</Text> */}
            {/* List of tasks */}
            <Flex
              height="100%"
              border="1px solid black"
              borderRadius="5px"
              direction="column"
              overflow="auto"
            >
              <Flex
                p={2}
                pl={4}
                flex={1}
                cursor="pointer"
                _hover={{ bg: "gray.100" }}
                onClick={() => {
                  setTaskState((prev) => ({
                    ...prev,
                    open: true,
                    action: "create",
                    context: undefined,
                    newAllStored: newAllStored,
                  }));
                }}
              >
                + Nova tasca
              </Flex>
              {newOrder?.tasks &&
                newOrder.tasks.map((item, index) => (
                  <TaskElement
                    key={item.taskId}
                    task={item}
                    handleTaskDel={() => {
                      setNewOrder(
                        (prev) =>
                          ({
                            ...prev,
                            tasks: [
                              ...newOrder?.tasks.slice(0, index),
                              ...newOrder?.tasks.slice(index + 1),
                            ],
                          } as Order)
                      );
                    }}
                    onClick={() => onTaskClick(item)}
                    allProducts={allProducts}
                  />
                ))}
            </Flex>
            <Divider />
            <Flex direction="column" mt={2}>
              <Text p={1}>Detalls:</Text>
              <Textarea
                name="details"
                onChange={onChange}
                value={newOrder?.details || ""}
              />
            </Flex>
            <Text color="red.300">{error}</Text>
            <Divider m="16px 0" />
          </ModalBody>

          <ModalFooter p={0} m={0}>
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
              onClick={() => {
                orderState.action === "create"
                  ? handleCreate()
                  : setOpenConfirm(true);
              }}
              isLoading={loading}
            >
              {orderState.action === "create" && "Crea comanda"}
              {orderState.action === "modify" && "Modifica comanda"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
export default OrderModal;
