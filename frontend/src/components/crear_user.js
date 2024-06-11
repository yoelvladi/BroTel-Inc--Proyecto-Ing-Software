import React, { useState } from 'react'

function Crear_user(){
    const [userData, setUserData] = useState({
        nombre:'',
        password:'',
        email: ''
    });
    const handleChange = (e) => {
        setUserData({
            ...userData,
            [e.target.name]: e.target.value
        });
    };
    const handleSubmit = async(e)=> {
        e.preventDefault();
        try{
            const response= await fetch('/api/users',{
                method: 'POST',
                headers:{
                    'Content-type':'application/json'
                },
                body:JSON.stringify(userData)
            });
            const data= await response.json();
            console.log(data);
        }catch(error){
            console.error(error)
        }
    };
    return(
        <form onSubmit = {handleSubmit}>
            <input type="text" name="nombre" value={userData.nombre} onChange={handleChange}/>
            <input type="password" name="password" value={userData.password} onChange={handleChange} />
            <input type="email" name="email" value={userData.email} onChange={handleChange} />
            <button type="submit">Agregar Usuario</button>

        </form>
    );
}

export default Crear_user;