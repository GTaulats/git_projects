import { Provider } from "@/src/components/Types/AppUser";
import { Product } from "@/src/components/Types/Product";
import { StoredProduct } from "@/src/components/Types/StoredProduct";
import { Amount, Task } from "@/src/components/Types/Task";
import { findById } from "@/src/hooks/useGetData";
import {
  Button,
  Divider,
  Flex,
  HStack,
  Icon,
  Input,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Popover,
  PopoverArrow,
  PopoverCloseButton,
  PopoverContent,
  PopoverTrigger,
  Select,
  Stack,
  Text,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { IoArrowDown } from "react-icons/io5";

type StoredSelectionElementProps = {
  task: Task;
  selected: boolean;
  item: StoredProduct;
  targetProduct: Product | undefined;
  allProducts: Product[];
  allProviders: Provider[];
  onStoredClick: () => void;
  targetStored: StoredProduct[];
  modifyStored: (newArray: StoredProduct[]) => void; // stored in task
};

const StoredSelectionElement: React.FC<StoredSelectionElementProps> = ({
  task,
  selected,
  item,
  targetProduct,
  allProducts,
  allProviders,
  onStoredClick,
  targetStored,
  modifyStored,
}) => {
  const sumSP = targetStored?.reduce((total, item) => {
    const assigned = item?.assigned?.find((id) => {
      return id.id === task.taskId;
    });
    if (assigned) {
      return total + Number(assigned.amount.value);
    }
    return total;
  }, 0);

  const [input, setInput] = useState<Amount>(() => {
    console.log("item", item);
    const assigned = item?.assigned?.find((stored) => {
      console.log("stored", stored);
      return stored.id === task.taskId;
    });
    console.log("assigned", assigned);
    console.log("task", task);
    return assigned
      ? assigned.amount
      : {
          value: task.amount?.value
            ? Math.min(task.amount.value - sumSP, Number(item?.amount?.value))
            : 0,
          units: task.amount?.units ? task.amount.units : "kg",
        };
  });

  console.log("input", input);

  // console.log("targetStored", targetStored);
  const onValueChange = (value: string) => {
    setInput((prev) => ({
      ...prev,
      value: Number(value),
    }));
    // Modify data in targetStored
    targetStored &&
      (targetStored.includes(item)
        ? modifyStored(
            targetStored.map((sp) => {
              if (sp.storedId === item.storedId) {
                // Returns modifyStored with new assignment corresponding to this task
                return {
                  ...sp,
                  assigned: sp.assigned.map((assi) => {
                    if (assi.id === task.taskId)
                      return {
                        id: task.taskId,
                        amount: { value: Number(value), units: "kg" } as Amount,
                      };
                    return assi;
                  }),
                };
              }
              return sp;
            })
          )
        : targetStored.push(item));
  };

  const onUnitsChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setInput((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  // console.log("targetProduct", targetProduct);

  function amountSum(array: Amount[]) {
    return array.reduce((total, item) => {
      total = {
        value: total.value + item.value,
        units: item.units,
      } as Amount;
      return total;
    });
  }

  return (
    <>
      <Flex key={item?.storedId} direction="column" flex={1} p={1}>
        <Flex
          align="center"
          justify="space-between"
          cursor={selected ? "unset" : "pointer"}
          _hover={{ bg: selected ? "unset" : "gray.100" }}
          onClick={() => {
            !selected && onStoredClick();
          }}
        >
          {/* PRODUCT */}
          {item?.productId && (
            <>
              {item.productId !== targetProduct?.productId ? (
                <Text color="red" fontWeight={600}>
                  {findById(allProducts, "productId", item.productId).name}
                </Text>
              ) : (
                <Text>
                  {findById(allProducts, "productId", item.productId).name}
                </Text>
              )}
            </>
          )}

          {/* AMOUNT */}
          {item?.amount &&
          !item?.assigned?.filter((item) => {
            return item.id == task.taskId;
          }) ? (
            <Text color="blue" fontWeight={600}>
              {item.amount?.value}
              {item.amount?.units}
            </Text>
          ) : (
            <>
              {/* Popover to choose amount of product to use for this SP */}
              <Popover placement="right">
                <PopoverTrigger>
                  <Button
                    border="1px solid"
                    borderColor="gray.400"
                    p="5px 11px"
                  >
                    {input.value + " " + input.units}
                  </Button>
                </PopoverTrigger>

                <PopoverContent shadow="2px 2px 5px gray" width="fit-content">
                  <PopoverArrow />

                  <Flex direction="column" width="fit-content">
                    <Flex
                      p="10px 15px"
                      fontWeight={600}
                      color={
                        input.value < 0
                          ? "red"
                          : input.value < Number(item.amount?.value)
                          ? "unset"
                          : input.value == item.amount?.value
                          ? "gray.400"
                          : input.value > Number(item.amount?.value)
                          ? "red.400"
                          : "unset"
                      }
                      align="center"
                    >
                      Disponible: {input.value} / {item.amount?.value}{" "}
                      {item.amount?.units}
                      <Button // Max button
                        size="xs"
                        ml={2}
                        onClick={() => {
                          setInput({
                            value: Math.min(
                              Number(item.amount?.value),
                              task.amount?.value - sumSP + input.value
                            ),
                            units: item?.amount?.units || task.amount.units,
                          });
                          onValueChange(
                            String(
                              Math.min(
                                Number(item.amount?.value),
                                task.amount?.value - sumSP + input.value
                              )
                            )
                          );
                        }}
                      >
                        Max.
                      </Button>
                    </Flex>
                    <HStack p="0 10px 10px 10px" m={0} justify="center">
                      <NumberInput
                        width="80px"
                        value={input.value}
                        min={0}
                        max={Math.min(
                          Number(item.amount?.value),
                          task.amount?.value - sumSP + input.value
                        )}
                        onChange={onValueChange}
                      >
                        <NumberInputField />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                      <Select
                        name="units"
                        value={input.units}
                        onChange={onUnitsChange}
                        width="80px"
                      >
                        <option value="u">u.</option>
                        <option value="kg">kg</option>
                        <option value="g">g</option>
                      </Select>
                    </HStack>
                    {/* Here would go the approx warning about unit conversion */}
                  </Flex>
                </PopoverContent>
              </Popover>

              {/* <Flex direction="column" align="center"> */}
              {/* AMOUNT IN SP */}
              {/* <Text>
                Sum of all assigned in SP / Total of SP
                {item?.assigned &&
                  amountSum(
                    item.assigned.map((i) => {
                      return i[1];
                    })
                  ).value + "/"}
                {item?.amount?.value}
                {item?.amount?.units}
              </Text>

              <Icon as={IoArrowDown} />

              AMOUNT ASSIGNED TO TASK
              <Flex align="center">
                {mode === "tag" && (
                  <>
                    <Input
                      size="xs"
                      variant="unstyled"
                      p="5px 10px"
                      mr={1}
                      width="50px"
                      bg="gray.100"
                      border="1px solid"
                      borderColor="gray.400"
                      fontSize="10pt"
                      textAlign="right"
                    />
                    {item.amount?.units}
                  </>
                )}
                {item && task?.amount ? (
                  <Text
                    color={
                      item.amount?.value &&
                      item.amount.value - task.amount?.value < 0
                        ? "red.400"
                        : "unset"
                    }
                  >
                    {item.amount?.value
                      ? item.amount.value -
                        (isNaN(task.amount.value) ? 0 : task.amount.value)
                      : "0"}
                    {item.amount?.units}
                  </Text>
                ) : (
                  "···"
                )}
              </Flex>
            </Flex> */}
            </>
          )}
          <Flex direction="row" ml={2}>
            <Flex>
              <Divider mr={2} orientation="vertical" border="1px solid gray" />
            </Flex>
            {item?.purchased !== true && (
              <Flex
                align="center"
                fontSize="10pt"
                fontWeight={600}
                direction="column"
              >
                <Text color={"red.400"}>Pendent de comprar</Text>
                <Text color={item?.providerId ? "unset" : "orange"}>
                  {item?.providerId
                    ? findById(allProviders, "providerId", item.providerId).name
                    : "Cap proveïdor assignat"}
                </Text>
                <Flex>{item?.gotBy}</Flex>{" "}
                {/* TODO: Color code proportional to product expiration day */}
              </Flex>
            )}
          </Flex>
        </Flex>
        {item?.elaborations?.length > 0 && (
          <>
            <Divider />
            <Flex>Estat del producte:</Flex>
            {item?.elaborations.map((item, index) => {
              return <Text>{item.name}</Text>;
            })}
          </>
        )}
      </Flex>
    </>
  );
};
export default StoredSelectionElement;
