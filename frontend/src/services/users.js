import api from "./api";

/**
 * Récupère la liste des utilisateurs
 * GET /api/users
 */
export async function getUsers() {

    const response = await api.get("/users");

    return response.data;

}


/**
 * Supprime un utilisateur
 * DELETE /api/users/{id}
 */
export async function deleteUser(id) {

    return api.delete(
        `/users/${id}`
    );

}


/**
 * Modifie un utilisateur
 * PUT /api/users/{id}
 */
export async function updateUser(
    id,
    data
) {

    return api.put(
        `/users/${id}`,
        data
    );

}