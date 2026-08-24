import { useState } from "react";

const quickQuestions = [
  {
    icon: "🔍",
    text: "Understand my scan",
    question: "Can you explain my skin scan results?",
  },
  {
    icon: "🧴",
    text: "Understand my routine",
    question: "Can you explain my skincare routine?",
  },
  {
    icon: "✨",
    text: "General skin questions",
    question: "What are some basic tips for healthy skin?",
  },
  {
    icon: "💇",
    text: "Hair & scalp questions",
    question: "How can I take better care of my hair and scalp?",
  },
];

function NovaChatbot({ scanContext = null }) {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const getBotResponse = (question) => {
    const lowerQuestion = question.toLowerCase();

    // Scan / Results
    if (
      lowerQuestion.includes("scan") ||
      lowerQuestion.includes("result") ||
      lowerQuestion.includes("analysis")
    ) {
      if (scanContext) {
        return "I can help you understand your scan results. Based on the information available from your DermaNova analysis, I can explain what each result means in simple terms. Remember that an AI-based skin scan is an estimate and is not a medical diagnosis.";
      }

      return "I'd be happy to explain your scan results! Please complete a skin scan first, and I'll help you understand what the different results mean.";
    }

    // Skincare / Routine
    if (
      lowerQuestion.includes("routine") ||
      lowerQuestion.includes("moisturizer") ||
      lowerQuestion.includes("moisturiser") ||
      lowerQuestion.includes("skincare") ||
      lowerQuestion.includes("skin care")
    ) {
      return "A good skincare routine usually focuses on gentle cleansing, moisturising, and daytime sun protection. Your ideal routine depends on your skin's needs and how your skin responds to products.";
    }

    // Hair / Scalp
    if (
      lowerQuestion.includes("hair") ||
      lowerQuestion.includes("scalp") ||
      lowerQuestion.includes("dandruff")
    ) {
      return "Healthy hair care starts with keeping the scalp clean, using products suited to your hair type, and avoiding excessive heat or harsh treatments. If you have persistent scalp problems, a qualified professional can help determine the cause.";
    }

    // Acne
    if (
      lowerQuestion.includes("acne") ||
      lowerQuestion.includes("pimple") ||
      lowerQuestion.includes("pimples")
    ) {
      return "Acne can have many contributing factors, including oil production, clogged pores, hormones, and inflammation. Gentle cleansing, avoiding excessive scrubbing, and choosing suitable non-comedogenic products can help. Persistent or severe acne should be evaluated by a qualified healthcare professional.";
    }

    // Dry Skin / Hydration
    if (
      lowerQuestion.includes("dry") ||
      lowerQuestion.includes("hydration") ||
      lowerQuestion.includes("dehydrated")
    ) {
      return "Dry or dehydrated-looking skin can benefit from a gentle cleanser and a suitable moisturiser. Applying moisturiser regularly can help support the skin barrier and reduce moisture loss.";
    }

    // Sensitive Skin
    if (
      lowerQuestion.includes("sensitive") ||
      lowerQuestion.includes("irritation") ||
      lowerQuestion.includes("irritated")
    ) {
      return "For sensitive or easily irritated skin, keep your routine simple. Use gentle, fragrance-free products where possible, avoid harsh scrubbing, and introduce new products one at a time.";
    }

    // General Skin Health
    if (
      lowerQuestion.includes("healthy skin") ||
      lowerQuestion.includes("skin health") ||
      lowerQuestion.includes("skin tips") ||
      lowerQuestion.includes("improve my skin")
    ) {
      return "Some basic habits that support skin health include gentle cleansing, regular moisturising, daytime sun protection, getting enough sleep, staying hydrated, and avoiding unnecessary irritation from harsh products.";
    }

    // Default response
    return "I'm Nova ✨, your DermaNova skin and hair assistant. I can help you understand your scan, skincare routine, skin health, and hair or scalp care. Ask me anything!";
  };

  const sendMessage = (text = message) => {
    const trimmedMessage = text.trim();

    if (!trimmedMessage) {
      return;
    }

    const userMessage = {
      sender: "user",
      text: trimmedMessage,
    };

    const botMessage = {
      sender: "bot",
      text: getBotResponse(trimmedMessage),
    };

    setMessages((prevMessages) => [
      ...prevMessages,
      userMessage,
      botMessage,
    ]);

    setMessage("");
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Floating Nova Button */}
      {!isOpen && (
        <button
          type="button"
          className="nova-floating-button"
          onClick={() => setIsOpen(true)}
          aria-label="Open Nova chatbot"
        >
          <span>✨</span>

          <div>
            <strong>Ask Nova</strong>
            <small>Your skin assistant</small>
          </div>
        </button>
      )}

      {/* Nova Chatbot */}
      {isOpen && (
        <div className="nova-chatbot">
          {/* Header */}
          <div className="nova-header">
            <div className="nova-header-info">
              <div className="nova-avatar">✨</div>

              <div>
                <h3>Nova</h3>
                <span>Your DermaNova AI Assistant</span>
              </div>
            </div>

            <button
              type="button"
              className="nova-close"
              onClick={() => setIsOpen(false)}
              aria-label="Close Nova chatbot"
            >
              ×
            </button>
          </div>

          {/* Messages */}
          <div className="nova-messages">
            {messages.length === 0 ? (
              <div className="nova-welcome">
                <div className="nova-large-icon">✨</div>

                <h2>Hi! I'm Nova 👋</h2>

                <p>
                  Your personal DermaNova assistant for understanding
                  your skin, hair, and scan results.
                </p>

                <span className="nova-question-label">
                  What would you like to know?
                </span>

                <div className="nova-quick-options">
                  {quickQuestions.map((item) => (
                    <button
                      type="button"
                      key={item.question}
                      onClick={() => sendMessage(item.question)}
                    >
                      <span>{item.icon}</span>
                      {item.text}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((msg, index) => (
                <div
                  key={`${msg.sender}-${index}`}
                  className={`nova-message-row ${msg.sender}`}
                >
                  {msg.sender === "bot" && (
                    <div className="nova-small-avatar">✨</div>
                  )}

                  <div className="nova-message">
                    {msg.text}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Input */}
          <div className="nova-input-area">
            <input
              type="text"
              placeholder="Ask Nova anything..."
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              onKeyDown={handleKeyDown}
              aria-label="Message Nova"
            />

            <button
              type="button"
              onClick={() => sendMessage()}
              disabled={!message.trim()}
              aria-label="Send message"
            >
              ➤
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default NovaChatbot;