import { fuzzySearch } from "@/src/algorithms/fuzzySearch";
import { allProvidersAtom } from "@/src/atoms/dataAtom";
import { Provider } from "@/src/components/Types/AppUser";
import { Product } from "@/src/components/Types/Product";
import { StoredProduct } from "@/src/components/Types/StoredProduct";
import { findById } from "@/src/hooks/useGetData";
import {
  Divider,
  Flex,
  Icon,
  Input,
  Popover,
  PopoverAnchor,
  PopoverContent,
  Spinner,
  Text,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { RxCross2 } from "react-icons/rx";
import StoredSelectorElement from "./StoredSelectorElement";
import { Task } from "@/src/components/Types/Task";
import StoredSelectorInput from "./StoredSelectorInput";

type SelectorSelectorProps = {
  targetProduct: Product | undefined;
  targetStored: StoredProduct[];
  task: Task;
  allProducts: Product[];
  allProviders: Provider[];
  allStored: StoredProduct[];
  setAllStored: (newAllStored: StoredProduct[]) => void; // allStored from DB
  modifyStored: (
    newArray: StoredProduct[],
    unassing: StoredProduct | undefined
  ) => void; // stored in task
  onNewPurchaseClick: () => void;
};
const SelectorSelector: React.FC<SelectorSelectorProps> = ({
  targetProduct,
  targetStored,
  task,
  allProducts,
  allProviders,
  allStored,
  setAllStored,
  modifyStored,
  onNewPurchaseClick,
}) => {
  console.log("targetStored :", targetStored);

  // console.log("targetStored selector", targetStored);
  const handleDel = (i: number) => {
    modifyStored(
      [...targetStored!.slice(0, i), ...targetStored!.slice(i + 1)],
      targetStored[i]
    );
  };

  const onStoredClick = (stored: StoredProduct) => {
    console.log("onStoredClick", stored);
    modifyStored(
      targetStored ? [...targetStored, stored] : [stored],
      undefined
    );
  };
  // console.log("allStored storedSelector", allStored);
  return (
    <>
      <StoredSelectorInput
        allProducts={allProducts}
        allProviders={allProviders}
        allStored={allStored}
        setAllStored={setAllStored}
        targetProduct={targetProduct} // To warn the product is not the one wanted (not filter out)
        targetStored={targetStored} // To filter out the already picked elements
        task={task}
        onNewPurchaseClick={onNewPurchaseClick}
        onStoredClick={onStoredClick}
      />
      {targetStored &&
        targetStored.map((stored, index) => {
          if (stored !== undefined)
            return (
              <Flex
                key={stored?.storedId}
                mt={2}
                p={1}
                borderRadius={4}
                bg="gray.200"
                flex={1}
                border="1px solid"
                borderColor="gray.400"
                shadow="1px 2px 5px gray"
              >
                <Flex
                  p={1}
                  align="center"
                  borderRadius={5}
                  cursor="pointer"
                  _hover={{ bg: "gray.100" }}
                  onClick={() => handleDel(index)}
                >
                  <Icon as={RxCross2} />
                </Flex>
                <StoredSelectorElement
                  mode="tag"
                  task={task}
                  item={stored}
                  targetProduct={targetProduct}
                  selected={true}
                  onStoredClick={() => {
                    onStoredClick(stored);
                  }}
                  targetStored={targetStored}
                  modifyStored={(newArray) => {
                    modifyStored(newArray, undefined);
                  }}
                  allProducts={allProducts}
                  allProviders={allProviders}
                />
              </Flex>
            );
        })}
    </>
  );
};
export default SelectorSelector;
