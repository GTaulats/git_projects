import React from "react";
import { Product } from "../../Types/Product";
import { StoredProduct } from "../../Types/StoredProduct";
import PurchaseElement from "./PurchaseElement";
import { Provider } from "../../Types/AppUser";
import { useRecoilState } from "recoil";
import { purchaseModalState } from "@/src/atoms/objectAtoms/purchaseModalAtom";
import { Divider, Flex, Text } from "@chakra-ui/react";
import { findById } from "@/src/hooks/useGetData";

type SortedPurchasesProps = {
  allPurchases: StoredProduct[];
  allProviders: Provider[];
  allProducts: Product[];
};

const SortedPurchases: React.FC<SortedPurchasesProps> = ({
  allProducts,
  allProviders,
  allPurchases,
}) => {
  // console.log("allProducts", allProducts);
  // console.log("allProviders", allProviders);
  // console.log("allPurchases", allPurchases);

  const [purchaseState, setPurchaseState] = useRecoilState(purchaseModalState);

  const onPurchaseElementClick = (order: StoredProduct) => {
    setPurchaseState((prev) => ({
      ...prev,
      open: true,
      action: "modify",
      context: order,
    }));
  };

  const sortPurchases = (allPurchases: StoredProduct[]) => {
    // transforms the raw purchases array into an object of arrays sorted by provider
    const totalProviders = allPurchases.reduce(
      (totalProviders: string[], item) => {
        const itemProvider = item.providerId ? item.providerId : "none";
        if (!totalProviders.includes(itemProvider)) {
          totalProviders.push(itemProvider);
        }
        return totalProviders;
      },
      []
    );
    return totalProviders.reduce(
      (sortedPurchases: { [key: string]: any }, provider) => {
        sortedPurchases[provider] = allPurchases.filter((item) => {
          return (item.providerId || "none") === provider;
        });
        return sortedPurchases;
      },
      {}
    );
  };

  const sortedPurchases = sortPurchases(allPurchases);

  // console.log("sortedPurchases", sortedPurchases);

  return (
    <Flex direction="column" flex={1}>
      {/* No provider first */}
      {sortedPurchases.none && (
        <Flex direction="column">
          <Text>Falta seleccionar proveïdor per:</Text>
          <Flex>
            {sortedPurchases.none.map((item: StoredProduct) => {
              return (
                <Flex key={item.storedId}>
                  <PurchaseElement
                    purchase={item}
                    onClick={() => onPurchaseElementClick(item)}
                  />
                </Flex>
              );
            })}
          </Flex>
        </Flex>
      )}

      <Divider border="2px solid gray" m="5px 0" />
      <Flex flexWrap="wrap">
        {Object.keys(sortedPurchases).map((key, index) => {
          if (key !== "none") {
            return (
              <Flex
                key={key}
                width={{ base: "100%", sm: "50%", md: "33.333%" }}
                p={2}
              >
                <Flex
                  flex={1}
                  p={2}
                  direction="column"
                  border="2px solid black"
                  borderRadius={10}
                  boxShadow="inset 0 0 10px 2px rgba(0,0,0,0.08)"
                >
                  <Text fontSize="11pt">Productes de:</Text>
                  <Text fontSize="14pt" fontWeight={600}>
                    {findById(allProviders, "providerId", key).name}
                  </Text>
                  <Divider m="7px 0" />
                  <Flex direction="column" flex={1}>
                    {sortedPurchases[key].map((item: StoredProduct) => {
                      return (
                        <PurchaseElement
                          key={item.storedId}
                          purchase={item}
                          onClick={() => onPurchaseElementClick(item)}
                        />
                      );
                    })}
                  </Flex>
                </Flex>
              </Flex>
            );
          }
        })}
      </Flex>
      {/* {allPurchases.map((item: StoredProduct, index) => {
        if (!item.providerId) {
        }
        return (
          <PurchaseElement
            key={item.storedId}
            purchase={item}
            onClick={() => onPurchaseElementClick(item)}
          />
        );
      })} */}
    </Flex>
  );
};
export default SortedPurchases;
