import React, {useEffect,useState} from 'react'

function App() {
  const [data, setData] = useState(null)

  useEffect(() =>{
    fetch("/api")
    .then(response => response.json())
    .then(data=>{setData(data.mensaje)})
   })



  return (
    <div>
        {(typeof data === 'undefined') ? (
          <p>Loading...</p>
        ):(
          <p>hola :{data}</p>
        )}
    </div>
  )
}

export default App