import unittest
import requests
Error_s = str("Datos Incorrectos")
class TestUserRoutes(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.base_url = "http://localhost:5000/api"

    def test_valid_login(self):
        """Prueba con credenciales válidas"""
        payload = {
            "email": "yo@gmail.com",
            "password": "yo"  # Asegúrate de que esta contraseña sea correcta
        }
        response = requests.post(f"{self.base_url}/users/login", json=payload)
        self.assertEqual(response.status_code, 200)
        json_response = response.json()
        print("Prueba con credenciales válidas\n")
        print(json_response)
        print("\n")
        self.assertTrue(json_response.get("success", False), "El inicio de sesión debería ser exitoso.")
        self.assertIn("user", json_response)
        self.assertIn("permisos", json_response)

    def test_invalid_login(self):
        """Prueba con credenciales inválidas"""
        payload = {
            "email": "juan@gmail.com",
            "password": "incorrect_password"
        }
        response = requests.post(f"{self.base_url}/users/login", json=payload)
        self.assertEqual(response.status_code, 401)
        json_response = response.json()
        self.assertIn("success", json_response)
        self.assertFalse(json_response.get("success", True))
        self.assertIn("error", json_response)
        self.assertEqual(json_response["error"], Error_s)  # Verifica el mensaje de error
    def test_login_empty_password(self):
        """Prueba de login con contraseña vacía"""
        payload = {
            "email": "benja@gmail.com",
            "password": ""
        }
        response = requests.post(f"{self.base_url}/users/login", json=payload)
        self.assertEqual(response.status_code, 401)
        json_response = response.json()
        self.assertFalse(json_response.get("success", True))
        self.assertIn("error", json_response)
        self.assertEqual(json_response["error"], Error_s)  # Mensaje esperado
        print("Prueba de login con contraseña vacía"+"\n")
        print(response.json())
        print("\n")

    def test_login_nonexistent_user(self):
        """Prueba de login con usuario no existente"""
        payload = {
            "email": "usuario_no_existe@gmail.com",
            "password": "password123"
        }
        response = requests.post(f"{self.base_url}/users/login", json=payload)
        self.assertEqual(response.status_code, 401)
        json_response = response.json()
        self.assertFalse(json_response.get("success", True))
        self.assertIn("error", json_response)
        self.assertEqual(json_response["error"], Error_s)
        print("Prueba de login con usuario no existente"+"\n")
        print(response.json())
        print("\n")

    def test_login_no_email(self):
        """Prueba de login sin email"""
        payload = {
            "email": "",
            "password": "password123"
        }
        response = requests.post(f"{self.base_url}/users/login", json=payload)
        self.assertEqual(response.status_code, 401)
        json_response = response.json()
        self.assertFalse(json_response.get("success", True))
        self.assertIn("error", json_response)
        self.assertEqual(json_response["error"], Error_s)
        print("Prueba de login sin email\n")
        print(json_response)
        print("\n")

    def test_login_invalid_email_format(self):
        """Prueba de login con email en formato incorrecto"""
        payload = {
            "email": "invalid-email-format",
            "password": "password123"
        }
        response = requests.post(f"{self.base_url}/users/login", json=payload)
        self.assertEqual(response.status_code, 401)
        json_response = response.json()
        self.assertFalse(json_response.get("success", True))
        self.assertIn("error", json_response)
        self.assertEqual(json_response["error"], Error_s)
        print("Prueba de login con email en formato incorrecto\n")
        print(json_response)
        print("\n")

    @classmethod
    def tearDownClass(cls):
        print("Limpieza final para TestUserRoutes.")

if __name__ == "__main__":
    unittest.main()
