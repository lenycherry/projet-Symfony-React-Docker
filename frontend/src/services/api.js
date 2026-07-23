const API_URL = "/api";

export async function getUsers() {
    const response = await fetch(`${API_URL}/users`);

    if (!response.ok) {
        throw new Error("Erreur lors du chargement des utilisateurs");
    }

    return response.json();
}


export async function createUser(email) {
    const response = await fetch(`${API_URL}/users`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email: email,
        }),
    });

    if (!response.ok) {
        throw new Error("Erreur lors de la création de l'utilisateur");
    }

    const text = await response.text();

console.log("Réponse reçue :", text);

return JSON.parse(text);
}