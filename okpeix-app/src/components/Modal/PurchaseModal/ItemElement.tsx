import { Flex, Divider, Text, Icon, Box } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { FaMinus } from "react-icons/fa";
import { Task } from "../../Types/Task";
import { Product } from "../../Types/Product";
import { getDataArray } from "@/src/hooks/useGetData";

type TaskElementProps = {
  task: Task;
  handleTaskDel: () => void;
  onClick: () => void;
  productsList: Product[] | undefined;
};

const TaskElement: React.FC<TaskElementProps> = ({
  task,
  handleTaskDel,
  onClick,
  productsList,
}) => {
  console.log("productsList", productsList);
  const [showButtons, setShowButtons] = useState(false);

  const handleDel = async (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    event.stopPropagation();
    handleTaskDel();
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
                    return task?.productId === product?.productId;
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
              {task?.amount?.value || "... "}
              {task?.amount?.units}
            </Text>
          </Flex>
          <Flex align="center">
            <Text p="5px" ml={1} fontSize="9pt" color="gray.500">
              {task?.details || <wbr />}
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
export default TaskElement;
