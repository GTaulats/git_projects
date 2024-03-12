import { NextPage } from "next";
import { useRecoilValue } from "recoil";
import { stageState } from "../atoms/stageAtoms";
import { Flex, Stack, Text } from "@chakra-ui/react";
import Link from "next/link";
import Navbar from "../components/Navbar/Navbar";
import Topbar from "../components/Topbar/Topbar";
import NavView from "../components/NavView/NavView";
import InvoiceView from "../components/MainViews/Invoice/InvoiceView";
import ToPurchaseView from "../components/MainViews/ToPurchase/ToPurchaseView";
import ElaborationView from "../components/MainViews/Elaboration/ElaborationView";
import { auth } from "../firebase/clientApp";
import { useAuthState } from "react-firebase-hooks/auth";
import OAuthButtons from "../components/Modal/Auth/OAuthButtons";
import AuthInputs from "../components/Modal/Auth/AuthInputs/AuthInputs";
import ResetPassword from "../components/Modal/Auth/AuthInputs/ResetPassword";

const Home: NextPage = () => {
  // const [user, loadingUser] = useAuthState(auth)
  const stage = useRecoilValue(stageState).stage;
  // const [orders, setOrders] = useRecoilState(OrdersState);

  const [user] = useAuthState(auth);
  return (
    <>
      {user ? (
        <>
          <Topbar />
          <Flex
            direction={{ base: "column", lg: "row" }}
            bg="gray.300"
            minHeight="100vh"
            pt={{ base: "40px", lg: "65px" }}
            pb="20px"
            border="1px solid red"
          >
            <NavView />
            <Flex justify="center" flex={1}>
              <Flex
                bg="white"
                direction="column"
                // flex={1}
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
      ) : (
        <Flex align="center" justify="center" height="100vh">
          <Flex
            direction="column"
            align="center"
            justify="center"
            width="500px"
            p={6}
            bgColor="white"
          >
            <OAuthButtons />
            <Text color="gray.500" fontWeight={700}>
              OR
            </Text>
            <AuthInputs />
            <ResetPassword />
          </Flex>
        </Flex>
      )}
    </>
  );
};

export default Home;
