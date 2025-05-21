import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const sendMessage = async (messageToSend = input) => {
    if (!messageToSend.trim()) return;

    const userMessage = { role: "user", text: messageToSend };
    setMessages(prev => [...prev, userMessage]);
    setInput("");  // Clear the input field

    try {
      const res = await axios.post("https://ai-chatbot-ux1r.onrender.com/chat", { message: messageToSend });

      const botMessage = { role: "bot", text: res.data.response };
      setMessages(prev => [...prev, botMessage]);

      // Update chat suggestions
      setSuggestions(res.data.suggestions || []);
    } catch (error) {
      console.error("Error fetching response:", error);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    sendMessage(suggestion);
    setSuggestions([]); // Optional: Clear suggestions on click
  };

  return (
    <div className="chat-layout">
      {/* Chat Section */}
      <div className="chat-panel">
        <h1>What can I help with?</h1>
        <div className="chat-log">
          {messages.map((msg, index) => (
            <div key={index} className={`chat-message ${msg.role}`}>
              {msg.text}
            </div>
          ))}
        </div>
        <div className="chat-input">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage()}
            placeholder="Type your message..."
          />
          <button onClick={() => sendMessage()}>➤</button>
        </div>
      </div>

      {/* Suggestions Sidebar */}
      <div className="suggestions-panel">
        <h3>Suggestions</h3>
        {suggestions.length === 0 ? (
          <p className="no-suggestions">No suggestions yet</p>
        ) : (
          <ul className="suggestions-list">
            {suggestions.map((sugg, idx) => (
              <li key={idx} onClick={() => handleSuggestionClick(sugg)}>
                {sugg}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default App;
