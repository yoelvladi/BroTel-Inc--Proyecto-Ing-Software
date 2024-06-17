import React, { useState } from 'react';
import { useNavigate} from 'react-router-dom';

function Login() {
    const [nombre, setNombre] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch('http://localhost:5000/api/users/login',{
            method: 'POST',
            headers: {'Content-Type':'application/json' },
            body: JSON.stringify({nombre, password}),
        });
        const data = await response.json();
        if(data.success){
            navigate('/Inicio');
        }else{
            setError('Datos Incorrectos')
        }
    };
    return (
        <div>
          <h2>Login</h2>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <form onSubmit={handleSubmit}>
            <div>
              <label>Nombre:</label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
              />
            </div>
            <div>
              <label>Password:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button type="submit">Login</button>
          </form>
        </div>
      );
    
}

export default Login;
