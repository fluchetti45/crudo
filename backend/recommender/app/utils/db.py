import pandas as pd
from sqlalchemy import create_engine
import os
from dotenv import load_dotenv

load_dotenv()


def connect_to_database():
    server = os.getenv('DB_SERVER')
    database = os.getenv('DB_DATABASE')

    if not server or not database:
        raise ValueError("DB_SERVER or DB_DATABASE not found in environment variables")
        
    conn_str = f'mssql+pyodbc://{server}/{database}?driver=ODBC+Driver+17+for+SQL+Server&Trusted_Connection=yes'
    engine = create_engine(conn_str)
    return engine

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
    
    finally:
        engine.dispose()
        print("Conexión cerrada")

def get_products():
    engine = connect_to_database()
    query = "SELECT * FROM Product"
    products_df = pd.read_sql(query, engine)
    engine.dispose()
    return products_df

def get_categories():
    engine = connect_to_database()
    query = "SELECT id, name FROM Category"
    categories_df = pd.read_sql(query, engine)
    engine.dispose()
    return categories_df