const API_URL = "/api";


export async function getUsers() {
    const response = await fetch(`${API_URL}/users`);

    if (!response.ok) {
        throw new Error("Erreur lors du chargement des utilisateurs");
    }

    return response.json();
}


export async function createUser(user) {

    const response = await fetch(`${API_URL}/users`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
    });


    if (!response.ok) {
        throw new Error("Erreur lors de la création de l'utilisateur");
    }


    return response.json();
}