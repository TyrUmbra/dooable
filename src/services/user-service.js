import apiFetch from "./api-fetch.js";

export async function createUser(
    newUser = { email, password}
) {
    const { token, ...user } = await apiFetch("signup", { body: newUser});

    return user;
}