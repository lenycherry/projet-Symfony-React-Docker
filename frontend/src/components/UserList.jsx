function UserList({ users }) {
  return (
    <div>
      <h2>Utilisateurs</h2>

      {users.map(user => (
        <div key={user.id}>
          <p>Email : {user.email}</p>
          <p>Créé le : {user.createdAt}</p>
        </div>
      ))}
    </div>
  )
}

export default UserList