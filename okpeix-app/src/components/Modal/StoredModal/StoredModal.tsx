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
import { useRecoilState, useRecoilValue } from "recoil";
import { uniqueId } from "@/src/algorithms/uniqueId";
import { Product } from "../../Types/Product.ts";
import { firestore } from "@/src/firebase/clientApp";
import { query, collection, getDocs } from "firebase/firestore";
import { fuzzySearch } from "../../../algorithms/fuzzySearch.js";
import { RxCross2 } from "react-icons/rx";
import ProductModal from "../ProductModal/ProductModal.tsx";
import { productModalState } from "@/src/atoms/objectAtoms/productModalAtom";
import { allProductsAtom } from "@/src/atoms/dataAtom.ts";
import { findById } from "@/src/hooks/useGetData.tsx";
import { StoredProduct } from "../../Types/StoredProduct.ts";
import { storedModalState } from "@/src/atoms/objectAtoms/storedModalAtom.ts";

const StoredModal: React.FC = () => {
  const [storedState, setStoredState] = useRecoilState(storedModalState);
  const [newStored, setNewStored] = useState<StoredProduct>(
    {} as StoredProduct
  );

  const allProducts = useRecoilValue(allProductsAtom).allProducts;
  const [targetProduct, setTargetProduct] = useState<Product>();

  useEffect(() => {
    if (storedState.open) {
      if (storedState.context !== undefined) {
        setNewStored({ ...storedState.context } as StoredProduct);
        setTargetProduct(
          findById(allProducts, "productId", storedState.context.productId!)
        );
      } else {
        setNewStored({
          storedId: uniqueId(),
          amount: {
            units: "kg",
          },
          priceIn: {
            coin: "€",
            units: "kg",
          },
        } as StoredProduct);
        setTargetProduct({} as Product);
      }
    }
  }, [storedState.open]);

  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const onChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    branch: keyof StoredProduct | undefined = undefined
  ) => {
    if (branch) {
      setNewStored((prev) => ({
        ...prev,
        [branch]: {
          ...(prev[branch] as object as StoredProduct), // Direct dynamic access to custom types is not supported yet in TS
          [event.target.name]: event.target.value,
        } as StoredProduct,
      }));
    }
    setNewStored((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = () => {
    setLoading(true);

    setNewStored({} as StoredProduct); // Clear newStored

    setStoredState((prev) => ({
      ...prev,
      open: false,
      action: storedState.action,
      context: newStored,
    }));

    setLoading(false);
    console.log(`"${storedState.action}" operation completed`);
  };

  const handleClose = () => {
    setNewStored({} as StoredProduct); // Clear newStored
    setStoredState((prev) => ({
      ...prev,
      open: false,
      action: undefined,
      context: undefined,
    }));
  };

  const [listShow, setListShow] = useState(false);
  const [productLoading, setProductLoading] = useState(false);
  const [productInput, setProductInput] = useState("");
  const [productsList, setProductsList] = useState<Product[] | undefined>(
    undefined
  );

  const getProducts = async () => {
    setProductLoading(true);
    try {
      const queryRef = query(collection(firestore, "products"));
      const productDocs = await getDocs(queryRef);
      const products = productDocs.docs.map((doc) => ({
        productId: doc.id,
        ...doc.data(),
      }));
      setProductsList(products as Product[]);
    } catch (error) {
      console.log("getProducts error: ", error);
    }
    setProductLoading(false);
  };

  useEffect(() => {
    if (productInput !== "") {
      setListShow(true);
      if (productsList === undefined) {
        getProducts(); // Fetch products list only once and store in productsList
      }
      return;
    }
    setListShow(false);
  }, [productInput]);

  const onProductClick = (item: Product) => {
    setProductInput("");
    // setListShow(false);
    setNewStored((prev) => ({
      ...prev,
      productId: item.productId,
    }));
    setTargetProduct(item);
  };

  const focusRef = React.useRef(null);

  const [productState, setProductState] = useRecoilState(productModalState);

  return (
    <>
      <ProductModal />
      <Modal isOpen={storedState.open} onClose={handleClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            display="flex"
            flexDirection="column"
            textAlign="center"
            fontSize={15}
            padding={3}
          >
            {storedState.action === "create" && "Crea nova instancia"}
            {storedState.action === "modify" && "Modifica instancia"}
          </ModalHeader>
          <ModalBody>
            <Flex justify="center" m="30px 0">
              <Flex
                direction="column"
                height="100%"
                align="center"
                justify="center"
              >
                <Stack>
                  <Flex align="center">
                    <Flex
                      ml="auto"
                      mr={3}
                      width="25%"
                      minWidth="70px"
                      justify="right"
                    >
                      Producte
                    </Flex>
                    {productsList?.find((item) => {
                      return item.productId === targetProduct?.productId;
                    }) ? (
                      <Flex justify="left" width="75%">
                        <Flex
                          p={2}
                          borderRadius={4}
                          bg="gray.200"
                          justify="left"
                          width="75%"
                        >
                          <Flex
                            p={1}
                            borderRadius={5}
                            cursor="pointer"
                            _hover={{ bg: "gray.100" }}
                            onClick={() => {
                              setTargetProduct(undefined);
                              setNewStored((prev) => ({
                                ...prev,
                                product: undefined,
                              }));
                            }}
                          >
                            <Icon as={RxCross2} />
                          </Flex>
                          <Flex ml={2}>{targetProduct?.name}</Flex>
                        </Flex>
                      </Flex>
                    ) : (
                      <Popover
                        initialFocusRef={focusRef}
                        isOpen={listShow}
                        onClose={() => setListShow(false)}
                      >
                        <PopoverTrigger>
                          <Input
                            autoComplete="off"
                            autoFocus
                            width="75%"
                            type="text"
                            name="name"
                            ref={focusRef}
                            // value={newStored?.product?.name}
                            // onChange={(event) => onChange(event, "product")}
                            value={productInput}
                            onChange={(event) =>
                              setProductInput(event.target.value)
                            }
                          />
                        </PopoverTrigger>
                        {/* <Flex minWidth="200px" minHeight="100px"> */}
                        <PopoverContent
                          border="1px solid black"
                          shadow="2px 2px 10px gray"
                          overflow="hidden"
                        >
                          {productLoading ? (
                            <Spinner />
                          ) : (
                            productsList &&
                            fuzzySearch(
                              productInput,
                              productsList.map((item) => {
                                return [
                                  `${item.name !== undefined && item.name} ${
                                    item.alias !== undefined && item.alias
                                  } ${
                                    item.codeName !== undefined && item.codeName
                                  }`.split(/[, ]/g),
                                  item,
                                ];
                              })
                            ).map((item: any, index: number) => {
                              return (
                                <Flex
                                  key={item[1].productId}
                                  direction="column"
                                >
                                  <Flex
                                    p={2.5}
                                    cursor="pointer"
                                    _hover={{ bg: "gray.100" }}
                                    onClick={() => onProductClick(item[1])}
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
                              setProductsList(undefined);
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
                        {/* </Flex> */}
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
                        value={newStored?.amount?.value || ""}
                        onChange={(event) => onChange(event, "amount")}
                      />
                      <Select
                        ml={2}
                        width="25%"
                        minWidth="68px"
                        name="units"
                        value={newStored?.amount?.units}
                        onChange={(event) => onChange(event, "amount")}
                      >
                        {/* <option value="u">u.</option> */}
                        <option value="kg">kg</option>
                        {/* <option value="g">g</option> */}
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
                        value={newStored?.priceIn?.value || ""}
                        onChange={(event) => onChange(event, "priceIn")}
                      />
                      <Flex align="center">
                        <Select
                          ml={2}
                          minWidth="68px"
                          name="coin"
                          value={newStored?.priceIn?.coin}
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
                          value={newStored?.priceIn?.units}
                          onChange={(event) => onChange(event, "priceIn")}
                        >
                          {/* <option value="€/u">€/u.</option> */}
                          <option value="kg">kg</option>
                          {/* <option value="€/g">€/g</option> */}
                        </Select>
                      </Flex>
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
                      Detalls
                    </Flex>
                    <Input
                      width="75%"
                      type="text"
                      name="details"
                      value={newStored?.details || ""}
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
              {storedState.action === "create" && "Crea instancia"}
              {storedState.action === "modify" && "Modifica instancia"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
export default StoredModal;
