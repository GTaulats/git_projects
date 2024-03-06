import { atom } from "recoil";
import { Task } from "../components/Types/Task";

interface Tasks {
  tasks: Task[];
}

const defaultTasks: Tasks = {
  tasks: []
}

export const Tasks = atom<Tasks>({
  key: "tasks",
  default: defaultTasks
})