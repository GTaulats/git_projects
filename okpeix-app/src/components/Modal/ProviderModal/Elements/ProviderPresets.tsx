import { TasksPreset } from "@/src/components/Types/Task";
import { Flex, Icon, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { Provider } from "@/src/components/Types/AppUser";
import PresetModal from "../../PresetModal/PresetModal";
import { presetModalState } from "@/src/atoms/objectAtoms/presetModalAtom";
import { FaMinus } from "react-icons/fa";
import ConfirmModal from "../../ConfirmModal";

type ProviderPresetsProps = {
  contextProvider: TasksPreset[];
  onChange: (preset: TasksPreset[]) => void;
};

const ProviderPresets: React.FC<ProviderPresetsProps> = ({
  contextProvider,
  onChange,
}) => {
  const [error, setError] = useState("");

  const [openConfirm, setOpenConfirm] = useState(false);
  const [confirmChoice, setConfirmChoice] = useState<undefined | boolean>(
    undefined
  );
  const [toDelete, setToDelete] = useState<number>();

  const [presetModal, setPresetModal] = useRecoilState(presetModalState);

  const [newPresets, setNewPresets] = useState(
    contextProvider ? contextProvider : ([] as TasksPreset[])
  );

  useEffect(() => {
    setError("");

    if (!presetModal.open && presetModal.context) {
      switch (presetModal.action) {
        case "create":
          setNewPresets(
            (prev) => [...prev, presetModal.context] as TasksPreset[]
          );
          break;
        case "modify":
          if (selectedPreset === undefined) {
            setError("Quelcom ha fallat. Torneu-ho a intentar"); // Should never see this
            return;
          }

          setNewPresets(
            (prev) =>
              [
                ...prev.slice(0, selectedPreset),
                presetModal.context,
                ...prev.slice(selectedPreset + 1),
              ] as TasksPreset[]
          );
          break;
      }

      // Cleanup
      setSelectedPreset(undefined);
      setPresetModal((prev) => ({
        ...prev,
        context: undefined,
        action: undefined,
      }));
    }
  }, [presetModal.open]);

  const handleConfirm = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    index: number
  ) => {
    event.stopPropagation();
    setOpenConfirm(true);
    setToDelete(index);
  };

  useEffect(() => {
    if (confirmChoice) handleDel();
  }, [confirmChoice]);

  const handleDel = () => {
    setNewPresets((prev) => [
      ...prev.slice(0, toDelete!),
      ...prev.slice(toDelete! + 1),
    ]);
    setToDelete(undefined);
    setConfirmChoice(false);
    setOpenConfirm(false);
  };

  useEffect(() => {
    // Send all info back to direct parent
    onChange(newPresets);
  }, [newPresets]);

  const onCreatePreset = () => {
    setPresetModal((prev) => ({
      ...prev,
      open: true,
      action: "create",
      context: undefined,
    }));
  };

  const [selectedPreset, setSelectedPreset] = useState<number | undefined>(
    undefined
  );

  const onPresetClick = (item: TasksPreset, index: number) => {
    setSelectedPreset(index); // Stores index to later modify (not perfect...)
    setPresetModal((prev) => ({
      ...prev,
      open: true,
      action: "modify",
      context: item,
    }));
  };

  return (
    <>
      {openConfirm && (
        <ConfirmModal
          isOpen={openConfirm}
          message="Segur que vols eliminar la plantilla? No es podrà recuperar"
          onClose={() => {
            setOpenConfirm(false);
          }}
          setChoice={(choice: boolean) => {
            setConfirmChoice(choice);
          }}
        />
      )}
      {presetModal.open && <PresetModal />}
      <Flex align="flex-start">
        <Text ml="auto" mr={3}>
          Plantilles:
        </Text>
        <Flex
          border="1px solid gray"
          borderRadius={1}
          width="75%"
          direction="column"
        >
          <Flex
            p={2}
            pl={4}
            flex={1}
            cursor="pointer"
            _hover={{ bg: "gray.100" }}
            onClick={onCreatePreset}
          >
            + Crea nova plantilla
          </Flex>
          {newPresets &&
            newPresets.map((item, index) => {
              return (
                <Flex
                  key={index}
                  p={2}
                  flex={1}
                  cursor="pointer"
                  _hover={{ bg: "gray.100" }}
                  onClick={() => onPresetClick(item, index)}
                >
                  <Text>{item.name}</Text>
                  <Flex
                    ml="auto"
                    align="center"
                    color="red"
                    bg="gray.300"
                    border="1px solid"
                    borderColor="gray.400"
                    borderRadius={7}
                    _hover={{ bg: "gray.200" }}
                  >
                    <Flex
                      height="20px"
                      width="20px"
                      onClick={(event) => handleConfirm(event, index)}
                    >
                      <Icon m="auto" fontSize="6pt" as={FaMinus} />
                    </Flex>
                  </Flex>
                </Flex>
              );
            })}
          <Text>{error}</Text>
        </Flex>
      </Flex>
    </>
  );
};
export default ProviderPresets;
