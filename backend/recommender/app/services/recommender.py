import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.preprocessing import MinMaxScaler
from app.utils.db import get_products, get_categories




# 🔹 Obtener los datos de los productos y categorías
products_df = get_products()
categories_df = get_categories()
# 🔹 Unir los datos de los productos y categorías
df_products = pd.merge(products_df, categories_df, left_on="category_id", right_on="id")[["id_x","description","price","name_x","id_y","name_y"]]
df_products.rename(columns={"id_x":"productId", "name_x":"productName", "id_y":"categoryId", "name_y":"category"}, inplace=True)

# 🔹 Limpiar los datos de los productos
df_products["description"] = df_products["description"].str.replace(".", " ").replace(",", " ").replace(":", " ").replace(";", " ").replace("!", " ").replace("?", " ").replace("  ", " ")
df_products["description"] = df_products["description"].str.lower()
df_products["description"] = df_products["description"].str.replace("  ", " ")

# 🔹 Crear la matriz de similitud de texto
vectorizer = TfidfVectorizer(encoding="utf-8",stop_words="english")
tfidf_matrix = vectorizer.fit_transform(df_products["description"])

# 🔹 Calcular la similitud de texto
text_similarity = cosine_similarity(tfidf_matrix, tfidf_matrix)

# 🔹 Normalizar el precio
sclaer = MinMaxScaler() 
df_products_copy = df_products.copy()
df_products_copy["price_norm"] = sclaer.fit_transform(df_products_copy[["price"]])

price_similarity = 1 - np.abs(df_products_copy["price_norm"].values[:].reshape(-1,1) - df_products_copy["price_norm"].values)

# 🔹 Calcular la similitud de productos
product_similarity = (0.6*text_similarity) + (0.2*price_similarity)

# 🔹 Obtener los ids de las categorías
category_ids = df_products['categoryId'].values

# 🔹 Crear una máscara de categorías para identificar los productos en la misma categoría
category_mask = (category_ids[:, None] == category_ids)  # Matriz booleana (n x n)

# 🔹 Aplicamos el boost solo en las posiciones correspondientes a productos de la misma categoría
boosted_similarity_matrix = product_similarity + 0.2 * category_mask

# 🔹 Establecemos que la diagonal (similitud consigo mismo) no tenga boost
np.fill_diagonal(boosted_similarity_matrix, 0)

# 🔹 Función para obtener las recomendaciones
def recommend_products(product_id, n_recommendations=3) -> tuple[list[int], list[float]]:
    # Verificar si el producto existe
    if product_id not in df_products["productId"].values:
        raise ValueError(f"Producto con ID {product_id} no encontrado")
    try:
        # 🔹 Encuentra el índice del producto en el DataFrame
        product_index = df_products[df_products["productId"] == product_id].index[0]
        # Obtiene los indices de los productos con las similitudes ordenadas de forma descendente (mayor a menor)
        similar_products = boosted_similarity_matrix[product_index].argsort()[::-1][:n_recommendations]
        # Obtiene los ids de los productos 
        similar_products_ids = df_products["productId"].iloc[similar_products]
        # Obtengo los scores de similitud
        similar_products_scores = boosted_similarity_matrix[product_index][similar_products]
        
        return similar_products_ids, similar_products_scores
    except Exception as e:
        print(f"Error al obtener las recomendaciones: {e}")
        return None, None
