import { Box, Flex, Icon } from "@chakra-ui/react";
import React from "react";
import { FaUserCircle } from "react-icons/fa";

type UserImageProps = {
  imageURL?: string | null;
};

const UserImage: React.FC<UserImageProps> = ({ imageURL }) => {
  return (
    <>
      {imageURL ? (
        <Flex width="35px" height="35px" borderRadius="full" overflow="hidden">
          <img src={imageURL} />
        </Flex>
      ) : (
        <Box
          p={1}
          height="40px"
          width="40px"
          border="1px solid"
          borderColor="gray.400"
          borderRadius="full"
          _hover={{ bg: "gray.100" }}
        >
          <Icon as={FaUserCircle} fontSize={30} color="gray.500" />
        </Box>
      )}
    </>
  );
};
export default UserImage;
