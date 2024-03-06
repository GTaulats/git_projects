import { Divider, Flex, SimpleGrid, Stack } from "@chakra-ui/react";
import React from "react";
import SectionCard from "./SectionCard";

type NavViewProps = {};

const NavView: React.FC<NavViewProps> = () => {
  return (
    <Flex width="20%">
      <Stack ml={5} overflow="auto">
        <SectionCard stage="invoice" />
        <SectionCard stage="toPurchase" />
        <SectionCard stage="elaboration" />
        <SectionCard stage="delivery" />
        <Divider m="5px 0" borderColor="black" />
        <SectionCard stage="reminders" />
        <SectionCard stage="calculator" />
      </Stack>
    </Flex>
  );
};
export default NavView;
