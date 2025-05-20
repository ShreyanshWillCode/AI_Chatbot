# backend/model.py
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

class ChatModel:
    def __init__(self, csv_path):
        self.df = pd.read_csv(csv_path)

        if 'Question' not in self.df.columns or 'Answer' not in self.df.columns:
            raise ValueError("CSV must have 'Question' and 'Answer' columns.")

        self.vectorizer = TfidfVectorizer()
        self.X = self.vectorizer.fit_transform(self.df['Question'])

    def get_response_and_suggestions(self, query, top_n=3):
        query_vec = self.vectorizer.transform([query])
        similarity = cosine_similarity(query_vec, self.X).flatten()

        # Best answer index
        best_idx = similarity.argmax()
        best_answer = self.df.iloc[best_idx]['Answer']

        # Get top N suggestions based on similarity, excluding best_idx itself
        top_indices = similarity.argsort()[::-1]
        suggestions = []
        for idx in top_indices:
            if idx != best_idx and len(suggestions) < top_n:
                suggestions.append(self.df.iloc[idx]['Question'])

        return best_answer, suggestions
