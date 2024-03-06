import { employeeModalState } from "@/src/atoms/objectAtoms/employeeModalAtom";
import { taskModalState } from "@/src/atoms/objectAtoms/taskModalAtom";
import { Task } from "@/src/components/Types/Task";
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
import TaskElement from "../OrderModal/TaskElement";
import { Employee, TelNumber, WorkHours } from "../../Types/AppUser";
import { uniqueId } from "@/src/algorithms/uniqueId";
import PhoneNumber from "../ClientModal/Elements/PhoneNumber";
import { firestore } from "@/src/firebase/clientApp";
import { doc, runTransaction } from "firebase/firestore";

const EmployeeModal: React.FC = () => {
  // const [user] = useAuthState(auth);

  // To create a employee, it's returned an order with the action "employee"
  // Employee will be set by user. In case of "employee" state, an "order" is returned
  // const employeeState = useRecoilValue(employeeModalState);

  const [employeeState, setEmployeeState] = useRecoilState(employeeModalState);
  const [taskState, setTaskState] = useRecoilState(taskModalState);

  const [newEmployee, setNewEmployee] = useState<Employee>({
    employeeId: uniqueId(),
  } as Employee);

  useEffect(() => {
    console.log("employeeState.context", employeeState.context);
    employeeState.open &&
      setNewEmployee(
        employeeState.context
          ? employeeState.context
          : ({
              employeeId: uniqueId(),
            } as Employee)
      );
  }, [employeeState.open]);

  console.log("newEmployee", newEmployee);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // useEffect(() => {
  //   if (!taskState.open && taskState?.context) {
  //     const modifyIndex = newEmployee?.tasks.findIndex((item) => {
  //       return item.id === taskState.context?.id;
  //     });

  //     switch (taskState.action) {
  //       case "create":
  //         setNewEmployee(
  //           (prev) =>
  //             ({
  //               ...prev,
  //               tasks: [...prev.tasks, taskState.context] as Task[],
  //             } as Employee)
  //         );
  //         break;

  //       case "modify":
  //         if (modifyIndex! > -1) {
  //           setNewEmployee((prev) => ({
  //             ...prev,
  //             tasks: [
  //               ...prev.tasks.slice(0, modifyIndex),
  //               taskState.context,
  //               ...prev.tasks.slice(modifyIndex + 1),
  //             ] as Task[],
  //           }));
  //         }
  //         break;
  //     }

  //     setTaskState((prev) => ({
  //       ...prev,
  //       context: undefined,
  //       action: undefined,
  //     }));
  //   }
  // }, [taskState.open]);

  const onTelChange = (telNumber: TelNumber) => {
    console.log("telChange", telNumber);
    setNewEmployee(
      (prev) =>
        ({
          ...prev,
          tel: telNumber,
        } as Employee)
    );
  };
  // Dynamically sets the values to the respective activeTask or order's key as they're being inserted
  const onEmployeeSubmit = async () => {
    setError("");
    // Check if name has been given
    if (!newEmployee.name) {
      setError("Cal introduir un nom de plantilla");
      return;
    }

    setLoading(true);
    try {
      const employeeDocRef = doc(
        firestore,
        "employees",
        newEmployee.employeeId
      );
      await runTransaction(firestore, async (transaction) => {
        // const clientDoc = await transaction.get(clientDocRef);

        // Check if client already exists
        // TODO: PODRIA SORTIR ALGUN ERROR D'AQUESTA COMPROVACIÓ SI HI HA DIVERSOS USUARIS MODIFICANT...
        // if (clientDoc.exists()) {
        //   throw new Error(`Client ja existent.`);
        // }

        // Create client
        transaction.set(employeeDocRef, newEmployee);

        setEmployeeState((prev) => ({
          ...prev,
          open: false,
          context: newEmployee,
          action: employeeState.action,
        }));
      });
      if (employeeState.action === "modify") {
        console.log(`"${newEmployee.name}" client successfuly modified`);
      } else {
        console.log(`"${newEmployee.name}" client successfuly created`);
      }
    } catch (error: any) {
      console.log("handleCreate error", error);
      setError(error.message);
    }

    setEmployeeState((prev) => ({
      ...prev,
      open: false,
      action: employeeState.action,
      context: newEmployee,
    }));

    setLoading(false);
    setNewEmployee({} as Employee);
  };

  const onEmployeeChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setNewEmployee(
      (prev) =>
        ({
          ...prev,
          [event.target.name]: event.target.value,
        } as Employee)
    );
  };

  const onWorkHoursChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setNewEmployee(
      (prev) =>
        ({
          ...prev,
          workHours: {
            ...prev!.workHours,
            [event.target.name]: event.target.value,
          } as WorkHours,
        } as Employee)
    );
  };

  const handleClose = () => {
    setEmployeeState((prev) => ({
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

  return (
    <>
      <TaskModal />
      <Modal isOpen={employeeState.open} onClose={handleClose} size="xl">
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
            {employeeState.action === "create" && "Crea un nou empleat"}
            {employeeState.action === "modify" && "Modifica empleat"}
          </ModalHeader>
          <ModalCloseButton />

          <ModalBody padding="5px 20px 15px 20px">
            <Flex align="center" mb={3}>
              <Text ml="auto" mr={3} textAlign="right">
                Nom:
              </Text>
              <Input
                type="text"
                width="75%"
                name="name"
                value={newEmployee?.name}
                onChange={(event) => onEmployeeChange(event)}
              />
            </Flex>
            <Flex align="center" mb={3}>
              <Text ml="auto" mr={3} textAlign="right">
                Num. Telèfon:
              </Text>
              <PhoneNumber
                preset={
                  employeeState.context?.tel || {
                    code: "34",
                    number: "",
                  }
                }
                onChange={onTelChange}
              />
            </Flex>
            <Flex align="center" mb={3}>
              <Text ml="auto" mr={3} textAlign="right">
                Email:
              </Text>
              <Input
                type="email"
                width="75%"
                name="email"
                value={newEmployee?.email}
                onChange={(event) => onEmployeeChange(event)}
              />
            </Flex>
            {/* TODO: admin privileges to modify things */}
            <Flex align="center" mb={3}>
              <Text ml="auto" mr={3} textAlign="right">
                Càrrec:
              </Text>
              <Input
                type="text"
                width="75%"
                name="role"
                value={newEmployee?.role}
                onChange={(event) => onEmployeeChange(event)}
              />
            </Flex>
            <Flex align="center" mb={3}>
              <Text ml="auto" mr={3} textAlign="right">
                Nº Seguretat Social:
              </Text>
              <Input
                type="text"
                width="75%"
                name="socialSecurityNumber"
                value={newEmployee?.socialSecurityNumber}
                onChange={(event) => onEmployeeChange(event)}
              />
            </Flex>
            <Flex align="center">
              <Text ml="auto" mr={3} textAlign="right">
                Horaris:
              </Text>
              <Flex width="75%" align="center">
                <Input
                  name="start"
                  type="time"
                  width="75%"
                  onChange={onWorkHoursChange}
                  value={newEmployee?.workHours?.start}
                />
                <Text m="0 10px">a</Text>
                <Input
                  name="end"
                  type="time"
                  width="75%"
                  onChange={onWorkHoursChange}
                  value={newEmployee?.workHours?.end}
                />
              </Flex>
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
              onClick={onEmployeeSubmit}
              isLoading={loading}
            >
              {employeeState.action === "create" && "Crea empleat"}
              {employeeState.action === "modify" && "Modifica empleat"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
export default EmployeeModal;
