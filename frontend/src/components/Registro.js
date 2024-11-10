import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Register.css';

function Register() {
    const [nombre, setNombre] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [esMedico, setEsMedico] = useState(false); // Estado para determinar el tipo de usuario
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Determina la URL basada en si el usuario es médico o paciente
        const url = esMedico 
            ? 'http://localhost:5000/api/users/register' 
            : 'http://localhost:5000/api/pacients/register';

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre, password, email, permisos: esMedico }), // Enviamos permisos como booleano
        });
        const data = await response.json();
        if (data.success) {
            navigate('/login');
        } else {
            setError('Error en el registro');
        }
    };

    return (
        <body className="fondo">
            <div className="register-container">
                <h1 className="title">Visualizador de Imágenes</h1>
                <h2>Registro</h2>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <form onSubmit={handleSubmit} className="register-form">
                    <div className="form-group">
                        <label htmlFor="nombre">Nombre:</label>
                        <input
                            type="text"
                            id="nombre"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            className="form-control"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email:</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="form-control"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password:</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="form-control"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="esMedico">¿Eres médico?</label>
                        <select
                            id="esMedico"
                            value={esMedico}
                            onChange={(e) => setEsMedico(e.target.value === 'true')}
                            className="form-control"
                        >
                            <option value={false}>No</option>
                            <option value={true}>Sí</option>
                        </select>
                    </div>
                    <button type="submit" className="submit-button">Registrar</button>
                </form>
            </div>
        </body>
    );
}

export default Register;
