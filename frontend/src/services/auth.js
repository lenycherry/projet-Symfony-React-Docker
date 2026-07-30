import api from "./api";


/**
 * Connexion utilisateur
 * Appelle Symfony /api/login_check
 */
export async function login(email, password) {
    const response = await api.post("/login_check", {
        email,
        password,
    });

    const token = response.data.token;

    localStorage.setItem("token", token);

    return token;
}


/**
 * Inscription utilisateur
 * Appelle Symfony /api/register
 */
export async function register(email, password) {
    const response = await api.post("/register", {
        email,
        password,
    });

    return response.data;
}


/**
 * Déconnexion
 */
export function logout() {
    localStorage.removeItem("token");
}


/**
 * Vérifie si un utilisateur est connecté
 */
export function isAuthenticated() {
    return Boolean(localStorage.getItem("token"));
}


/**
 * Récupère le profil utilisateur connecté
 * GET /api/users/me
 */
export async function getProfile() {
    const response = await api.get("/users/me");

    return response.data;
}


/**
 * Modification du profil
 * PUT /api/users/me
 */
export async function updateProfile(data) {
    const response = await api.put("/users/me", data);

    return response.data;
}


/**
 * Modification du mot de passe
 * PUT /api/users/me/password
 */
export async function updatePassword(
    oldPassword,
    newPassword
) {
    const response = await api.put("/users/me/password", {
        oldPassword,
        newPassword,
    });

    return response.data;
}


/**
 * Suppression du compte
 * DELETE /api/users/me
 */
export async function deleteAccount() {
    const response = await api.delete("/users/me");

    logout();

    return response.data;
}