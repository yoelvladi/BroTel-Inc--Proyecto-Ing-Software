import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css'; // Asegúrate de importar tu hoja de estilos

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch('http://localhost:5000/api/users/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });
        const data = await response.json();
        if (data.success) {
            
            if(data.permisos){
                navigate('/Inicio');
            } else {
                localStorage.setItem('pacienteId', data.user.id_paciente);
                navigate('/Inicio_pacientes');
            }
            
        } else {
            setError('Datos Incorrectos')
        }
    };

    return (
        <body className ="fondo">
        <div className="login-container">
            <h1 className="title">Visualizador de Imágenes</h1>
            <h2>Login</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit} className="login-form">
                <div className="form-group">
                    <label>Correo:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="form-control"
                    />
                </div>
                <div className="form-group">
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="form-control"
                    />
                </div>
                <button type="submit" className="submit-button">Login</button>
            </form>
        </div>
        </body>
    );
}

export default Login;

