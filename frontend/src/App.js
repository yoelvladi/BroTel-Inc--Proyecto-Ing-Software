import React, {useEffect,useState} from 'react'
import Crear_user from './components/crear_user'

function App() {
  const [data, setData] = useState(null)

  useEffect(() =>{
    fetch("/api")
    .then(response => response.json())
    .then(data=>{setData(data.mensaje)})
   })

  return(
    <div className="user">
      <h1>Crear Usuario</h1>
      <Crear_user/>
      {(typeof data === 'undefined') ? (
          <p>Loading...</p>
        ):(
          <p>hola :{data}</p>
        )}
    </div>
  ) 

}

export default App