import { fuzzySearch } from "@/src/algorithms/fuzzySearch";
import { StoredProduct } from "@/src/components/Types/StoredProduct";
import { findById } from "@/src/hooks/useGetData";
import {
  Popover,
  PopoverAnchor,
  Input,
  PopoverContent,
  Spinner,
  Divider,
  Flex,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import StoredSelectorElement from "./StoredSelectorElement";
import { Product } from "@/src/components/Types/Product";
import { Provider } from "@/src/components/Types/AppUser";
import { Task } from "@/src/components/Types/Task";

type StoredSelectorInputProps = {
  allStored: StoredProduct[];
  setAllStored: (newAllStored: StoredProduct[]) => void;
  allProducts: Product[];
  allProviders: Provider[];
  targetProduct: Product | undefined;
  targetStored: StoredProduct[];
  task: Task;
  onNewPurchaseClick: () => void;
  onStoredClick: (storedId: StoredProduct) => void;
};

const StoredSelectorInput: React.FC<StoredSelectorInputProps> = ({
  allStored,
  setAllStored,
  allProducts,
  allProviders,
  targetProduct,
  targetStored,
  task,
  onNewPurchaseClick,
  onStoredClick,
}) => {
  const focusRef = React.useRef(null);
  const [storedListShow, setStoredListShow] = useState(false);
  const [storedLoading, setStoredLoading] = useState(false);
  const [storedInput, setStoredInput] = useState("");

  useEffect(() => {
    storedInput !== "" ? setStoredListShow(true) : setStoredListShow(false);
  }, [storedInput]);

  const [hovering, setHovering] = useState(false);

  const sumSP = targetStored?.reduce((total, item) => {
    const assigned = item?.assigned?.find((id) => {
      return id.id === task.taskId;
    });
    if (assigned) {
      return total + Number(assigned.amount.value);
    }
    return total;
  }, 0);

  return (
    <Popover
      initialFocusRef={focusRef}
      isOpen={storedListShow}
      onClose={() => setStoredListShow(false)}
    >
      <PopoverAnchor>
        <Input
          autoComplete="off"
          autoFocus
          type="text"
          name="name"
          ref={focusRef}
          value={storedInput}
          onChange={(event) => setStoredInput(event.target.value)}
          onFocus={() => storedInput && setStoredListShow(true)}
          onBlur={() => {
            if (hovering) return;
            setStoredListShow(false);
          }}
          placeholder="Més productes..."
        />
      </PopoverAnchor>
      <PopoverContent
        border="1px solid black"
        shadow="2px 2px 10px gray"
        overflow="hidden"
        onHoverStart={() => setHovering(true)}
        onHoverEnd={() => setHovering(false)}
      >
        {storedLoading ? (
          <Spinner />
        ) : (
          allStored &&
          fuzzySearch(
            // FuzzySearch directly with the whole pool of storedProducts
            storedInput,
            allStored
              .filter((item) => {
                return !targetStored?.includes(item);
              })
              .map((stored) => {
                // [product from storedProduct, storedProduct]
                return [
                  findById(allProducts, "productId", stored.productId!),
                  stored,
                ];
              })
              .map(([product, stored]) => {
                return [
                  `${product.name !== undefined && product.name} ${
                    product.alias !== undefined && product.alias
                  } ${
                    product.codeName !== undefined && product.codeName
                  }`.split(/[, ]/g),
                  stored,
                ];
              })
          ).map(
            (
              [inputArray, assocItem]: [String[], StoredProduct],
              index: number
            ) => {
              return (
                <Flex key={assocItem.storedId}>
                  <StoredSelectorElement
                    mode="element"
                    task={task}
                    item={assocItem}
                    targetProduct={targetProduct}
                    selected={false}
                    onStoredClick={() => {
                      setStoredInput("");
                      onStoredClick({
                        // Sets assocItem inside targetStored with assignation of task
                        ...assocItem,
                        assigned: assocItem?.assigned?.length
                          ? [
                              ...assocItem.assigned,
                              {
                                id: task.taskId,
                                amount: {
                                  value: Math.min(
                                    Number(task?.amount?.value - sumSP),
                                    Number(assocItem?.amount?.value)
                                  ),
                                  units: task.amount.units,
                                },
                              },
                            ]
                          : [
                              {
                                id: task.taskId,
                                amount: {
                                  value: Math.min(
                                    Number(task?.amount?.value - sumSP),
                                    Number(assocItem?.amount?.value)
                                  ),
                                  units: task.amount.units,
                                },
                              },
                            ],
                      });
                    }}
                    targetStored={[]}
                    modifyStored={() => {}}
                    allProducts={allProducts}
                    allProviders={allProviders}
                  />
                  <Divider borderColor="gray.300" />
                </Flex>
              );
            }
          )
        )}
        <Divider />
        <Flex
          p={2.5}
          cursor="pointer"
          _hover={{ bg: "gray.100" }}
          onClick={() => {
            setStoredInput("");
            onNewPurchaseClick();
          }}
        >
          + Crea nova compra
        </Flex>
      </PopoverContent>
    </Popover>
  );
};
export default StoredSelectorInput;
