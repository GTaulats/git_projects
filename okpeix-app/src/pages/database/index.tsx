/* In this page the user can read, write and delete the database */

import { Icon } from "@chakra-ui/react";
import { Divider, Flex, Select, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import { FaLongArrowAltLeft } from "react-icons/fa";
import ClientDB from "../../DatabaseViews/ClientDB";
import ProductDB from "@/src/DatabaseViews/ProductDB";
import { useRouter } from "next/router";
import EmployeeDB from "@/src/DatabaseViews/EmployeeDB";
import ProviderDB from "@/src/DatabaseViews/ProviderDB";
import ElaborationDB from "@/src/DatabaseViews/ElaborationDB";

type dbPageProps = {};

const dbPage: React.FC<dbPageProps> = () => {
  const [record, setRecord] = useState("elaborations");
  const router = useRouter();

  const RecordMessage = {
    clients: `Clients`,
    providers: `Proveïdors`,
    clientSlips: `Albarans`,
    providerSlips: `Factures`,
    stored: `Emmagatzemat`,
    employees: `Empleats`,
    products: `Productes`,
    elaborations: `Elaboracions`,
  };

  const records = [
    "clients",
    "providers",
    "clientSlips",
    "providerSlips",
    "stored",
    "employees",
    "products",
    "elaborations",
  ];

  return (
    <>
      <Flex
        bg="gray.400"
        direction="column"
        // justify="center"
        align="center"
        minHeight="100vh"
      >
        <Flex
          height="60px"
          bg="white"
          borderBottom="1px solid"
          width="100%"
          align="center"
        >
          <Flex
            p={2}
            ml={3}
            width="min-content"
            borderRadius="full"
            bg="gray.200"
            cursor="pointer"
            _hover={{ bg: "gray.100" }}
            onClick={() => router.push("/")}
          >
            <Icon as={FaLongArrowAltLeft} />
          </Flex>
        </Flex>
        <Flex
          bg="white"
          direction="column"
          align="center"
          width="100%"
          maxWidth="860px"
          height="100%"
          // overflow="hidden"
        >
          <Flex align="center" height="100%">
            <Text mr={2}>Accedir a registre: </Text>
            <Select
              cursor="pointer"
              padding="5px 2px 3px 10px"
              borderRadius={4}
              m="5px"
              _hover={{ outline: "1px solid", outlineColor: "gray.200" }}
              value={record}
              onChange={(event) => setRecord(event.target.value)}
            >
              {records.map((item, index) => {
                return (
                  <option key={index} value={item}>
                    {RecordMessage[item as keyof typeof RecordMessage]}
                  </option>
                );
              })}
            </Select>
          </Flex>
          <Divider />
          <Flex align="center" width="100%">
            <Text>Ordre: </Text>
          </Flex>
          <Divider />
          <Flex width="100%" height="100%">
            <>
              {record === "clients" && <ClientDB />}
              {record === "products" && <ProductDB />}
              {record === "employees" && <EmployeeDB />}
              {record === "providers" && <ProviderDB />}
              {record === "elaborations" && <ElaborationDB />}
            </>
          </Flex>
        </Flex>
      </Flex>
    </>
  );
};
export default dbPage;
