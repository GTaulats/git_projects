import {
  Tr,
  Td,
  Input,
  Text,
  Flex,
  Button,
  Icon,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverHeader,
  Portal,
  Stack,
} from "@chakra-ui/react";
import React from "react";
import { BsThreeDots } from "react-icons/bs";
import { Task } from "../../Types/Task";

// ISOLATING EVERY SINGLE COMPONENT AND UPON SUBMITTING/SAVING, COLLECT ALL INFO
// SAVING IN REAL TIME IS NOICE, BUT WOULD REQUIRE SPAMMING USEMEMO TO ACHIEVE 16ms
// USEEFFECT TO DELAY SAVING IN REAL TIME???

type TaskInElementProps = {
  item: Task;
  index: number;
  taskIndex: number;
  stopProp: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  onTaskChange: (
    event: React.ChangeEvent<HTMLInputElement>,
    taskIndex: number
  ) => void;
  copyTask: () => void;
  delTask: () => void;
};

const TaskInElement: React.FC<TaskInElementProps> = ({
  item,
  taskIndex,
  stopProp,
  onTaskChange,
  copyTask,
  delTask,
}) => {
  return (
    <>
      <Tr key={taskIndex} borderTop="2px solid gray">
        <Td>
          <Input
            bg="gray.200"
            width="150px"
            borderRadius="15px"
            p="5px 10px"
            name="productId"
            fontSize="12pt"
            fontWeight={500}
            _hover={{
              bg: "gray.100",
              border: "1px solid",
              borderColor: "gray.300",
            }}
            onClick={stopProp}
            type="string"
            onChange={(event) => onTaskChange(event, taskIndex)}
            value={item.taskId || ""}
          />
        </Td>
        <Td isNumeric>
          <Input
            name="amount"
            bg="gray.200"
            textAlign="right"
            width="75px"
            borderRadius="15px"
            p="5px 10px"
            fontSize="12pt"
            fontWeight={500}
            _hover={{
              bg: "gray.100",
              border: "1px solid",
              borderColor: "gray.300",
            }}
            onClick={stopProp}
            type="number"
            onChange={(event) => onTaskChange(event, taskIndex)}
            value={item.amount ?? ""}
          />
          {" → "}
          <Input
            name="realAmount"
            bg="gray.200"
            textAlign="right"
            width="75px"
            borderRadius="15px"
            p="5px 10px"
            fontSize="12pt"
            fontWeight={500}
            _hover={{
              bg: "gray.100",
              border: "1px solid",
              borderColor: "gray.300",
            }}
            onClick={stopProp}
            type="number"
            onChange={(event) => onTaskChange(event, taskIndex)}
            value={item.realAmount ?? ""}
          />
        </Td>
        <Td isNumeric>
          <Input
            name="priceOut"
            bg="gray.200"
            textAlign="right"
            width="75px"
            borderRadius="15px"
            p="5px 10px"
            fontSize="12pt"
            fontWeight={500}
            _hover={{
              bg: "gray.100",
              border: "1px solid",
              borderColor: "gray.300",
            }}
            onClick={stopProp}
            type="number"
            onChange={(event) => onTaskChange(event, taskIndex)}
            value={item.priceOut ?? ""}
          />
        </Td>
        <Td isNumeric>
          {item.realAmount && item.priceOut
            ? (Number(item.realAmount) * Number(item.priceOut)).toFixed(2)
            : "_______"}
        </Td>
      </Tr>
      <Tr>
        <Td p={0} colSpan={4}>
          <Flex justify="space-between">
            <Flex align="center" p={2} flex={1}>
              <Text mr={2}>Descripció:</Text>
              <Input
                name="details"
                bg="gray.200"
                width="200px"
                border={0}
                borderRadius="15px"
                p="5px 10px"
                fontSize="12pt"
                fontWeight={500}
                _hover={{
                  bg: "gray.100",
                  border: "1px solid",
                  borderColor: "gray.300",
                }}
                onClick={stopProp}
                type="text"
                onChange={(event) => onTaskChange(event, taskIndex)}
                value={item.details ?? ""}
              />
            </Flex>
            <Popover>
              <PopoverTrigger>
                <Flex
                  borderRadius="full"
                  p="7px"
                  height="min-content"
                  width="min-content"
                  align="center"
                  m="auto 0"
                  mr={2}
                  cursor="pointer"
                  _hover={{ bg: "gray.100" }}
                >
                  <Icon as={BsThreeDots} />
                </Flex>
              </PopoverTrigger>
              <Portal>
                <PopoverContent height="min-content" width="min-content">
                  <PopoverArrow />
                  <PopoverBody>
                    <Stack>
                      <Button onClick={copyTask}>Duplica tasca</Button>
                      <Button color="red.400" onClick={delTask}>
                        Elimina tasca
                      </Button>
                    </Stack>
                  </PopoverBody>
                </PopoverContent>
              </Portal>
            </Popover>
          </Flex>
        </Td>
      </Tr>
    </>
  );
};

// Only rerender element if "item" changes
const MTaskInElement = React.memo(TaskInElement, (prevProps, nextProps) => {
  return (
    prevProps.item === nextProps.item && prevProps.index === nextProps.index
  );
});

export default MTaskInElement;
