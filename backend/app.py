# backend/app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
from model import ChatModel
import os
app = Flask(__name__)
CORS(app)

chatbot = ChatModel("AI.csv")

@app.route("/chat", methods=["POST"])
def chat():
    data = request.get_json()
    user_message = data.get("message", "")
    response, suggestions = chatbot.get_response_and_suggestions(user_message)
    return jsonify({
        "response": response,
        "suggestions": suggestions
    })

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
