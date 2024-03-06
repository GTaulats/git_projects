import { stageState } from "@/src/atoms/stageAtoms";
import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Flex,
  Heading,
  Icon,
  Text,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { BsGear } from "react-icons/bs";
import { useRecoilState, useSetRecoilState } from "recoil";
import { StageMessage } from "../Typecasting";

type SectionCardProps = {
  stage: string;
};

const SectionCard: React.FC<SectionCardProps> = ({ stage }) => {
  const [showOpt, setShowOpt] = useState(false);
  const setStage = useSetRecoilState(stageState);

  const onHover = () => {};
  const handleOpt = async (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    event.stopPropagation();
  };
  const onClick = () => {
    setStage((prev) => ({
      ...prev,
      stage: stage,
    }));
  };

  return (
    <>
      <Flex
        bg="white"
        display="column"
        p="16px"
        borderRadius={20}
        position="relative"
        cursor="pointer"
        _hover={{ bg: "gray.50" }}
        onMouseEnter={() => {
          setShowOpt(true);
        }}
        onMouseLeave={() => {
          setShowOpt(false);
        }}
        onClick={onClick}
      >
        <Text fontWeight={700} fontSize="14pt" mb={2}>
          {StageMessage[stage as keyof typeof StageMessage]}
        </Text>
        <Flex>View a summary of all your customers over the last month</Flex>
        <Box
          position="absolute"
          bottom="10px"
          right="10px"
          display={showOpt ? "unset" : "none"}
          onClick={handleOpt}
        >
          <Flex
            height="30px"
            width="30px"
            borderRadius="full"
            cursor="pointer"
            bg="gray.200"
            justify="center"
            align="center"
            _hover={{ bg: "gray.300" }}
          >
            <Icon fontSize="10pt" as={BsGear} />
          </Flex>
        </Box>
      </Flex>
    </>
  );
};
export default SectionCard;
