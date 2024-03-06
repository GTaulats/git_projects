import { stageState } from "@/src/atoms/stageAtoms";
import {
  Box,
  Button,
  Divider,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Icon,
  Image,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { BsGear } from "react-icons/bs";
import { FaUserCircle } from "react-icons/fa";
import { FiLogOut, FiUsers } from "react-icons/fi";
import { useAuthState } from "react-firebase-hooks/auth";
import { LuComputer } from "react-icons/lu";
import { useRecoilState, useSetRecoilState } from "recoil";
import { StageMessage } from "../Typecasting";
import { auth } from "@/src/firebase/clientApp";
import AuthModal from "../Modal/Auth/AuthModal";
import { authModalState } from "@/src/atoms/authModalAtom";
import { signOut } from "firebase/auth";
import UserImage from "./UserImage";

type TopbarProps = {};

const Topbar: React.FC<TopbarProps> = () => {
  const router = useRouter();

  const [user] = useAuthState(auth);
  const [stage, setStage] = useRecoilState(stageState);
  const topbarMessage = StageMessage[stage.stage as keyof typeof StageMessage];
  const setAuthModalState = useSetRecoilState(authModalState);

  const logout = async () => {
    await signOut(auth);
  };

  const [openDrawer, setOpenDrawer] = useState(false);

  return (
    <>
      <AuthModal />
      <Box position="fixed" bg="white" width="100%" height="50px">
        {openDrawer && (
          <Drawer
            isOpen={openDrawer}
            placement="right"
            onClose={() => {
              setOpenDrawer(false);
            }}
          >
            <DrawerOverlay />
            <DrawerContent>
              <DrawerCloseButton />
              <DrawerHeader>
                <Flex justify="left" align="center" height="35px" mt={1}>
                  <UserImage imageURL={user?.photoURL} />
                  <Text ml={3}>{user?.displayName}</Text>
                </Flex>
              </DrawerHeader>
              <Divider />
              <DrawerBody padding={0} mt={2}>
                <Stack spacing={1} width="100%">
                  <Link href={"/"}>
                    <Flex
                      align="center"
                      p="15px 20px"
                      _hover={{ bg: "gray.200" }}
                      onClick={() => {
                        setOpenDrawer(false);
                      }}
                    >
                      <Icon
                        as={FiUsers}
                        mr={4}
                        fontSize="16pt"
                        fontWeight={800}
                      />
                      Estació de treball
                    </Flex>
                  </Link>
                  <Link href={"/database"}>
                    <Flex
                      p="15px 20px"
                      align="center"
                      _hover={{ bg: "gray.200" }}
                      onClick={() => {
                        setOpenDrawer(false);
                      }}
                    >
                      <Icon as={LuComputer} mr={4} fontSize="16pt" />
                      Base de dades
                    </Flex>
                  </Link>
                </Stack>
              </DrawerBody>

              <DrawerFooter p={0}>
                <Flex direction="column" width="100%">
                  <Divider />
                  <Link href={"/config"}>
                    <Flex
                      align="center"
                      p="15px 20px"
                      _hover={{ bg: "gray.200" }}
                      onClick={() => {
                        setOpenDrawer(false);
                      }}
                    >
                      <Icon
                        as={BsGear}
                        mr={4}
                        fontSize="16pt"
                        fontWeight={800}
                      />
                      Configuració
                    </Flex>
                  </Link>
                  <Flex
                    align="center"
                    p="15px 20px"
                    cursor="pointer"
                    _hover={{ bg: "gray.200" }}
                    onClick={() => {
                      setOpenDrawer(false);
                      logout();
                    }}
                  >
                    <Icon
                      as={FiLogOut}
                      mr={4}
                      fontSize="16pt"
                      fontWeight={800}
                      cursor="pointer"
                      _hover={{ bg: "gray.200" }}
                    />
                    Tanca sessió
                  </Flex>
                  <Divider />
                  <Flex padding="6px 16px" fontSize="9pt" justify="right">
                    Ok Peix App - 2024
                  </Flex>
                  <Text></Text>
                </Flex>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        )}
        <Flex align="center" borderBottom="1px solid gray" height="50px">
          <Flex justify="center" width="100%">
            <Text>{topbarMessage}</Text>
          </Flex>
          {user ? (
            <Flex
              mr={2}
              cursor="pointer"
              borderRadius="full"
              _hover={{
                shadow: "1px 1px 10px gray",
              }}
              onClick={() => {
                setOpenDrawer(true);
              }}
            >
              <UserImage imageURL={user?.photoURL} />
            </Flex>
          ) : (
            <Button
              mr={2}
              bg="gray.200"
              _hover={{ bg: "gray.100" }}
              onClick={() => {
                setAuthModalState({ open: true, view: "login" });
                return;
              }}
            >
              Iniciar sesión
            </Button>
          )}
        </Flex>
      </Box>
    </>
  );
};
export default Topbar;
