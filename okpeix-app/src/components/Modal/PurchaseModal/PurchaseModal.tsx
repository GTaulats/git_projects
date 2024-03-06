import { providerModalState } from "@/src/atoms/objectAtoms/providerModalAtom";
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
  Stack,
} from "@chakra-ui/react";
import { useState, useEffect, useRef } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import TaskModal from "../TaskModal/TaskModal";
import { purchaseModalState } from "@/src/atoms/objectAtoms/purchaseModalAtom";
import { uniqueId } from "@/src/algorithms/uniqueId";
import { fuzzySearch } from "@/src/algorithms/fuzzySearch";
import { RxCross2 } from "react-icons/rx";
import { Client, Provider } from "../../Types/AppUser";
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
import ProviderModal from "../ProviderModal/ProviderModal";
import PurchaseOptions from "./Elements/PurchaseOptions";
import ConfirmModal from "../ConfirmModal";
import { findById, getDataArray } from "@/src/hooks/useGetData";
import {
  allProvidersAtom,
  allProductsAtom,
  allClientsAtom,
} from "@/src/atoms/dataAtom";
import { StoredProduct } from "../../Types/StoredProduct";
import { productModalState } from "@/src/atoms/objectAtoms/productModalAtom";
import ProductModal from "../ProductModal/ProductModal";
import { clientModalState } from "@/src/atoms/objectAtoms/clientModalAtom";
import ClientModal from "../ClientModal/ClientModal";

/*
  Stores purchase directly as a StoredProduct, but with the flag of purchased: false
  This way is easier to use it for tasks.
  Still using "newPurchase" to easen code clarity
*/

const PurchaseModal: React.FC = () => {
  // const [user] = useAuthState(auth);

  // To create a preset, it's returned an purchase with the action "preset"
  // Provider will be set by user. In case of "preset" state, an "purchase" is returned

  // TODO: Highlight autocompleted stuff

  const allProviders = useRecoilValue(allProvidersAtom).allProviders;
  const allProducts = useRecoilValue(allProductsAtom).allProducts;
  const allClients = useRecoilValue(allClientsAtom).allClients;

  const [targetProduct, setTargetProduct] = useState<Product | undefined>(
    undefined
  );

  const [targetProvider, setTargetProvider] = useState<Provider | undefined>(
    undefined
  );

  const [targetClient, setTargetClient] = useState<Client | undefined>(
    undefined
  );

  const [purchaseState, setPurchaseState] = useRecoilState(purchaseModalState);

  const [newPurchase, setNewPurchase] = useState<StoredProduct>({
    storedId: uniqueId(),
  } as StoredProduct);

  useEffect(() => {
    if (purchaseState.open) {
      if (
        purchaseState.context !== undefined &&
        purchaseState?.context?.storedId !== undefined
      ) {
        setNewPurchase(purchaseState.context as StoredProduct);
      } else {
        setNewPurchase(
          (prev) =>
            ({
              ...prev,
              storedId: uniqueId(),
              purchased: false,
            } as StoredProduct)
        );
      }
      setTargetProvider(
        purchaseState?.context?.providerId
          ? (findById(
              allProviders,
              "providerId",
              purchaseState.context.providerId
            ) as unknown as Provider)
          : undefined
      );
      setTargetProduct(
        purchaseState?.context?.productId
          ? (findById(
              allProducts,
              "productId",
              purchaseState.context.productId
            ) as unknown as Product)
          : undefined
      );
      purchaseState?.context?.clientId;
      setTargetClient(
        purchaseState?.context?.clientId
          ? (findById(
              allClients,
              "clientId",
              purchaseState.context.clientId
            ) as unknown as Client)
          : undefined
      );
    }
  }, [purchaseState.open]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
    if (!newPurchase.productId) {
      setError("Cal introduir algun producte");
      return;
    }

    // Set final parameters if new, or update createdAt
    setNewPurchase(
      (prev) =>
        ({
          ...prev,
          createdAt: serverTimestamp(),
        } as StoredProduct)
    );
    console.log("newPurchase", newPurchase);
    setLoading(true);
    try {
      const purchaseDocRef = doc(firestore, "storage", newPurchase.storedId);
      await runTransaction(firestore, async (transaction) => {
        // Create purchase
        transaction.set(purchaseDocRef, newPurchase);

        setPurchaseState((prev) => ({
          ...prev,
          open: false,
          context: newPurchase,
          action: purchaseState.action,
        }));
      });
      if (purchaseState.context) {
        console.log(`"${newPurchase.storedId}" purchase successfuly modified`);
      } else {
        console.log(`"${newPurchase.storedId}" purchase successfuly created`);
      }
    } catch (error: any) {
      console.log("handleCreate error", error);
      setError(error.message);
    }

    setLoading(false);

    // Cleanup
    setNewPurchase({} as StoredProduct);
    setPurchaseState((prev) => ({
      ...prev,
      context: undefined,
      action: undefined,
    }));
  };

  const onChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
    branch: keyof StoredProduct | undefined = undefined
  ) => {
    if (branch) {
      setNewPurchase((prev) => ({
        ...prev,
        [branch]: {
          ...(prev[branch] as object as Task), // Direct dynamic access to custom types is not supported yet in TS
          [event.target.name]: event.target.value,
        } as Task,
      }));
    }
    setNewPurchase((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const handleClose = () => {
    setNewPurchase({} as StoredProduct);
    setPurchaseState((prev) => ({
      ...prev,
      open: false,
      context: undefined,
      action: undefined,
    }));
  };

  const [providerListShow, setProviderListShow] = useState(false);
  const [providerInput, setProviderInput] = useState("");
  const [providerLoading, setProviderLoading] = useState(false);

  const [productListShow, setProductListShow] = useState(false);
  const [productInput, setProductInput] = useState("");
  const [productLoading, setProductLoading] = useState(false);

  const [clientListShow, setClientListShow] = useState(false);
  const [clientInput, setClientInput] = useState("");
  const [clientLoading, setClientLoading] = useState(false);

  // const getProviders = async () => {
  //   setProviderLoading(true);
  //   try {
  //     const queryRef = query(collection(firestore, "providers"));
  //     const providerDocs = await getDocs(queryRef);
  //     const providers = providerDocs.docs.map((doc) => ({
  //       providerId: doc.id,
  //       ...doc.data(),
  //     })) as Provider[];
  //     setProvidersList(providers);
  //   } catch (error) {
  //     console.log("getProviders error: ", error);
  //   }
  //   setProviderLoading(false);
  // };

  useEffect(() => {
    //TODO: Set new id's to the task presets
    providerInput !== ""
      ? setProviderListShow(true)
      : setProviderListShow(false);
  }, [providerInput]);
  const onProviderClick = (item: Provider) => {
    setProviderInput("");
    // setListShow(false);
    setNewPurchase((prev) => ({
      ...prev,
      providerId: item.providerId,
    }));
    setTargetProvider(item);
  };
  const setProviderState = useSetRecoilState(providerModalState);
  const focusProviderRef = useRef(null);

  useEffect(() => {
    //TODO: Set new id's to the task presets
    productInput !== "" ? setProductListShow(true) : setProductListShow(false);
  }, [productInput]);
  const onProductClick = (item: Product) => {
    setProductInput("");
    // setListShow(false);
    setNewPurchase((prev) => ({
      ...prev,
      productId: item.productId,
    }));
    setTargetProduct(item);
  };
  const setProductState = useSetRecoilState(productModalState);
  const focusProductRef = useRef(null);

  useEffect(() => {
    //TODO: Set new id's to the task presets
    clientInput !== "" ? setClientListShow(true) : setClientListShow(false);
  }, [clientInput]);
  const onClientClick = (item: Client) => {
    setClientInput("");
    // setListShow(false);
    setNewPurchase((prev) => ({
      ...prev,
      clientId: item.clientId,
    }));
    setTargetClient(item);
  };
  const setClientState = useSetRecoilState(clientModalState);
  const focusClientRef = useRef(null);

  const [selectedPreset, setSelectedPreset] = useState<TasksPreset | undefined>(
    undefined
  );

  // useEffect(() => {
  //   if (selectedPreset) {
  //     setNewPurchase((prev) => ({
  //       ...prev,
  //       tasks: selectedPreset.tasks,
  //     }));
  //   }
  // }, [selectedPreset]);

  // const [productsList, setProductsList] = useState<Product[]>();
  // useEffect(() => {
  //   const fetchData = async () => {
  //     setProductsList((await getDataArray("products").then()) as Product[]);
  //   };
  //   fetchData();
  // }, []);

  const daysForward = (days: number) => {
    const targetDate = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
    const targetDay =
      targetDate.getDate() < 10
        ? `0${targetDate.getDate()}`
        : targetDate.getDate();
    const targetMonth =
      targetDate.getMonth() + 1 < 10
        ? `0${targetDate.getMonth() + 1}`
        : targetDate.getMonth() + 1;
    return [targetDate.getFullYear(), targetMonth, targetDay].join("-");
  };
  console.log("allProviders", allProviders);
  // console.log("targetProduct", targetProduct);
  // console.log("newPurchase", newPurchase);
  // TODO: Show task assigned to this purchase & link to it.
  // BUG: When creating purchase, it won't update locally
  return (
    <>
      <ConfirmModal
        isOpen={openConfirm}
        message={"Modificaràs la compra. Procedim?"}
        onClose={() => {
          setOpenConfirm(false);
        }}
        setChoice={(choice: boolean) => {
          setConfirmChoice(choice);
        }}
      />
      <ProviderModal />
      <ProductModal />
      <ClientModal />
      <Modal isOpen={purchaseState.open} onClose={handleClose} size="xl">
        <ModalOverlay />
        <ModalContent padding="25px 35px">
          <ModalHeader p={0} mb={4}>
            <Flex fontSize="14pt" justify="space-between" align="center">
              <Flex align="center">
                <Text mr={2}>
                  {purchaseState.context === undefined
                    ? "Crea nova compra"
                    : "Modifica compra"}
                </Text>
                {purchaseState?.context?.storedId && (
                  <Text fontSize="10pt" color="gray.200">
                    {purchaseState?.context?.storedId}
                  </Text>
                )}
              </Flex>
              {purchaseState.context !== undefined && (
                <PurchaseOptions context={purchaseState.context} />
              )}
            </Flex>
          </ModalHeader>

          <ModalBody p={0} m={0}>
            <Stack spacing={4}>
              <Flex direction="column">
                <Flex justify="space-between">
                  <Flex align="center" width="50%" mr={10}>
                    <Flex
                      ml="auto"
                      mr={3}
                      width="25%"
                      minWidth="70px"
                      justify="right"
                    >
                      Proveïdor:
                    </Flex>
                    {allProviders?.find((item) => {
                      return item.providerId === targetProvider?.providerId;
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
                            // Remove provider from socket
                            setTargetProvider(undefined);
                            setNewPurchase(
                              (prev) =>
                                ({
                                  ...prev,
                                  providerId: "",
                                } as StoredProduct)
                            );
                          }}
                        >
                          <Icon as={RxCross2} />
                        </Flex>
                        <Flex ml={2} fontWeight={600}>
                          {targetProvider?.name}
                        </Flex>
                      </Flex>
                    ) : (
                      <Popover
                        initialFocusRef={focusProviderRef}
                        isOpen={providerListShow}
                        // onClose={() => setListShow(false)}
                      >
                        <PopoverTrigger>
                          <Input
                            autoComplete="off"
                            autoFocus
                            width="75%"
                            type="text"
                            ref={focusProviderRef}
                            value={providerInput}
                            onChange={(event) =>
                              setProviderInput(event.target.value)
                            }
                          />
                        </PopoverTrigger>
                        {/* <Flex minWidth="200px" minHeight="100px"> */}
                        <PopoverContent
                          border="1px solid black"
                          shadow="2px 2px 10px gray"
                          overflow="hidden"
                        >
                          {providerLoading ? (
                            <Spinner />
                          ) : (
                            allProviders &&
                            fuzzySearch(
                              providerInput,
                              allProviders.map((item) => {
                                return [
                                  `${item.name ? item.name : ""} ${
                                    item.alias ? item.alias : ""
                                  }`.split(/[, ]/g),
                                  item,
                                ];
                              })
                            ).map((item: any, index: number) => {
                              return (
                                <Flex
                                  key={item[1].providerId}
                                  direction="column"
                                >
                                  <Flex
                                    p={2.5}
                                    cursor="pointer"
                                    _hover={{ bg: "gray.100" }}
                                    onClick={() => {
                                      onProviderClick(item[1]);
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
                              setProviderInput("");
                              setProviderState((prev) => ({
                                ...prev,
                                open: true,
                                context: undefined,
                                action: "create",
                              }));
                            }}
                          >
                            + Crea nou provider
                          </Flex>
                        </PopoverContent>
                        {/* </Flex> */}
                      </Popover>
                    )}
                  </Flex>
                  <Flex align="center" width="50%" mr={10}>
                    <Flex
                      ml="auto"
                      mr={3}
                      width="25%"
                      minWidth="70px"
                      justify="right"
                    >
                      Destinatari:
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
                            setNewPurchase(
                              (prev) =>
                                ({
                                  ...prev,
                                  clientId: undefined,
                                } as StoredProduct)
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
                        initialFocusRef={focusClientRef}
                        isOpen={clientListShow}
                        // onClose={() => setListShow(false)}
                      >
                        <PopoverTrigger>
                          <Input
                            autoComplete="off"
                            autoFocus
                            width="75%"
                            type="text"
                            ref={focusClientRef}
                            value={clientInput}
                            onChange={(event) =>
                              setClientInput(event.target.value)
                            }
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
                </Flex>
                <Flex mt={3} width="100%">
                  <Flex align="center" width="100%">
                    <Flex
                      ml="auto"
                      mr={3}
                      width="25%"
                      minWidth="70px"
                      justify="right"
                    >
                      Data compra:
                    </Flex>
                    <Stack width="75%" direction="row">
                      <Flex
                        p={2}
                        bg="gray.200"
                        cursor="pointer"
                        borderRadius={5}
                        _hover={{ bg: "gray.100" }}
                        onClick={() => {
                          setNewPurchase(
                            (prev) =>
                              ({
                                ...prev,
                                gotBy: daysForward(0),
                              } as StoredProduct)
                          );
                        }}
                      >
                        Avui
                      </Flex>
                      <Flex
                        p={2}
                        bg="gray.200"
                        cursor="pointer"
                        borderRadius={5}
                        _hover={{ bg: "gray.100" }}
                        onClick={() => {
                          setNewPurchase(
                            (prev) =>
                              ({
                                ...prev,
                                gotBy: daysForward(1),
                              } as StoredProduct)
                          );
                        }}
                      >
                        Demà
                      </Flex>
                      <Input
                        type="date"
                        name="gotBy"
                        value={String(newPurchase?.gotBy)}
                        onChange={onChange}
                      />
                    </Stack>
                  </Flex>
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
                  Producte:
                </Flex>
                {allProducts?.find((item) => {
                  return item.productId === targetProduct?.productId;
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
                        // Remove product from socket
                        setTargetProduct(undefined);
                        setNewPurchase(
                          (prev) =>
                            ({
                              ...prev,
                              productId: "",
                            } as StoredProduct)
                        );
                      }}
                    >
                      <Icon as={RxCross2} />
                    </Flex>
                    <Flex ml={2} fontWeight={600}>
                      {targetProduct?.name}
                    </Flex>
                  </Flex>
                ) : (
                  <Popover
                    initialFocusRef={focusProductRef}
                    isOpen={productListShow}
                    // onClose={() => setListShow(false)}
                  >
                    <PopoverTrigger>
                      <Input
                        autoComplete="off"
                        autoFocus
                        width="75%"
                        type="text"
                        ref={focusProductRef}
                        value={productInput}
                        onChange={(event) =>
                          setProductInput(event.target.value)
                        }
                      />
                    </PopoverTrigger>
                    <PopoverContent
                      border="1px solid black"
                      shadow="2px 2px 10px gray"
                      overflow="hidden"
                    >
                      {productLoading ? (
                        <Spinner />
                      ) : (
                        allProducts &&
                        fuzzySearch(
                          productInput,
                          allProducts.map((item) => {
                            return [
                              `${item.name ? item.name : ""} ${
                                item.alias ? item.alias : ""
                              }`.split(/[, ]/g),
                              item,
                            ];
                          })
                        ).map((item: any, index: number) => {
                          return (
                            <Flex key={item[1].productId} direction="column">
                              <Flex
                                p={2.5}
                                cursor="pointer"
                                _hover={{ bg: "gray.100" }}
                                onClick={() => {
                                  onProductClick(item[1]);
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
                          setProductInput("");
                          setProductState((prev) => ({
                            ...prev,
                            open: true,
                            context: undefined,
                            action: "create",
                          }));
                        }}
                      >
                        + Crea nou producte
                      </Flex>
                    </PopoverContent>
                  </Popover>
                )}
              </Flex>

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
                    value={newPurchase?.amount?.value || ""}
                    onChange={(event) => onChange(event, "amount")}
                  />
                  <Select
                    ml={2}
                    width="25%"
                    minWidth="68px"
                    name="units"
                    value={newPurchase?.amount?.units}
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
                  Preu de compra
                </Flex>
                <Flex width="75%">
                  <Input
                    type="number"
                    name="value"
                    value={newPurchase?.priceIn?.value || ""}
                    onChange={(event) => onChange(event, "priceIn")}
                  />
                  <Flex align="center">
                    <Select
                      ml={2}
                      minWidth="68px"
                      name="coin"
                      value={newPurchase?.priceIn?.coin}
                      onChange={(event) => onChange(event, "priceIn")}
                    >
                      {/* <option value="€/u">€/u.</option> */}
                      <option value="€">€</option>
                      {/* <option value="€/g">€/g</option> */}
                    </Select>
                    <Text m="0 3px" fontSize="18pt">
                      /
                    </Text>
                    <Select
                      minWidth="68px"
                      name="units"
                      value={newPurchase?.priceIn?.units}
                      onChange={(event) => onChange(event, "priceIn")}
                    >
                      {/* <option value="€/u">€/u.</option> */}
                      <option value="kg">kg</option>
                      {/* <option value="€/g">€/g</option> */}
                    </Select>
                  </Flex>
                </Flex>
              </Flex>

              <Divider />
              <Flex direction="column">
                <Text p={1}>Detalls:</Text>
                <Textarea
                  name="details"
                  onChange={onChange}
                  value={newPurchase?.details || ""}
                />
              </Flex>
              <Text color="red.300">{error}</Text>
            </Stack>
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
                // Confirm when modifying provider (not creating)
                purchaseState.action === "create" ||
                !purchaseState?.context?.providerId
                  ? handleCreate()
                  : setOpenConfirm(true);
              }}
              isLoading={loading}
            >
              {purchaseState.action === "create" && "Crea compra"}
              {purchaseState.action === "modify" && "Modifica compra"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
export default PurchaseModal;
