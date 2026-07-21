import { useEffect, useState } from 'react'	
import './App.css'

	function App() {
		  const [message, setMessage] = useState('Chargement...')

		  useEffect(() => {
			      fetch('http://localhost:8000/api/hello')
			        .then((response) => response.json())
			        .then((data) => {
					        setMessage(data.message)
					      })
			        .catch((error) => {
					        console.error(error)
					        setMessage('Erreur de connexion à Symfony')
					      })
			    }, [])

		  return (
			      <div>
			        <h1>{message}</h1>
			      </div>
			    )
	}

	export default App
