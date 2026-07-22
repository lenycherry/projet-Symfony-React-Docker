const API_URL = 'http://localhost:8000'

export async function getUsers() {
  const response = await fetch(`${API_URL}/api/users`)

  if (!response.ok) {
    throw new Error('Erreur lors de la récupération des utilisateurs')
  }

  return response.json()
}


export async function createUser(user) {
  const response = await fetch(`${API_URL}/api/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(user),
  })

  if (!response.ok) {
    throw new Error('Erreur lors de la création de l’utilisateur')
  }

  return response.json()
}