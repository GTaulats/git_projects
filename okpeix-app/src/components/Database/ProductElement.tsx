import React from "react";
import { Divider, Flex, Text } from "@chakra-ui/react";
import {
  strDirection,
  strTelNumber,
  strWorkHours,
} from "../Types/TypeFunctions";
import { Product } from "../Types/Product";

type ProductElementProps = {
  product: Product;
  onClick: () => void;
};

// TODO: ADD BUTTON TO ADD REMAINING INFO

const ProductElement: React.FC<ProductElementProps> = ({
  product,
  onClick,
}) => {
  return (
    <Flex width="33.33%" p={2} onClick={onClick}>
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
        <Flex direction="row" align="center">
          <Text fontWeight={600} fontSize="14pt" p={2}>
            {product.name}
          </Text>
          <Text color="gray.400" fontSize="10pt" mr={2}>
            {"- "}
            {product.productId}
          </Text>
        </Flex>
        <Divider borderColor="gray.500" />
        <Flex direction="column">
          <Flex p={2} textTransform="capitalize">
            <Text fontWeight={600} mr={1}>
              Alias:
            </Text>
            {product.alias ? product.alias : "..."}
          </Flex>
          <Divider />

          <Flex p={2} textTransform="capitalize">
            <Text fontWeight={600} mr={1}>
              Categoria:
            </Text>
            {product.type ? product.type : "..."}
          </Flex>

          <Divider />
          <Flex p={2}>
            <Text fontWeight={600} mr={1}>
              Mides:
            </Text>{" "}
            {product?.size &&
              product.size.map((item, index) => {
                return (
                  <Text>
                    {item.value}
                    {item.units}
                  </Text>
                );
              })}
          </Flex>

          <Divider />
          <Flex p={2}>
            <Text fontWeight={600} mr={1}>
              Detalls:
            </Text>{" "}
            {product.details ? product.details : "..."}
          </Flex>

          <Divider />

          <Text p={2}>Més... </Text>
        </Flex>
      </Flex>
    </Flex>
  );
};
export default ProductElement;
