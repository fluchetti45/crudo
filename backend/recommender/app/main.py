
import fastapi
from app.models.models import RecommendRequest, RecommendResponse
from app.services.recommender import recommend_products


app = fastapi.FastAPI()




@app.get("/")
def read_root():
    return {"message": "Hello World"}


@app.get("/recommend/{product_id}", response_model=RecommendResponse)
async def recommend(product_id: int):  
    try:
        recommendations = recommend_products(product_id, n_recommendations=3)
    except ValueError as e:
        # Si no se encuentra el producto, lanzamos un 404
        print(e)
        raise fastapi.HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        # Si ocurre otro error, respondemos con un 500
        print(f"Error desconocido: {e}")
        raise fastapi.HTTPException(status_code=500, detail="Internal Server Error")
    response = RecommendResponse(
        productIds=recommendations[0],
        scores=recommendations[1]
    )
    return response







