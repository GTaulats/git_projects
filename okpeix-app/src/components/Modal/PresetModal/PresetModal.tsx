import { clientModalState } from "@/src/atoms/objectAtoms/clientModalAtom";
import { taskModalState } from "@/src/atoms/objectAtoms/taskModalAtom";
import { Task, TasksPreset } from "@/src/components/Types/Task";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Flex,
  Input,
  Divider,
  ModalFooter,
  Button,
  Text,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useRecoilValue, useRecoilState } from "recoil";
import OrderTaskElement from "../OrderModal/TaskElement";
import TaskModal from "../TaskModal/TaskModal";
import { presetModalState } from "@/src/atoms/objectAtoms/presetModalAtom";
import TaskElement from "../OrderModal/TaskElement";
import { Product } from "../../Types/Product";
import { getDataArray } from "@/src/hooks/useGetData";

const PresetModal: React.FC = () => {
  // const [user] = useAuthState(auth);

  // To create a preset, it's returned an order with the action "preset"
  // Client will be set by user. In case of "preset" state, an "order" is returned
  const clientState = useRecoilValue(clientModalState);

  const [presetState, setPresetState] = useRecoilState(presetModalState);
  const [taskState, setTaskState] = useRecoilState(taskModalState);

  const [newPreset, setNewPreset] = useState<TasksPreset>({
    name: "",
    tasks: [] as Task[],
  } as TasksPreset);

  useEffect(() => {
    presetState.open &&
      setNewPreset(
        presetState.context
          ? presetState.context
          : ({
              name: "",
              tasks: [] as Task[],
            } as TasksPreset)
      );
  }, [presetState.open]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!taskState.open && taskState?.context) {
      const modifyIndex = newPreset?.tasks.findIndex((item) => {
        return item.taskId === taskState.context?.taskId;
      });

      switch (taskState.action) {
        case "create":
          setNewPreset(
            (prev) =>
              ({
                ...prev,
                tasks: [...prev.tasks, taskState.context] as Task[],
              } as TasksPreset)
          );
          break;

        case "modify":
          if (modifyIndex! > -1) {
            setNewPreset((prev) => ({
              ...prev,
              tasks: [
                ...prev.tasks.slice(0, modifyIndex),
                taskState.context,
                ...prev.tasks.slice(modifyIndex + 1),
              ] as Task[],
            }));
          }
          break;
      }

      setTaskState((prev) => ({
        ...prev,
        context: undefined,
        action: undefined,
      }));
    }
  }, [taskState.open]);

  // Dynamically sets the values to the respective activeTask or order's key as they're being inserted
  const onPresetSubmit = () => {
    setError("");
    // Check if name has been given
    if (!newPreset.name) {
      setError("Cal introduir un nom de plantilla");
      return;
    }

    setLoading(true);
    setPresetState((prev) => ({
      ...prev,
      open: false,
      action: presetState.action,
      context: newPreset,
    }));

    setLoading(false);
    setNewPreset({} as TasksPreset);
  };

  const onPresetChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setNewPreset(
      (prev) =>
        ({
          ...prev,
          [event.target.name]: event.target.value,
        } as TasksPreset)
    );
  };

  const handleClose = () => {
    setPresetState((prev) => ({
      ...prev,
      open: false,
    }));
  };

  const onTaskClick = (task: Task) => {
    setTaskState((prev) => ({
      ...prev,
      open: true,
      action: "modify",
      context: task,
    }));
  };

  const [productsList, setProductsList] = useState<Product[]>(
    getDataArray("products") as unknown as Product[]
  );

  useEffect(() => {
    const fetchData = async () => {
      // Gets data to display products → should change eventually, maybe storing product's name in the task alongside productId
      setProductsList((await getDataArray("products").then()) as Product[]);
    };
    fetchData();
  }, []);

  return (
    <>
      <TaskModal />
      <Modal isOpen={presetState.open} onClose={handleClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            display="flex"
            flexDirection="column"
            textAlign="center"
            fontSize={15}
            padding={3}
            mt={2}
          >
            {presetState.action === "create" && "Crea una nova plantilla"}
            {presetState.action === "modify" && "Modifica plantilla"}
          </ModalHeader>
          <ModalCloseButton />

          <ModalBody padding="10px 0">
            <Flex align="center" mb={3}>
              <Text ml="auto" mr={3}>
                Nom plantilla:
              </Text>
              <Input
                type="text"
                width="75%"
                name="name"
                value={newPreset?.name}
                onChange={(event) => onPresetChange(event)}
              />
              {/* TODO: Fuzzy search algorithm with clients pool */}
            </Flex>
            {/* List of tasks */}
            <Flex
              m="0 20px"
              height="100%"
              border="1px solid black"
              borderRadius="5px"
              direction="column"
              overflow="auto"
            >
              <Flex
                p={2}
                pl={4}
                flex={1}
                cursor="pointer"
                _hover={{ bg: "gray.100" }}
                onClick={() => {
                  setTaskState((prev) => ({
                    ...prev,
                    open: true,
                    action: "create",
                    context: undefined,
                  }));
                }}
              >
                + Nova tasca
              </Flex>
              {newPreset?.tasks &&
                newPreset.tasks.map((item, index) => (
                  <TaskElement
                    key={item.taskId}
                    task={item}
                    handleTaskDel={() => {
                      setNewPreset(
                        (prev) =>
                          ({
                            ...prev,
                            tasks: [
                              ...newPreset?.tasks.slice(0, index),
                              ...newPreset?.tasks.slice(index + 1),
                            ],
                          } as TasksPreset)
                      );
                    }}
                    onClick={() => onTaskClick(item)}
                    allProducts={productsList}
                  />
                ))}
            </Flex>
            <Text color="red.300">{error}</Text>

            <Divider m="16px 0" />
          </ModalBody>

          <ModalFooter p="0 20px 20px 10px" borderRadius="0px 0px 10px 10px">
            <Button
              variant="outline"
              height="30px"
              mr={3}
              onClick={handleClose}
            >
              Cancel·la
            </Button>
            <Button
              height="30px"
              type="submit"
              onClick={onPresetSubmit}
              isLoading={loading}
            >
              {presetState.action === "create" && "Crea plantilla"}
              {presetState.action === "modify" && "Modifica plantilla"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
export default PresetModal;
