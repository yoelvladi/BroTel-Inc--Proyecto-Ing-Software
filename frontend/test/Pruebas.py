import unittest
import requests
class TestUserRoutes(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.base_url = "http://localhost:5000/api"

    def test_valid_login(self):
        """Prueba con credenciales válidas"""
        payload = {
            "nombre": "medico",
            "password": "medico"  # Asegúrate de que esta contraseña sea correcta
        }
        response = requests.post(f"{self.base_url}/users/login", json=payload)
        self.assertEqual(response.status_code, 200)
        json_response = response.json()
        print(response.json())
        # Verifica que el campo 'success' sea True
        self.assertTrue(json_response.get("success", False), "El inicio de sesión debería ser exitoso.")
    
        # Verifica que se devuelve un token y la información del usuario
        self.assertIn("user", json_response)  # Verifica que se devuelve información del usuario

    def test_invalid_login(self):
        """Prueba con credenciales inválidas"""
        payload = {
            "nombre": "juan",
            "password": "incorrect_password"  # Usa una contraseña incorrecta
        }
        response = requests.post(f"{self.base_url}/users/login", json=payload)
        self.assertEqual(response.status_code, 401)
    
        json_response = response.json()
        # Verifica que el campo 'success' sea False
        self.assertIn("success", json_response)
        self.assertFalse(json_response.get("success", True), "El inicio de sesión debería fallar.")
        print(response.json())
        # Verifica el mensaje de error
        self.assertIn("error", json_response)
        self.assertEqual(json_response["error"], "Datos Incorrectos")  # Verifica el mensaje de error
class TestPacientRoutes(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.base_url = "http://localhost:5000/api/pacients"

    def test_create_patient_success(self):
        """Prueba creación exitosa de paciente"""
        payload = {
            "nombre": "John Doe",  # Asegúrate de que este email no esté en la base de datos
            "password": "password123",
            "email": "vladimirsagredo1@gmail.com",
            "permisos": "false"
        }
        response = requests.post(f"{self.base_url}/register", json=payload)
        print(response.json())
        json_response = response.json()
        self.assertFalse(json_response["success"])  # Verifica que 'success' sea True
        self.assertEqual(json_response["message"], "El usuario ya existe")

    def test_create_patient_duplicate_email(self):
        """Prueba con email duplicado"""
        payload = {
            "nombre": "JaneDoe",  # Usa el mismo email que en el test anterior
            "password": "password123",
            "email": "vladimirsagredo1@gmail.com",
            "permisos": "false"
        }
        response = requests.post(f"{self.base_url}/register", json=payload)
        json_response = response.json()
        print(response.json())
        self.assertTrue(json_response["success"])  # Verifica que 'success' sea False
        self.assertEqual(json_response["message"], "Usuario registrado correctamente")
if __name__ == "__main__":
    unittest.main()

