import pandas as pd
from sqlalchemy import create_engine
import os
from dotenv import load_dotenv
import urllib.parse

load_dotenv()


def connect_to_database():
    conn_str = os.getenv('DB_CONNECTION_STRING_RECOMMENDER')
    
    if not conn_str:
        raise ValueError("Database connection string not found in environment variables")
    
    # Reemplazar las variables en el string de conexión
    conn_str = conn_str.format(
        DB_SERVER=os.getenv('DB_SERVER'),
        DB_DATABASE=os.getenv('DB_DATABASE'),
        DB_DRIVER=urllib.parse.quote_plus(os.getenv('DB_DRIVER'))
    )    
    engine = create_engine(conn_str)
    return engine

def test_connection():
    engine = None
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
    
    finally:
        if engine:
            engine.dispose()
            print("Conexión cerrada")

def get_products():
    engine = None
    try:
        engine = connect_to_database()
        query = "SELECT * FROM Product WHERE isDeleted = 0"
        products_df = pd.read_sql(query, engine)
        return products_df
    finally:
        if engine:
            engine.dispose()

def get_categories():
    engine = None
    try:
        engine = connect_to_database()
        query = "SELECT id, name FROM Category"
        categories_df = pd.read_sql(query, engine)
        return categories_df
    finally:
        if engine:
            engine.dispose()
