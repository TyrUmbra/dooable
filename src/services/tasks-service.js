import apiFetch from "./api-fetch.js";
import { tokenKey } from "../../config.js";

export const listTasks = () => {
	return apiFetch("/tasks", {
		method: "GET",
		headers: {
			Authorization: `Token token=${sessionStorage.getItem(tokenKey)}`,
		},
	});
};

export async function createTasks(
  newContact = { title, due_date:null, important:false, completed:false }
) {
  	return await apiFetch("tasks", { body: newContact });
}

export async function editTasks(newBody = { title, due_date}, id) {
  return await apiFetch (`tasks/${id}`,{ method: "PATCH", body: newBody});
}

export async function importantTasks(newBody = { important }, id) {
	return await apiFetch (`tasks/${id}`,{ method: "PATCH", body: newBody});
}

export async function completeTasks(newBody = { completed }, id) {
	return await apiFetch (`tasks/${id}`,{ method: "PATCH", body: newBody});
}

export async function deleteTasks(id) {
  return await apiFetch(`tasks/${id}`, { method: "DELETE" });
}