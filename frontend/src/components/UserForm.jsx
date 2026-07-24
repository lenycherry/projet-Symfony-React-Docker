import { useState } from 'react'
import { createUser } from '../services/api'

function UserForm({ onUserCreated }) {
  const [email, setEmail] = useState('')
  const [error, setError] = useState(null)

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("Formulaire envoyé", email);

    try {
      await createUser({ email })

      setEmail('')
      setError(null)

      onUserCreated()
    } catch (error) {
      setError(error.message)
    }
  }

  return (
    <div>
      <h2>Créer un utilisateur</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />

        <button type="submit">
          Ajouter
        </button>
      </form>

      {error && <p>Erreur : {error}</p>}
    </div>
  )
}

export default UserForm