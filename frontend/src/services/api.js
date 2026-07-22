const API_URL = 'http://localhost:8000'

export async function getUsers() {

  const response = await fetch(`${API_URL}/api/users`)

  if (!response.ok) {
    throw new Error('Erreur lors de la récupération des utilisateurs')
  }

  return response.json()
}