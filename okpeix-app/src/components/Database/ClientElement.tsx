import React from "react";
import { Divider, Flex, Text } from "@chakra-ui/react";
import { Client } from "../Types/AppUser";
import {
  strDirection,
  strTelNumber,
  strWorkHours,
} from "../Types/TypeFunctions";

type ClientElementProps = {
  client: Client;
  onClick: () => void;
};

// TODO: ADD BUTTON TO ADD REMAINING INFO

const ClientElement: React.FC<ClientElementProps> = ({ client, onClick }) => {
  return (
    <Flex
      width={{ base: "100%", sm: "50%", md: "33.333%" }}
      height="33%"
      p={2}
      onClick={onClick}
    >
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
            {client.name}
          </Text>
          <Text color="gray.400" fontSize="10pt" mr={2}>
            {"- "}
            {client.type}
          </Text>
        </Flex>
        <Divider borderColor="gray.500" />
        <Flex direction="column">
          <Flex p={2} textTransform="capitalize">
            <Text fontWeight={600} mr={1}>
              Direcció:
            </Text>
            {client.direction ? strDirection(client.direction)! : "..."}
          </Flex>

          <Divider />
          <Flex p={2}>
            <Text fontWeight={600} mr={1}>
              Teléfon:
            </Text>{" "}
            {client.tel ? strTelNumber(client.tel)! : "..."}
          </Flex>

          <Divider />
          <Flex p={2}>
            <Text fontWeight={600} mr={1}>
              Horaris servei:
            </Text>{" "}
            {client.workHours ? strWorkHours(client.workHours)! : "..."}
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
export default ClientElement;
