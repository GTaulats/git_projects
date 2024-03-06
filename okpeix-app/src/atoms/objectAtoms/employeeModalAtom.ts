import { atom } from "recoil";
import { Employee } from "../../components/Types/AppUser";

export interface EmployeeModalState {
  open: boolean;
  action: "create" | "modify" | "delete" | undefined
  context: Employee | undefined;
}

const defaultModalState: EmployeeModalState = {
  open: false,
  action: undefined,
  context: undefined
}

export const employeeModalState = atom<EmployeeModalState>({
  key: "employeeModalState",
  default: defaultModalState
})