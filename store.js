import { listTasks } from "./src/services/tasks-service.js";

async function fetchTasks() {
    const tasks = await listTasks()
    this.tasks = tasks
}

const STORE = {
    user: null,
    tasks: [],
    currentList: "normal",
    currentSort: "alphabetical",
    fetchTasks,
};

export default STORE;