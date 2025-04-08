import pandas as pd
import numpy as np
import time
import sys
from app.utils.db import get_products, get_categories, test_connection
from sentence_transformers import SentenceTransformer
import faiss
from sklearn.manifold import TSNE
import matplotlib.pyplot as plt



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

# 🔹 Esperar y verificar la conexión a la base de datos
wait_for_db()


# 🔹 Obtener los datos de los productos y categorías
products_df = get_products()
categories_df = get_categories()

# 🔹 Unir los datos de los productos y categorías
df_products = pd.merge(products_df, categories_df, left_on="category_id", right_on="id")[["id_x","description","price","name_x","id_y","name_y"]]
df_products.rename(columns={"id_x":"productId", "name_x":"productName", "id_y":"categoryId", "name_y":"category"}, inplace=True)
df_products["input_text"] = "Categoria: " + df_products["category"] + ". " + df_products["productName"] + ". " + df_products["description"]


# 🔹 Cargar el modelo de embeddings
model = SentenceTransformer('sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2')

# 🔹 Obtener los embeddings de las descripciones de los productos
embeddings = model.encode(df_products["input_text"], convert_to_tensor=True, show_progress_bar=True)
embeddings_np = embeddings.cpu().numpy()

# 🔹 Crear y entrenar el índice FAISS
dimension = embeddings_np.shape[1]  # dimensión de los embeddings
index = faiss.IndexFlatL2(dimension)  # índice L2 (distancia euclidiana)
index.add(embeddings_np)  # agregar los embeddings al índice

def get_recommendations(product_id, n_recommendations=3):
    """
    Obtiene recomendaciones para un producto usando FAISS.
    """
    try:
        # Obtener el índice del producto
        product_idx = df_products[df_products['productId'] == product_id].index[0]
        
        print(f"Recomendaciones para el producto: {df_products.iloc[product_idx]['productName']}")
        
        # Buscar los vecinos más cercanos
        query_vector = embeddings_np[product_idx].reshape(1, -1)
        distances, indices = index.search(query_vector, n_recommendations + 1)  # +1 porque el primer resultado es el mismo producto
        
        # Convertir distancias a similitudes (1 / (1 + distancia))
        similarities = 1 / (1 + distances[0][1:])  # excluimos el primer resultado
        
        # Obtener los productos recomendados
        recommendations = df_products.iloc[indices[0][1:]]['productId'].tolist()
        
        print(f"🔹 Recomendaciones: {recommendations}")
        print(f"🔹 Puntuaciones: {similarities.tolist()}")
        return recommendations, similarities.tolist()
    except IndexError as e:
        print("No existe el producto con Id = ", product_id)
        raise ValueError(f"No existe el producto con Id = {product_id}")

def get_recommendations_by_query(query: str, n_recommendations=5):
    """
    Obtener recomendaciones de productos basadas en una consulta de texto usando FAISS.
    """
    print(f"Buscando productos similares a: {query}")
    
    # Obtener el embedding de la consulta
    query_embedding = model.encode(query, convert_to_tensor=True).cpu().numpy()
    
    # Buscar los vecinos más cercanos
    distances, indices = index.search(query_embedding.reshape(1, -1), n_recommendations)
    
    # Convertir distancias a similitudes
    similarities = 1 / (1 + distances[0])
    
    # Obtener los productos recomendados
    recommendations = df_products.iloc[indices[0]]['productId'].tolist()
    
    print(f"🔹 Recomendaciones: {recommendations}")
    print(f"🔹 Puntuaciones: {similarities.tolist()}")
    return recommendations, similarities.tolist()

def plot_embeddings(embeddings):
    # Reducimos a 2D
    tsne = TSNE(n_components=2, perplexity=5, random_state=42)
    embeddings_2d = tsne.fit_transform(embeddings.cpu().numpy())
    # Graficamos
    plt.figure(figsize=(8, 6))
    plt.scatter(embeddings_2d[:, 0], embeddings_2d[:, 1], c='skyblue', s=100)

    # Agregamos los nombres de los productos
    for i, desc in enumerate(df_products['productName']):
        plt.annotate(desc, (embeddings_2d[i, 0], embeddings_2d[i, 1]), fontsize=9)

    plt.title('Visualización 2D de embeddings de productos')
    plt.xlabel('Componente 1')
    plt.ylabel('Componente 2')
    plt.grid(True)
    
    # Guardamos la imagen en la carpeta actual
    plt.savefig('embeddings_visualization.png', bbox_inches='tight')
    plt.close()

# Generamos y guardamos el plot al iniciar
plot_embeddings(embeddings)