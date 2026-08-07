import api from "./api";


/**
 * Récupère la liste des utilisateurs
 * GET /api/users
 */
export async function getUsers() {

    const response = await api.get("/users");

    return response.data;

}