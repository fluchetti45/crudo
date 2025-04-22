import fastapi
from app.models.models import  RecommendResponse, SentimentResponse
from app.services.recommender import  get_recommendations, get_recommendations_by_query
from app.services.reviewer import get_sentiment
from app.utils.db import wait_for_db
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import os



app = fastapi.FastAPI()

# Obtener la ruta absoluta al directorio static
static_dir = os.path.join(os.path.dirname(__file__), "static")

# Montar directorio estático
app.mount("/static", StaticFiles(directory=static_dir), name="static")

# Ruta específica para favicon.ico
@app.get("/favicon.ico", include_in_schema=False)
async def favicon():
    return FileResponse(os.path.join(static_dir, "favicon.ico"))

# 🔹 Esperar y verificar la conexión a la base de datos
@app.on_event("startup")
def startup_event():
    wait_for_db()

@app.get("/")
def read_root():
    return {"message": "Hello World"}

@app.get("/recommend/search", response_model=RecommendResponse)
async def search(query: str):
    try:
        print(f"Buscando productos similares a: {query}")
        recommendations = get_recommendations_by_query(query = query, n_recommendations=5)
        response = RecommendResponse(
            productIds=recommendations[0],
            scores=recommendations[1]
        )   
        return response
    except ValueError as e:
        print(e)
        raise fastapi.HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        print(f"Error desconocido: {e}")
        raise fastapi.HTTPException(status_code=500, detail="Internal Server Error")

@app.get("/recommend/{product_id}", response_model=RecommendResponse)
async def recommend(product_id: int):  
    try:
        print(f"Recomendando productos para el producto: {product_id}")
        recommendations = get_recommendations(product_id = product_id, n_recommendations=3)
        response = RecommendResponse(
            productIds=recommendations[0],
            scores=recommendations[1]
        )   
        return response
    except ValueError as e:
        # Si no se encuentra el producto, lanzamos un 404
        print(e)
        raise fastapi.HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        # Si ocurre otro error, respondemos con un 500
        print(f"Error desconocido: {e}")
        raise fastapi.HTTPException(status_code=500, detail="Internal Server Error")

@app.get("/sentiment/{review_id}", response_model=SentimentResponse)
async def sentiment(review_id: int):
    try:
        print(f"Obteniendo sentimiento del comentario: {review_id}")
        sentiment = get_sentiment(review_id)
        response = SentimentResponse(
            probs=sentiment[0],
            pred=sentiment[1]
        )
        return response
    except ValueError as e:
        print(e)
        raise fastapi.HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        print(f"Error desconocido: {e}")
        raise fastapi.HTTPException(status_code=500, detail="Internal Server Error")