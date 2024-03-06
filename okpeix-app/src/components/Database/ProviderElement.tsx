import React from "react";
import { Divider, Flex, Text } from "@chakra-ui/react";
import { Provider } from "../Types/AppUser";
import {
  strDirection,
  strTelNumber,
  strWorkHours,
} from "../Types/TypeFunctions";

type ProviderElementProps = {
  provider: Provider;
  onClick: () => void;
};

// TODO: ADD BUTTON TO ADD REMAINING INFO

const ProviderElement: React.FC<ProviderElementProps> = ({
  provider,
  onClick,
}) => {
  return (
    <Flex width="33.33%" height="33%" p={2} onClick={onClick}>
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
            {provider.name}
          </Text>
          <Text color="gray.400" fontSize="10pt" mr={2}></Text>
        </Flex>
        <Divider borderColor="gray.500" />
        <Flex direction="column">
          <Flex p={2} textTransform="capitalize">
            <Text fontWeight={600} mr={1}>
              Direcció:
            </Text>
            {provider.direction ? strDirection(provider.direction)! : "..."}
          </Flex>

          <Divider />
          <Flex p={2}>
            <Text fontWeight={600} mr={1}>
              Teléfon:
            </Text>{" "}
            {provider.tel ? strTelNumber(provider.tel)! : "..."}
          </Flex>

          <Divider />
          <Flex p={2}>
            <Text fontWeight={600} mr={1}>
              Horaris servei:
            </Text>{" "}
            {provider.workHours ? strWorkHours(provider.workHours)! : "..."}
          </Flex>

          <Divider />
          <Flex p={2}>
            <Text fontWeight={600} mr={1}>
              Plantilles de comandes:
            </Text>
            .......
          </Flex>
          <Divider />
          <Text p={2}>Més... </Text>
        </Flex>
      </Flex>
    </Flex>
  );
};
export default ProviderElement;
