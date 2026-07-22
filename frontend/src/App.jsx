import { useEffect, useState } from 'react'

function App() {
  const [users, setUsers] = useState([])

  useEffect(() => {
    fetch('http://localhost:8000/api/users')
      .then(response => response.json())
      .then(data => {
        setUsers(data.users)
      })
      .catch(error => {
        console.error('Erreur API :', error)
      })
  }, [])

  return (
    <div>
      <h1>Liste des utilisateurs</h1>

      {users.map(user => (
        <div key={user.id}>
          <p>Email : {user.email}</p>
          <p>Date de création : {user.createdAt}</p>
        </div>
      ))}
    </div>
  )
}

export default App
