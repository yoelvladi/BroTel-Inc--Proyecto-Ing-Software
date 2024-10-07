import unittest
import requests

class TestLoginEndpoint(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.base_url = "http://localhost:5000/api"  # Cambiar esto según el servidor

    def test_valid_login(self):
        """Prueba con credenciales válidas"""
        payload = {
            "email": "usuario@ejemplo.com",
            "password": "contraseña_correcta"
        }
        response = requests.post(f"{self.base_url}/login", json=payload)
        self.assertEqual(response.status_code, 200)
        self.assertIn("token", response.json())

    def test_invalid_login(self):
        """Prueba con credenciales inválidas"""
        payload = {
            "email": "usuario@ejemplo.com",
            "password": "####" #no se que entraria como invalido
        }
        response = requests.post(f"{self.base_url}/login", json=payload)
        self.assertEqual(response.status_code, 401)
        self.assertEqual(response.json()["error"], "Invalid credentials")

class TestCreatePatientEndpoint(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        # Configuración inicial
        cls.base_url = "http://localhost:5000/api"

    def test_create_patient_success(self):
        """Prueba creación exitosa de paciente"""
        payload = {
            "name": "John Doe",
            "age": 30,
            "email": "john.doe@ejemplo.com"
        }
        response = requests.post(f"{self.base_url}/create_patient", json=payload)
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.json()["message"], "Patient created successfully")

    def test_create_patient_duplicate_email(self):
        """Prueba con email duplicado"""
        payload = {
            "name": "John Doe",
            "age": 30,
            "email": "existing.email@ejemplo.com" # hay que poner un email que ya este en la base de datos
        }
        response = requests.post(f"{self.base_url}/create_patient", json=payload)
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json()["error"], "Email already exists")

    @classmethod
    def tearDownClass(cls):
        # Limpieza si es necesaria
        pass

if __name__ == "__main__":
    unittest.main()
