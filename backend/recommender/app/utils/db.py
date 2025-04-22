import pandas as pd
from sqlalchemy import create_engine
import os
import urllib.parse
import time
import sys
from app.config import (
    DB_CONNECTION_STRING_RECOMMENDER,
    DB_SERVER,
    DB_DATABASE,
    DB_DRIVER
)

class DatabaseConnection:
    _instance = None
    _engine = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(DatabaseConnection, cls).__new__(cls)
        return cls._instance

    def __init__(self):
        if self._engine is None:
            conn_str = DB_CONNECTION_STRING_RECOMMENDER
            
            if not conn_str:
                raise ValueError("Database connection string not found in environment variables")
            
            # Reemplazar las variables en el string de conexión
            conn_str = conn_str.format(
                DB_SERVER=DB_SERVER,
                DB_DATABASE=DB_DATABASE,
                DB_DRIVER=urllib.parse.quote_plus(DB_DRIVER)
            )
            
            self._engine = create_engine(conn_str)

    @property
    def engine(self):
        return self._engine

def connect_to_database():
    return DatabaseConnection().engine

# Intentar conexion a la base de datos
def wait_for_db(max_retries=5, delay=5):
    print("Esperando conexión a la base de datos...")
    for attempt in range(max_retries):
        try:
            if test_connection():
                print("Conexión a la base de datos exitosa!")
                return True
            print(f"Intento {attempt + 1}/{max_retries} fallido. Reintentando en {delay} segundos...")
            time.sleep(delay)
        except Exception as e:
            print(f"Error en intento {attempt + 1}: {str(e)}")
            if attempt < max_retries - 1:
                print(f"Reintentando en {delay} segundos...")
                time.sleep(delay)
            else:
                print("No se pudo establecer conexión con la base de datos después de varios intentos.")
                sys.exit(1)
    return False

def test_connection():
    try:
        engine = connect_to_database()
        
        # Probar la conexión con una consulta simple
        query = "SELECT @@VERSION"
        df = pd.read_sql(query, engine)
        print("Conexión exitosa!")
        print("\nVersión de SQL Server:")
        print(df)
        
        # Listar las tablas en la base de datos
        query = """
        SELECT TABLE_NAME 
        FROM INFORMATION_SCHEMA.TABLES 
        WHERE TABLE_TYPE = 'BASE TABLE'
        """
        tables_df = pd.read_sql(query, engine)
        print("\nTablas en la base de datos:")
        print(tables_df)
        
        return True
        
    except Exception as e:
        print(f"Error al conectar: {str(e)}")
        return False

def get_products():
    engine = connect_to_database()
    query = "SELECT * FROM Product"
    products_df = pd.read_sql(query, engine)
    return products_df

def get_categories():
    engine = connect_to_database()
    query = "SELECT id, name FROM Category"
    categories_df = pd.read_sql(query, engine)
    return categories_df
