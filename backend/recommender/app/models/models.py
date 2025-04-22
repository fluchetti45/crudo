from pydantic import BaseModel
from typing import List
import torch.nn as nn


class RecommendRequest(BaseModel):
    product_id : int


class RecommendResponse(BaseModel):
    productIds : List[int]
    scores : List[float]


class SentimentResponse(BaseModel):
    probs : List[float]
    pred : int


class SentimentBeto(nn.Module):
  def __init__(self,beto,dropout = 0.3, hidden_size = 768):
    super(SentimentBeto, self).__init__()
    self.beto = beto
    # Extiendo beto. A su salida meto dropout
    self.dropout = nn.Dropout(p = dropout)
    # FC -> RELU -> Dropout -> FC
    self.classifier = nn.Sequential(
        nn.Linear(in_features = hidden_size, out_features = 256), # Beto genera embeddings de 768 dimensiones.
        nn.ReLU(),
        nn.Dropout(dropout),
        nn.Linear(256,3) # Salimos con 2 clases.
    )
  def forward(self, input_ids, attention_mask):
    outputs = self.beto(input_ids = input_ids , attention_mask = attention_mask) # proceso cada secuencia por Beto.
    # Cada secuencia sale con dim sequence_length, hidden_size (512, 768). Vamos a pasar batches osea va a ser (batch_size,sequence_length,hidden_size)
    cls_output = outputs.last_hidden_state[:,0,:] # Token [CLS], el que guarda el 'sentido' del texto.
    x = self.dropout(cls_output)
    return self.classifier(x)