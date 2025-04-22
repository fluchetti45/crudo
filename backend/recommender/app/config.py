import os

def load_environment():
    env = os.getenv('ENVIRONMENT', 'dev')

    if env == 'dev':
        try:
            from dotenv import load_dotenv

            current_dir = os.path.dirname(os.path.abspath(__file__))
            dotenv_path = os.path.abspath(os.path.join(current_dir, '..', '..', '..', '.env'))

            print(f"[INFO] ENVIRONMENT = {env}")
            print(f"[INFO] Buscando .env en: {dotenv_path}")

            if os.path.exists(dotenv_path):
                load_dotenv(dotenv_path)
                print("[INFO] .env cargado exitosamente")
            else:
                print("[WARNING] No se encontró el archivo .env")
        except ImportError:
            print("[WARNING] dotenv no está instalado")
    else:
        print(f"[INFO] Ambiente = {env} (se asume que las variables ya están seteadas)")

# Ejecutamos cuando se importa
load_environment()

# Accedé a las variables desde acá
ENVIRONMENT = os.getenv('ENVIRONMENT', 'dev')
DB_CONNECTION_STRING_RECOMMENDER = os.getenv('DB_CONNECTION_STRING_RECOMMENDER')
DB_SERVER = os.getenv('DB_SERVER')
DB_DATABASE = os.getenv('DB_DATABASE')
DB_DRIVER = os.getenv('DB_DRIVER')
