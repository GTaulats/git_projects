import React, { useEffect, useState } from "react";
import { TelNumber } from "../../../Types/AppUser";
import { Select, Flex, Input } from "@chakra-ui/react";
import FlagFont from "../../../UI Text/CountryData/FlagFont";
import { Countries } from "../../../UI Text/CountryData/countryData";

type PhoneNumberProps = {
  preset: TelNumber;
  onChange: (telNumber: TelNumber) => void;
};

const PhoneNumber: React.FC<PhoneNumberProps> = ({ preset, onChange }) => {
  const [tel, setTel] = useState(preset);

  const onTelChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setTel((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };
  useEffect(() => {
    onChange(tel);
  }, [tel]);
  // const [number, setNumber] = useState(preset.number || "");
  // const [code, setCode] = useState(preset.code || "");

  // const onTelChange = (
  //   event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  // ) => {
  //   setNewClient((prev) => ({
  //     ...prev,
  //     tel: {
  //       ...prev.tel,
  //       [event.target.name]: event.target.value,
  //     },
  //   }));
  // };

  return (
    <Flex width="75%">
      <FlagFont />
      <Select
        name="code"
        width="180px"
        value={tel.code}
        onChange={onTelChange}
        // onChange={(event) => setCode(event.target.value)}
        fontFamily={"NotoColorEmoji"}
      >
        {Countries.map((item) => {
          return (
            <option
              key={item.code}
              value={item.phoneCode.replace(/[-() ]/, "")}
            >
              {item.flag} +{item.phoneCode}
            </option>
          );
        })}
      </Select>
      <Input
        name="number"
        type="text"
        onChange={onTelChange}
        // onChange={(event) => setNumber(event.target.value)}
        value={tel.number}
      />
    </Flex>
  );
};
export default PhoneNumber;
