import React from "react";
import { Employee } from "../../Types/AppUser";
import { Divider, Flex, Text } from "@chakra-ui/react";

type EmployeeElementProps = {
  employee: Employee;
  onClick: () => void;
};

const EmployeeElement: React.FC<EmployeeElementProps> = ({
  employee,
  onClick,
}) => {
  return (
    <>
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
          <Flex p={2} justify="space-between" align="center">
            <Text fontWeight={600} fontSize="14pt">
              {employee?.name}
            </Text>
          </Flex>
          <Divider borderColor="gray.500" />
        </Flex>
      </Flex>
    </>
  );
};
export default EmployeeElement;
