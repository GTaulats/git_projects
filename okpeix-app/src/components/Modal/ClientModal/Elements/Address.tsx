import {
  Popover,
  PopoverTrigger,
  Flex,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  PopoverBody,
  Text,
  Input,
  Select,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { Direction } from "../../../Types/AppUser";
import { trackAbbrs } from "@/src/components/UI Text/trackAbbrs";

type AddressProps = {
  isOpen: boolean;
  onClose: (direction: Direction) => void;
};

const Address: React.FC<AddressProps> = ({ isOpen, onClose }) => {
  const [directionOutput, setDirectionOutput] = useState("(C. Balmes, 8 ...)");
  const [direction, setDirection] = useState({
    streetType: "",
    street: "",
    number: "",
    city: "",
    postalCode: "",
    province: "Barcelona",
    country: "Espanya",
  } as Direction);

  const onChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setDirection((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  return (
    <>
      {isOpen && (
        <Popover isOpen={isOpen} onClose={() => onClose(direction)}>
          <PopoverContent shadow="2px 2px 8px gray">
            <PopoverArrow />
            <PopoverCloseButton />
            <PopoverBody>
              <Flex direction="column" mt={2}>
                <Flex p={2} align="center">
                  <Text ml="auto" mr={2}>
                    Tipus de via:
                  </Text>
                  <Select
                    name="streetType"
                    width="75%"
                    onChange={onChange}
                    textTransform="capitalize"
                    value={direction.streetType}
                  >
                    {trackAbbrs.map((item, index) => {
                      return (
                        <option key={index} value={item[1]}>
                          {item[0]}
                          {item[0] && ":"} {item[1]}
                        </option>
                      );
                    })}
                  </Select>
                </Flex>
                <Flex p={2} align="center">
                  <Text ml="auto" mr={2}>
                    Nom carrer:
                  </Text>
                  <Input
                    name="street"
                    type="text"
                    width="75%"
                    onChange={onChange}
                    value={direction.street}
                  />
                </Flex>
                <Flex p={2} align="center">
                  <Text ml="auto" mr={2}>
                    Número:
                  </Text>
                  <Input
                    name="number"
                    type="text"
                    width="75%"
                    onChange={onChange}
                    value={direction.number}
                  />
                </Flex>
                <Flex p={2} align="center">
                  <Text ml="auto" mr={2}>
                    Codi Postal:
                  </Text>
                  <Input
                    name="postalCode"
                    type="text"
                    width="75%"
                    onChange={onChange}
                    value={direction.postalCode}
                  />
                </Flex>
                <Flex p={2} align="center">
                  <Text ml="auto" mr={2}>
                    Població:
                  </Text>
                  <Input
                    name="city"
                    type="text"
                    width="75%"
                    onChange={onChange}
                    value={direction.city}
                  />
                </Flex>
                <Flex p={2} align="center">
                  <Text ml="auto" mr={2}>
                    Provincia:
                  </Text>
                  <Input
                    name="province"
                    type="text"
                    width="75%"
                    onChange={onChange}
                    value={direction.province}
                  />
                </Flex>
                <Flex p={2} align="center">
                  <Text ml="auto" mr={2}>
                    País:
                  </Text>
                  <Input
                    name="country"
                    type="text"
                    width="75%"
                    onChange={onChange}
                    value={direction.country}
                  />
                </Flex>
              </Flex>
            </PopoverBody>
          </PopoverContent>
        </Popover>
      )}
    </>
  );
};
export default Address;
