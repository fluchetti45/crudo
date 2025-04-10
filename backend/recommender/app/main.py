import fastapi
from app.models.models import  RecommendResponse
from app.services.recommender import  get_recommendations, get_recommendations_by_query


app = fastapi.FastAPI()




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

