import { NextPage } from "next";
import { useRecoilValue } from "recoil";
import { stageState } from "../atoms/stageAtoms";
import { Flex, Stack } from "@chakra-ui/react";
import Link from "next/link";
import Navbar from "../components/Navbar/Navbar";
import Topbar from "../components/Topbar/Topbar";
import NavView from "../components/NavView/NavView";
import InvoiceView from "../components/MainViews/Invoice/InvoiceView";
import ToPurchaseView from "../components/MainViews/ToPurchase/ToPurchaseView";
import ElaborationView from "../components/MainViews/Elaboration/ElaborationView";

const Home: NextPage = () => {
  // const [user, loadingUser] = useAuthState(auth)
  const stage = useRecoilValue(stageState).stage;
  // const [orders, setOrders] = useRecoilState(OrdersState);

  return (
    <>
      <Topbar />
      <Flex
        direction="row"
        bg="gray.300"
        minHeight="100vh"
        pt="65px"
        pb="20px"
        border="1px solid red"
      >
        <NavView />
        <Flex justify="center" flex={1}>
          <Flex
            bg="white"
            direction="column"
            flex={1}
            width="95%"
            maxWidth="860px"
            height="100%"
          >
            {stage === "invoice" && <InvoiceView />}
            {stage === "toPurchase" && <ToPurchaseView />}
            {stage === "elaboration" && <ElaborationView />}
          </Flex>
        </Flex>
      </Flex>
      {/* <Navbar /> */}
    </>
  );
};

export default Home;
