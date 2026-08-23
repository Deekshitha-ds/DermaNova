import React, { useState } from "react";

function NovaChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

  const quickQuestions = [
    ["🧴", "What skincare routine should I follow?"],
    ["✨", "How can I improve my skin health?"],
    ["🔬", "What does my skin analysis mean?"],
    ["💗", "Give me some skincare tips"],
  ];

  const handleSend = () => {
    const text = input.trim();

    if (!text) return;

    setMessages((prev) => [
      ...prev,
      { sender: "user", text },
      {
        sender: "bot",
        text: "I'm Nova! I'm here to help you understand your skincare needs. 💜",
      },
    ]);

    setInput("");
  };

  const handleQuickQuestion = (question) => {
    setMessages((prev) => [
      ...prev,
      { sender: "user", text: question },
      {
        sender: "bot",
        text: "That's a great question! I can help you explore skincare routines, skin health, and your DermaNova analysis. ✨",
      },
    ]);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSend();
    }
  };

  if (!isOpen) {
    return (
      <button
        className="nova-floating-button"
        onClick={() => setIsOpen(true)}
        aria-label="Open Nova chatbot"
      >
        <span>✨</span>

        <div>
          <strong>Nova</strong>
          <small>Your skincare assistant</small>
        </div>
      </button>
    );
  }

  return (
    <div className="nova-chatbot">
      <div className="nova-header">
        <div className="nova-header-info">
          <div className="nova-avatar">✨</div>

          <div>
            <h3>Nova</h3>
            <span>Your skincare assistant</span>
          </div>
        </div>

        <button
          className="nova-close"
          onClick={() => setIsOpen(false)}
          aria-label="Close Nova chatbot"
        >
          ×
        </button>
      </div>

      <div className="nova-messages">
        {messages.length === 0 ? (
          <div className="nova-welcome">
            <div className="nova-large-icon">✨</div>

            <h2>Hi, I'm Nova!</h2>

            <p>
              Your personal skincare assistant. Ask me anything about your
              skin, skincare routines, or your DermaNova results.
            </p>

            <span className="nova-question-label">
              Try asking me:
            </span>

            <div className="nova-quick-options">
              {quickQuestions.map(([icon, question]) => (
                <button
                  key={question}
                  onClick={() => handleQuickQuestion(question)}
                >
                  <span>{icon}</span>
                  {question}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((message, index) => (
            <div
              key={index}
              className={`nova-message-row ${message.sender}`}
            >
              {message.sender === "bot" && (
                <div className="nova-small-avatar">✨</div>
              )}

              <div className="nova-message">{message.text}</div>
            </div>
          ))
        )}
      </div>

      <div className="nova-input-area">
        <input
          type="text"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask Nova something..."
        />

        <button
          onClick={handleSend}
          disabled={!input.trim()}
          aria-label="Send message"
        >
          ➤
        </button>
      </div>
    </div>
  );
}

export default NovaChatbot;