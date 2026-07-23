import { useState } from 'react'
import { updateUser } from '../services/api'

function UserList({ users, onUserUpdated }) {

  const [editingId, setEditingId] = useState(null)
  const [email, setEmail] = useState('')
  const [error, setError] = useState(null)


  const handleEdit = (user) => {
    setEditingId(user.id)
    setEmail(user.email)
    setError(null)
  }


  const handleUpdate = async (id) => {
    try {
      await updateUser(id, { email })

      setEditingId(null)
      setEmail('')

      onUserUpdated()

    } catch (error) {
      setError(error.message)
    }
  }


  return (
    <div>

      <h2>Utilisateurs</h2>


      {users.map(user => (

        <div key={user.id}>

          {editingId === user.id ? (

            <div>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />

              <button onClick={() => handleUpdate(user.id)}>
                Enregistrer
              </button>

            </div>

          ) : (

            <div>
              <p>Email : {user.email}</p>

              <p>
                Créé le : {user.createdAt}
              </p>

              <button onClick={() => handleEdit(user)}>
                Modifier
              </button>

            </div>

          )}

        </div>

      ))}


      {error && <p>Erreur : {error}</p>}

    </div>
  )
}

export default UserList