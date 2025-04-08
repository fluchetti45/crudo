import pandas as pd
import numpy as np
import time
import sys
from app.utils.db import get_products, get_categories, test_connection
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.manifold import TSNE
import matplotlib.pyplot as plt



# 🔹 Obtener la matriz de similitud entre los embeddings de las descripciones de los productos.
def get_similarities(embeddings):
    """
    Computa la matriz de similitud entre los embeddings de las descripciones de los productos.
    """
    similarity_matrix = cosine_similarity(embeddings, embeddings)
    return similarity_matrix


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
# 🔹 Unir los datos de los productos y categorías
df_products = pd.merge(products_df, categories_df, left_on="category_id", right_on="id")[["id_x","description","price","name_x","id_y","name_y"]]
df_products.rename(columns={"id_x":"productId", "name_x":"productName", "id_y":"categoryId", "name_y":"category"}, inplace=True)
df_products["input_text"] = "Categoria: " + df_products["category"] + ". " + df_products["productName"] + ". " + df_products["description"]


# 🔹 Cargar el modelo de embeddings
model = SentenceTransformer('sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2')

# 🔹 Obtener los embeddings de las descripciones de los productos
embeddings = model.encode(df_products["input_text"], convert_to_tensor=True, show_progress_bar=True)

# 🔹 Obtener la matriz de similitud entre los embeddings de las descripciones de los productos.
similarities = get_similarities(embeddings)

# 🔹 Obtener las recomendaciones para un producto basadas en similitud de coseno usando la matriz de similitudes precalculada.
def get_recommendations(product_id, n_recommendations=5, similarity_matrix=similarities):
    """
    Obtiene recomendaciones para un producto basadas en similitud de coseno usando la matriz de similitudes precalculada.
    """
    # Obtener el índice del producto
    try:
      product_idx = df_products[df_products['productId'] == product_id].index[0]
  
      print(f"Recomendaciones para el producto: {df_products.iloc[product_idx]['productName']}")
      # Obtener las similitudes del producto en la matriz precalculada
      similarities = similarity_matrix[product_idx]
      # Obtener los índices de los productos más similares (excluyendo el producto actual)
      similar_indices = np.argsort(similarities)[::-1][1:n_recommendations+1]
      print(f"🔹 Índices de los productos más similares: {similar_indices}")
      # Obtener los productos recomendados
      scores = similarities[similar_indices].tolist()
      recommendations = df_products.iloc[similar_indices]['productId'].tolist()
      print(f"🔹 Recomendaciones: {recommendations}")
      print(f"🔹 Puntuaciones: {scores}")
      return recommendations, scores
    except IndexError as e:
      print("No existe el producto con Id = ", product_id)
      raise ValueError(f"No existe el producto con Id = {product_id}")



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