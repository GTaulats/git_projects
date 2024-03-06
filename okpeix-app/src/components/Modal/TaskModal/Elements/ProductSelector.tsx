import { fuzzySearch } from "@/src/algorithms/fuzzySearch";
import { Product } from "@/src/components/Types/Product";
import {
  Divider,
  Flex,
  Icon,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Spinner,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { RxCross2 } from "react-icons/rx";

type ProductSelectorProps = {
  target: Product | undefined;
  allProducts: Product[];
  handleDel: () => void;
  onProductClick: (product: Product) => void;
  onNewProductClick: () => void;
};

const ProductSelector: React.FC<ProductSelectorProps> = ({
  target,
  allProducts,
  handleDel,
  onProductClick,
  onNewProductClick,
}) => {
  const [productListShow, setProductListShow] = useState(false);
  const [productLoading, setProductLoading] = useState(false);
  const [productInput, setProductInput] = useState("");

  useEffect(() => {
    productInput !== "" ? setProductListShow(true) : setProductListShow(false);
  }, [productInput]);

  const focusRef = React.useRef(null);

  return (
    <>
      {allProducts?.find((item) => {
        return item.productId === target?.productId;
      }) ? (
        <Flex justify="left" width="75%">
          <Flex // Raw product input
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
              onClick={handleDel}
            >
              <Icon as={RxCross2} />
            </Flex>
            <Flex ml={2}>{target?.name}</Flex>
          </Flex>
        </Flex>
      ) : (
        <Popover
          initialFocusRef={focusRef}
          isOpen={productListShow}
          onClose={() => setProductListShow(false)}
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
              value={productInput}
              onChange={(event) => setProductInput(event.target.value)}
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
              allProducts &&
              fuzzySearch(
                productInput,
                allProducts.map((item) => {
                  return [
                    `${item.name !== undefined && item.name} ${
                      item.alias !== undefined && item.alias
                    } ${item.codeName !== undefined && item.codeName}`.split(
                      /[, ]/g
                    ),
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
                        setProductInput("");
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
                onNewProductClick();
              }}
            >
              + Crea nou producte
            </Flex>
          </PopoverContent>
          {/* </Flex> */}
        </Popover>
      )}
    </>
  );
};
export default ProductSelector;
