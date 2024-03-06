import { Flex, Text, Icon, Box } from "@chakra-ui/react";
import React, { useState } from "react";
import { FaMinus } from "react-icons/fa";
import { Product } from "../../Types/Product";
import { StoredProduct } from "../../Types/StoredProduct";

type StoredElementProps = {
  item: StoredProduct;
  handleStoredDel: () => void;
  onClick: () => void;
  productsList: Product[] | undefined;
};

const StoredElement: React.FC<StoredElementProps> = ({
  item,
  handleStoredDel,
  onClick,
  productsList,
}) => {
  console.log("productsList", productsList);
  const [showButtons, setShowButtons] = useState(false);

  const handleDel = async (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    event.stopPropagation();
    handleStoredDel();
  };

  return (
    <Box borderColor="blue.400">
      <Flex
        p={1}
        cursor="pointer"
        borderTop="1px solid"
        borderColor="gray.300"
        _hover={{ bg: "gray.100" }}
        onMouseEnter={() => {
          setShowButtons(true);
        }}
        onMouseLeave={() => {
          setShowButtons(false);
        }}
        onClick={onClick}
      >
        <Flex direction="column" width="100%">
          <Flex direction="row" flex={1} p="0 5px">
            {productsList ? (
              <Text>
                {
                  productsList.find((product: Product) => {
                    return item?.productId === product?.productId;
                  })?.name
                }
              </Text>
            ) : (
              "Product not found"
            )}
            <Text ml="auto" mr="auto">
              →
            </Text>
            <Text mr={1}>
              {item?.amount?.value || "... "}
              {item?.amount?.units}
            </Text>
          </Flex>
          <Flex align="center">
            <Text p="5px" ml={1} fontSize="9pt" color="gray.500">
              {item?.details || <wbr />}
            </Text>
            <Flex
              ml="auto"
              align="center"
              color="red"
              bg="gray.300"
              border="1px solid"
              borderColor="gray.400"
              borderRadius={7}
              _hover={{ bg: "gray.200" }}
              display={showButtons ? "unset" : "none"}
            >
              <Flex height="20px" width="20px" onClick={handleDel}>
                <Icon m="auto" fontSize="6pt" as={FaMinus} />
              </Flex>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </Box>
  );
};
export default StoredElement;
