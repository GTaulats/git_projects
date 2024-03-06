import React, { useEffect, useState } from "react";
import { Divider, Flex, Text } from "@chakra-ui/react";
import { Order } from "../../Types/Order";
import { Client, Provider } from "../../Types/AppUser";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { allClientsAtom, allProductsAtom } from "@/src/atoms/dataAtom";
import { findById, getDataArray } from "@/src/hooks/useGetData";
import { StoredProduct } from "../../Types/StoredProduct";
import { Product } from "../../Types/Product";

type PurchaseElementProps = {
  purchase: StoredProduct;
  onClick: () => void;
};

const PurchaseElement: React.FC<PurchaseElementProps> = ({
  purchase,
  onClick,
}) => {
  const allClients = useRecoilValue(allClientsAtom).allClients;
  const allProducts = useRecoilValue(allProductsAtom).allProducts;

  const [targetClient, setTargetClient] = useState<Provider | undefined>(
    purchase?.providerId
      ? (findById(
          allClients,
          "clientId",
          purchase.providerId
        ) as unknown as Provider)
      : undefined
  );

  return (
    <Flex p={1} onClick={onClick}>
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
            {purchase?.gotBy && String(purchase.gotBy)}
          </Text>
        </Flex>
        <Divider borderColor="gray.500" />
        <Flex direction="column">
          <Divider />

          {purchase?.productId && (
            <Flex>
              {
                (
                  findById(
                    allProducts,
                    "productId",
                    purchase.productId
                  ) as unknown as Product
                ).name
              }
            </Flex>
          )}

          <Divider />

          {purchase?.details && (
            <Flex p={2} direction="column">
              <Text fontWeight={600} mr={1}>
                Detalls:
              </Text>
              <Text>{purchase.details}</Text>
            </Flex>
          )}
        </Flex>
      </Flex>
    </Flex>
  );
};

export default PurchaseElement;
