import { employeeModalState } from "@/src/atoms/objectAtoms/employeeModalAtom";
// import EmployeeElement from "@/src/components/Database/EmployeeElement";
import EmployeeModal from "@/src/components/Modal/EmployeeModal/EmployeeModal";
import { Employee } from "@/src/components/Types/AppUser";
import { firestore } from "@/src/firebase/clientApp";
import { Flex, Button, Spinner } from "@chakra-ui/react";
import { collection, getDocs, query } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import EmployeeElement from "../components/Modal/EmployeeModal/EmployeeElement";

type EmployeeDBProps = {};

const EmployeeDB: React.FC<EmployeeDBProps> = () => {
  const [loading, setLoading] = useState(false);

  const [employeeState, setEmployeeState] = useRecoilState(employeeModalState);

  const [employees, setEmployees] = useState<Employee[]>([]);

  useEffect(() => {
    // When closing modal, updates local setEmployees
    if (!employeeState.open && employeeState.context !== undefined) {
      const modifyIndex = employees?.findIndex((item) => {
        return item.employeeId === employeeState?.context?.employeeId;
      });
      switch (employeeState.action) {
        case "create":
          setEmployees(
            (prev) => [...prev, employeeState.context] as Employee[]
          );
          return;
        case "modify":
          if (modifyIndex! > -1) {
            setEmployees(
              (prev) =>
                [
                  ...prev.slice(0, modifyIndex),
                  employeeState.context,
                  ...prev.slice(modifyIndex + 1),
                ] as Employee[]
            );
          }
          return;
        case "delete":
          if (modifyIndex! > -1) {
            setEmployees(
              (prev) =>
                [
                  ...prev.slice(0, modifyIndex),
                  ...prev.slice(modifyIndex + 1),
                ] as Employee[]
            );
          }
          return;
      }
      setEmployeeState((prev) => ({
        ...prev,
        context: undefined,
        action: undefined,
      }));
    }
  }, [employeeState.open]);

  const getEmployees = async () => {
    setLoading(true);
    try {
      const queryRef = query(collection(firestore, "employees"));
      const employeeDocs = await getDocs(queryRef);
      const employees = employeeDocs.docs.map((doc) => ({
        employeeId: doc.id,
        ...doc.data(),
      }));
      setEmployees(employees as Employee[]);
    } catch (error) {}
    setLoading(false);
  };

  useEffect(() => {
    getEmployees();
  }, []);

  useEffect(() => {}, [employees]);

  const onClick = (item: Employee) => {
    setEmployeeState((prev) => ({
      ...prev,
      open: true,
      context: item,
      action: "modify",
    }));
  };
  return (
    <>
      {employeeState.open && <EmployeeModal />}
      <Flex direction="column" align="center" width="100%" height="100%">
        <Button
          onClick={() =>
            setEmployeeState((prev) => ({
              ...prev,
              open: true,
              context: undefined,
              action: "create",
            }))
          }
        >
          Crea nou empleat
        </Button>
        <Flex p={2} width="100%" height="100%">
          <Flex
            flexWrap="wrap"
            width="100%"
            height="100%"
            border="1px solid black"
          >
            {loading ? (
              <Spinner />
            ) : (
              <>
                {employees.map((item) => {
                  return (
                    <EmployeeElement
                      key={item.employeeId}
                      employee={item}
                      onClick={() => onClick(item)}
                    />
                  );
                })}
              </>
            )}
          </Flex>
        </Flex>
      </Flex>
    </>
  );
};
export default EmployeeDB;
