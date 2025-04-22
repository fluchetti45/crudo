import os
import torch
from transformers import BertModel, BertTokenizer
from app.models.models import SentimentBeto
from app.utils.db import connect_to_database
import pandas as pd

MODEL_NAME = "BetoSentiment"

def get_review(review_id : int):
    engine = connect_to_database()
    query = f"SELECT id, comment FROM CustomerReview WHERE id = {review_id}"
    df = pd.read_sql(query, engine)
    return df

def load_model():
    beto = BertModel.from_pretrained("dccuchile/bert-base-spanish-wwm-uncased").to(device)
    model = SentimentBeto(beto)
    model.load_state_dict(torch.load(os.path.join(os.path.dirname(__file__), f"{MODEL_NAME}.pth"), map_location=device))
    model.eval()
    return model

def tokenize_review(review : str, tokenizer : BertTokenizer):
    tokens = tokenizer(review, return_tensors="pt", padding=True, truncation=True, max_length=400)
    return tokens

def predict_sentiment(review : str, model : SentimentBeto, tokenizer : BertTokenizer):
    tokens = tokenize_review(review, tokenizer)
    with torch.no_grad():
        output = model(tokens["input_ids"], tokens["attention_mask"])
    probs = torch.nn.functional.softmax(output, dim=1)
    pred = torch.argmax(probs, dim=1).item()
    probs = probs.tolist()[0]
    return [probs, pred]

def get_sentiment(review_id : int):
    try:
        review = get_review(review_id)
        if review.empty:
            raise ValueError("Review not found")
        comment = review.comment.values[0]
        probs = predict_sentiment(comment, model, tokenizer)
        return probs
    except ValueError as e:
        print(e)
        raise ValueError("Error al obtener el sentimiento del comentario")
    except Exception as e:
        print(e)
        raise ValueError("Error al obtener el sentimiento del comentario")

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
tokenizer = BertTokenizer.from_pretrained("dccuchile/bert-base-spanish-wwm-uncased")
model = load_model()

