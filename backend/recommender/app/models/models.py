from pydantic import BaseModel
from typing import List


class RecommendRequest(BaseModel):
    product_id : int


class RecommendResponse(BaseModel):
    productIds : List[int]
    scores : List[float]

