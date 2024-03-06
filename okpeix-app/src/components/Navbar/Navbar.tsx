import { stageState } from "@/src/atoms/stageAtoms";
import { Flex, Icon, Stack, Text } from "@chakra-ui/react";
import React from "react";
import { FaRegFileAlt } from "react-icons/fa";
import { FaTruckRampBox } from "react-icons/fa6";
import { GiBoatFishing } from "react-icons/gi";
import { PiKnifeFill } from "react-icons/pi";
import { useRecoilState } from "recoil";

/* Navbar(stages): Creation of task | Purchase of fish | Performing task | Delivery  */

const Navbar: React.FC = () => {
  const [stage, setStage] = useRecoilState(stageState);

  return (
    <Flex
      bg="white"
      direction="row"
      justify="space-around"
      border="1px solid red"
      width="100%"
      height="75px"
      position="fixed"
      bottom={0}
      p="10px 0"
    >
      <Flex
        p={3}
        borderRadius="full"
        boxShadow="0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)"
        cursor="pointer"
        _hover={{ bg: "gray.100" }}
        height="50px"
        width="50px"
        justify="center"
        align="center"
        onClick={() =>
          setStage((prev) => ({
            ...prev,
            stage: "invoice",
          }))
        }
      >
        <Icon as={GiBoatFishing} fontSize={24} />
        {/* <Text fontSize={14}>Compra</Text> */}
      </Flex>
      <Flex
        p={3}
        borderRadius="full"
        boxShadow="0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)"
        cursor="pointer"
        _hover={{ bg: "gray.100" }}
        height="50px"
        width="50px"
        justify="center"
        align="center"
        onClick={() =>
          setStage((prev) => ({
            ...prev,
            stage: "elaboration",
          }))
        }
      >
        <Icon as={PiKnifeFill} fontSize={24} />
        {/* <Text fontSize={14}>Compra</Text> */}
      </Flex>
      <Flex
        p={3}
        borderRadius="full"
        boxShadow="0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)"
        cursor="pointer"
        _hover={{ bg: "gray.100" }}
        height="50px"
        width="50px"
        justify="center"
        align="center"
        onClick={() =>
          setStage((prev) => ({
            ...prev,
            stage: "out",
          }))
        }
      >
        <Icon as={FaTruckRampBox} fontSize={24} />
        {/* <Text fontSize={14}>Compra</Text> */}
      </Flex>
      <Flex
        p={3}
        borderRadius="full"
        boxShadow="0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)"
        cursor="pointer"
        _hover={{ bg: "gray.100" }}
        height="50px"
        width="50px"
        justify="center"
        align="center"
        onClick={() =>
          setStage((prev) => ({
            ...prev,
            stage: "paycheck",
          }))
        }
      >
        <Icon as={FaRegFileAlt} fontSize={24} />
        {/* <Text fontSize={14}>Compra</Text> */}
      </Flex>
    </Flex>
  );
};
export default Navbar;
