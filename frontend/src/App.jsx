import { useEffect, useState } from 'react'
import { getUsers } from './services/api'
import UserList from './components/UserList'
import UserForm from './components/UserForm'

function App() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const loadUsers = () => {
    setLoading(true)
    setError(null)

    getUsers()
      .then(data => {
        setUsers(data.users)
      })
      .catch(error => {
        setError(error.message)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    loadUsers()
  }, [])

  if (loading) {
    return <p>Chargement des utilisateurs...</p>
  }

  if (error) {
    return <p>Erreur : {error}</p>
  }

  return (
    <div>
      <h1>Mon application Symfony React</h1>

      <UserForm onUserCreated={loadUsers} />

      <UserList users={users} />
    </div>
  )
}

export default App