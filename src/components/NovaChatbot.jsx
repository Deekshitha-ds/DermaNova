jsx
import { useEffect, useRef, useState } from "react";

/* =========================================================
   QUICK QUESTIONS
========================================================= */

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

/* =========================================================
   HELPERS
========================================================= */

const createMessage = (sender, text) => ({
  id: `${sender}-${Date.now()}-${Math.random()}`,
  sender,
  text,
  timestamp: new Date(),
});

const normalizeText = (text = "") => text.toLowerCase().trim();

/* =========================================================
   NOVA RESPONSE ENGINE
========================================================= */

function getBotResponse(question, scanContext) {
  const text = normalizeText(question);

  /* -------------------------------------------------------
     SCAN / ANALYSIS
  ------------------------------------------------------- */

  const isScanQuestion =
    text.includes("scan") ||
    text.includes("result") ||
    text.includes("analysis") ||
    text.includes("report") ||
    text.includes("face");

  if (isScanQuestion) {
    if (!scanContext) {
      return {
        text:
          "I'd be happy to explain your skin scan ✨. Please complete a skin scan first, and I'll help you understand your results.",
      };
    }

    const issues =
      scanContext.detected_issues ||
      scanContext.detectedIssues ||
      [];

    const skinType =
      scanContext.detected_type ||
      scanContext.detectedType ||
      "Not available";

    const confidence =
      scanContext.confidence ??
      scanContext.scores?.confidence ??
      null;

    let response = `Here's what I can tell you from your DermaNova scan:\n\n`;

    response += `🧴 Skin type: ${skinType}\n`;

    if (Array.isArray(issues) && issues.length > 0) {
      response += `\n🔎 Detected concerns:\n`;
      response += issues.map((issue) => `• ${issue}`).join("\n");
      response += "\n";
    }

    if (confidence !== null) {
      response += `\n📊 Analysis confidence: ${confidence}%\n`;
    }

    response +=
      "\nThis is an AI-based estimation, not a medical diagnosis. If you have persistent, painful, or severe skin concerns, consider consulting a qualified healthcare professional.";

    return { text: response };
  }

  /* -------------------------------------------------------
     SKINCARE ROUTINE
  ------------------------------------------------------- */

  const isRoutineQuestion =
    text.includes("routine") ||
    text.includes("skincare") ||
    text.includes("skin care") ||
    text.includes("moisturizer") ||
    text.includes("moisturiser") ||
    text.includes("cleanser") ||
    text.includes("serum");

  if (isRoutineQuestion) {
    return {
      text:
        "A simple skincare routine can be a great starting point ✨.\n\n" +
        "☀️ Morning:\n" +
        "• Gentle cleanser\n" +
        "• Moisturizer\n" +
        "• Broad-spectrum sunscreen\n\n" +
        "🌙 Night:\n" +
        "• Gentle cleanser\n" +
        "• Treatment product if appropriate\n" +
        "• Moisturizer\n\n" +
        "The best routine depends on your skin type, concerns, and how your skin responds to products.",
    };
  }

  /* -------------------------------------------------------
     ACNE
  ------------------------------------------------------- */

  const isAcneQuestion =
    text.includes("acne") ||
    text.includes("pimple") ||
    text.includes("pimples") ||
    text.includes("breakout") ||
    text.includes("blackhead") ||
    text.includes("whitehead");

  if (isAcneQuestion) {
    return {
      text:
        "Acne can be influenced by oil production, clogged pores, inflammation, hormones, and other factors.\n\n" +
        "Some helpful habits include:\n" +
        "• Use a gentle cleanser\n" +
        "• Avoid excessive scrubbing\n" +
        "• Choose non-comedogenic products\n" +
        "• Avoid repeatedly touching or squeezing pimples\n" +
        "• Use sunscreen during the day\n\n" +
        "If acne is severe, painful, persistent, or leaving scars, a dermatologist can help identify the most appropriate treatment.",
    };
  }

  /* -------------------------------------------------------
     DRY / DEHYDRATED SKIN
  ------------------------------------------------------- */

  const isDrySkinQuestion =
    text.includes("dry skin") ||
    text.includes("dry") ||
    text.includes("dehydrated") ||
    text.includes("hydration") ||
    text.includes("flaky") ||
    text.includes("rough skin");

  if (isDrySkinQuestion) {
    return {
      text:
        "For dry or dehydrated-looking skin, focus on protecting your skin barrier 💧.\n\n" +
        "Try:\n" +
        "• A gentle cleanser\n" +
        "• Regular moisturizer\n" +
        "• Avoid very hot water\n" +
        "• Avoid harsh scrubs\n" +
        "• Use sunscreen during the day\n\n" +
        "If your skin becomes persistently cracked, painful, itchy, or inflamed, consider getting professional advice.",
    };
  }

  /* -------------------------------------------------------
     OILY SKIN
  ------------------------------------------------------- */

  const isOilyQuestion =
    text.includes("oily") ||
    text.includes("oil") ||
    text.includes("greasy") ||
    text.includes("sebum");

  if (isOilyQuestion) {
    return {
      text:
        "If your skin becomes oily easily, try to keep your routine balanced rather than aggressively removing oil.\n\n" +
        "✨ Helpful habits:\n" +
        "• Use a gentle cleanser\n" +
        "• Choose lightweight, non-comedogenic moisturizer\n" +
        "• Avoid over-washing\n" +
        "• Use sunscreen suitable for your skin\n" +
        "• Avoid harsh products that leave your skin feeling stripped",
    };
  }

  /* -------------------------------------------------------
     SENSITIVE SKIN
  ------------------------------------------------------- */

  const isSensitiveQuestion =
    text.includes("sensitive") ||
    text.includes("irritation") ||
    text.includes("irritated") ||
    text.includes("burning") ||
    text.includes("redness");

  if (isSensitiveQuestion) {
    return {
      text:
        "For sensitive or easily irritated skin, keeping things simple is often helpful 🌿.\n\n" +
        "• Use gentle, fragrance-free products where possible\n" +
        "• Avoid harsh scrubs\n" +
        "• Introduce one new product at a time\n" +
        "• Stop using a product if it causes significant irritation\n" +
        "• Use sunscreen regularly\n\n" +
        "Persistent redness, burning, swelling, or irritation should be evaluated by a healthcare professional.",
    };
  }

  /* -------------------------------------------------------
     HAIR / SCALP
  ------------------------------------------------------- */

  const isHairQuestion =
    text.includes("hair") ||
    text.includes("scalp") ||
    text.includes("dandruff") ||
    text.includes("hair fall") ||
    text.includes("hairfall") ||
    text.includes("itchy scalp");

  if (isHairQuestion) {
    return {
      text:
        "Healthy hair care starts with a healthy scalp 💇✨.\n\n" +
        "Some useful habits:\n" +
        "• Keep the scalp clean\n" +
        "• Choose products suited to your hair type\n" +
        "• Avoid excessive heat styling\n" +
        "• Avoid very tight hairstyles\n" +
        "• Be gentle when brushing wet hair\n\n" +
        "If you have significant hair loss, persistent dandruff, scalp pain, or severe itching, consider consulting a qualified professional.",
    };
  }

  /* -------------------------------------------------------
     GENERAL SKIN HEALTH
  ------------------------------------------------------- */

  const isGeneralSkinQuestion =
    text.includes("healthy skin") ||
    text.includes("skin health") ||
    text.includes("skin tips") ||
    text.includes("improve my skin") ||
    text.includes("better skin") ||
    text.includes("glowing skin");

  if (isGeneralSkinQuestion) {
    return {
      text:
        "A few everyday habits can support healthy skin ✨:\n\n" +
        "🧴 Moisturize regularly\n" +
        "☀️ Use sunscreen during the day\n" +
        "🫧 Cleanse gently\n" +
        "💧 Stay adequately hydrated\n" +
        "😴 Get enough sleep\n" +
        "🥗 Maintain a balanced diet\n" +
        "🙅 Avoid unnecessary picking or harsh scrubbing",
    };
  }

  /* -------------------------------------------------------
     GREETING
  ------------------------------------------------------- */

  const isGreeting =
    text === "hi" ||
    text === "hello" ||
    text === "hey" ||
    text.includes("who are you");

  if (isGreeting) {
    return {
      text:
        "Hi! I'm Nova ✨, your DermaNova AI assistant. I can help you understand your skin scan, skincare routine, skin concerns, and hair or scalp care. What would you like to know?",
    };
  }

  /* -------------------------------------------------------
     DEFAULT
  ------------------------------------------------------- */

  return {
    text:
      "I'm Nova ✨. I can help with:\n\n" +
      "🔍 Skin scan results\n" +
      "🧴 Skincare routines\n" +
      "✨ Acne, dryness, oiliness and sensitivity\n" +
      "💇 Hair and scalp care\n\n" +
      "Try asking something like: \"What does my scan mean?\"",
  };
}

/* =========================================================
   NOVA CHATBOT
========================================================= */

function NovaChatbot({ scanContext = null }) {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  /* -------------------------------------------------------
     AUTO SCROLL
  ------------------------------------------------------- */

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, isTyping]);

  /* -------------------------------------------------------
     FOCUS INPUT WHEN OPENED
  ------------------------------------------------------- */

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  /* -------------------------------------------------------
     SEND MESSAGE
  ------------------------------------------------------- */

  const sendMessage = (text = message) => {
    const trimmedMessage = text.trim();

    if (!trimmedMessage || isTyping) {
      return;
    }

    const userMessage = createMessage("user", trimmedMessage);

    setMessages((previous) => [
      ...previous,
      userMessage,
    ]);

    setMessage("");
    setIsTyping(true);

    /* Simulate Nova thinking */
    setTimeout(() => {
      const response = getBotResponse(
        trimmedMessage,
        scanContext
      );

      const botMessage = createMessage(
        "bot",
        response.text
      );

      setMessages((previous) => [
        ...previous,
        botMessage,
      ]);

      setIsTyping(false);
    }, 500);
  };

  /* -------------------------------------------------------
     ENTER KEY
  ------------------------------------------------------- */

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  /* -------------------------------------------------------
     CLEAR CHAT
  ------------------------------------------------------- */

  const clearChat = () => {
    setMessages([]);
    setMessage("");
  };

  return (
    <>
      {/* =====================================================
          FLOATING BUTTON
      ===================================================== */}

      {!isOpen && (
        <button
          type="button"
          className="nova-floating-button"
          onClick={() => setIsOpen(true)}
          aria-label="Open Nova chatbot"
        >
          <span className="nova-floating-icon">
            ✨
          </span>

          <div>
            <strong>Ask Nova</strong>
            <small>Your skin assistant</small>
          </div>
        </button>
      )}

      {/* =====================================================
          CHATBOT
      ===================================================== */}

      {isOpen && (
        <div
          className="nova-chatbot"
          role="dialog"
          aria-label="Nova AI Assistant"
        >
          {/* HEADER */}

          <div className="nova-header">
            <div className="nova-header-info">
              <div className="nova-avatar">
                ✨
              </div>

              <div>
                <h3>Nova</h3>

                <span>
                  <i className="nova-online-dot" />
                  DermaNova AI Assistant
                </span>
              </div>
            </div>

            <div className="nova-header-actions">
              <button
                type="button"
                className="nova-clear"
                onClick={clearChat}
                aria-label="Clear conversation"
                title="Clear conversation"
              >
                ↻
              </button>

              <button
                type="button"
                className="nova-close"
                onClick={() => setIsOpen(false)}
                aria-label="Close Nova chatbot"
              >
                ×
              </button>
            </div>
          </div>

          {/* MESSAGES */}

          <div className="nova-messages">
            {messages.length === 0 ? (
              <div className="nova-welcome">
                <div className="nova-large-icon">
                  ✨
                </div>

                <h2>
                  Hi! I'm Nova 👋
                </h2>

                <p>
                  Your personal DermaNova assistant for
                  understanding your skin, hair, and scan
                  results.
                </p>

                <span className="nova-question-label">
                  What would you like to know?
                </span>

                <div className="nova-quick-options">
                  {quickQuestions.map((item) => (
                    <button
                      type="button"
                      key={item.question}
                      onClick={() =>
                        sendMessage(item.question)
                      }
                    >
                      <span>{item.icon}</span>

                      {item.text}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <>
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`nova-message-row ${msg.sender}`}
                  >
                    {msg.sender === "bot" && (
                      <div className="nova-small-avatar">
                        ✨
                      </div>
                    )}

                    <div className="nova-message">
                      {msg.text.split("\n").map(
                        (line, index) => (
                          <span
                            key={`${msg.id}-${index}`}
                          >
                            {line}

                            {index <
                              msg.text.split("\n")
                                .length -
                                1 && <br />}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                ))}

                {/* TYPING INDICATOR */}

                {isTyping && (
                  <div className="nova-message-row bot">
                    <div className="nova-small-avatar">
                      ✨
                    </div>

                    <div className="nova-message nova-typing">
                      <span />
                      <span />
                      <span />
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* INPUT */}

          <div className="nova-input-area">
            <input
              ref={inputRef}
              type="text"
              placeholder="Ask Nova anything..."
              value={message}
              onChange={(event) =>
                setMessage(event.target.value)
              }
              onKeyDown={handleKeyDown}
              disabled={isTyping}
              aria-label="Message Nova"
            />

            <button
              type="button"
              onClick={() => sendMessage()}
              disabled={
                !message.trim() || isTyping
              }
              aria-label="Send message"
            >
              ➤
            </button>
          </div>

          <div className="nova-disclaimer">
            Nova provides general information and does not
            replace professional medical advice.
          </div>
        </div>
      )}
    </>
  );
}

export default NovaChatbot;
