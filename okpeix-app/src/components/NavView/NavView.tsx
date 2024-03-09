import { Divider, Flex, SimpleGrid, Stack } from "@chakra-ui/react";
import React, { useState } from "react";
import SectionCard from "./SectionCard";

type NavViewProps = {};

const NavView: React.FC<NavViewProps> = () => {
  const [showBar, setShowBar] = useState(true);

  return (
    <>
      {showBar && (
        <Flex
          m={{ base: "20px 0", lg: "0 0 0 20px" }}
          // width={{ base: "unset", lg: "200px" }}
          // height={{ base: "200px", lg: "unset" }}
        >
          <Stack
            p={{ base: "0 20px", lg: "unset" }}
            direction={{ base: "row", lg: "column" }}
            overflow="auto"
          >
            <SectionCard stage="invoice" />
            <SectionCard stage="toPurchase" />
            <SectionCard stage="elaboration" />
            <SectionCard stage="delivery" />
            {/* <Divider
          orientation={{ base: "vertical", lg: "horizontal" } as const}
          m="5px 0"
          borderColor="black"
        /> */}
            <SectionCard stage="reminders" />
            <SectionCard stage="calculator" />
          </Stack>
        </Flex>
      )}
    </>
  );
};
export default NavView;
