import { NextPage } from "next";
import { useRecoilValue } from "recoil";
import { Flex, Stack, Text } from "@chakra-ui/react";
import { stageState } from "@/src/atoms/stageAtoms";
import { useAuthState } from "react-firebase-hooks/auth";
import ElaborationView from "@/src/components/MainViews/Elaboration/ElaborationView";
import InvoiceView from "@/src/components/MainViews/Invoice/InvoiceView";
import ToPurchaseView from "@/src/components/MainViews/ToPurchase/ToPurchaseView";
import AuthInputs from "@/src/components/Modal/Auth/AuthInputs/AuthInputs";
import ResetPassword from "@/src/components/Modal/Auth/AuthInputs/ResetPassword";
import OAuthButtons from "@/src/components/Modal/Auth/OAuthButtons";
import NavView from "@/src/components/NavView/NavView";
import Topbar from "@/src/components/Topbar/Topbar";
import { auth } from "@/src/firebase/clientApp";
import { useRouter } from "next/router";
import { useEffect } from "react";

const Home: NextPage = () => {
  // const [user, loadingUser] = useAuthState(auth)
  const stage = useRecoilValue(stageState).stage;
  // const [orders, setOrders] = useRecoilState(OrdersState);

  const [user] = useAuthState(auth);
  const router = useRouter();

  if (!user) router.push(`/`);

  return (
    <>
      {user && (
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
      )}
    </>
  );
};

export default Home;
