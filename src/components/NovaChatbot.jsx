import React, { useEffect, useRef, useState } from "react";
import "./NovaChatbot.css";

const responses = [
  {
    keywords: ["hello", "hi", "hey", "hii", "hola"],
    reply:
      "Hi! I'm Nova ✨ Your AI skin assistant. Ask me anything about skincare and I'll do my best to help."
  },

  {
    keywords: ["who are you", "what are you", "your name"],
    reply:
      "I'm Nova 🌸, your DermaNova skin assistant. I can help you understand common skincare concerns, ingredients, routines, and everyday skin-care questions."
  },

  {
    keywords: ["dry skin", "dryness", "skin is dry", "dry face"],
    reply:
      "For dry skin, focus on gentle cleansing and regular moisturization. Look for ingredients like ceramides, glycerin, hyaluronic acid, or squalane. Avoid very hot water and harsh cleansers."
  },

  {
    keywords: ["oily skin", "oily face", "oiliness", "too much oil"],
    reply:
      "Oily skin can benefit from a gentle cleanser, lightweight non-comedogenic moisturizer, and daily sunscreen. Avoid over-cleansing because it can sometimes make your skin feel even more irritated."
  },

  {
    keywords: ["acne", "pimples", "pimple", "breakouts", "breakout"],
    reply:
      "For acne-prone skin, keep your routine simple: gentle cleanser, lightweight moisturizer, and sunscreen. Ingredients such as salicylic acid or benzoyl peroxide can help some people, but introduce active ingredients slowly."
  },

  {
    keywords: ["blackheads", "whiteheads", "clogged pores", "pores"],
    reply:
      "Clogged pores and blackheads are often helped by gentle cleansing and ingredients such as salicylic acid. Avoid squeezing them because that can irritate the skin and increase the chance of marks."
  },

  {
    keywords: ["dark spots", "pigmentation", "hyperpigmentation", "dark marks"],
    reply:
      "For dark spots, daily sunscreen is especially important because UV exposure can make pigmentation more noticeable. Ingredients such as vitamin C, niacinamide, and azelaic acid may also help over time."
  },

  {
    keywords: ["sunscreen", "spf", "sun screen"],
    reply:
      "Sunscreen should generally be the last step of your morning skincare routine. Choose broad-spectrum SPF 30 or higher and apply enough to cover your face and exposed areas. Reapply when you're outdoors for extended periods."
  },

  {
    keywords: ["moisturizer", "moisturiser", "moisturize", "moisturise"],
    reply:
      "Moisturizer helps support your skin barrier and reduce water loss. Even oily or acne-prone skin can benefit from one. Choose a texture that feels comfortable and look for 'non-comedogenic' if you're prone to clogged pores."
  },

  {
    keywords: ["vitamin c", "vit c"],
    reply:
      "Vitamin C is commonly used in morning skincare to support brighter-looking skin and help protect against environmental stressors. Start with a gentle formulation and use sunscreen during the day."
  },

  {
    keywords: ["niacinamide"],
    reply:
      "Niacinamide is a versatile skincare ingredient that can help support the skin barrier and improve the appearance of oiliness, redness, and uneven-looking skin. It is commonly used once or twice daily depending on the formulation."
  },

  {
    keywords: ["retinol", "retinoid"],
    reply:
      "Retinol is a vitamin A derivative commonly used for acne and signs of skin aging. It can be irritating when you first start, so introduce it gradually and use sunscreen during the day. Avoid using multiple strong actives at once when you're beginning."
  },

  {
    keywords: ["serum", "serums"],
    reply:
      "A serum is usually a lightweight product designed to deliver specific ingredients to the skin. Think of it as a targeted step rather than something everyone necessarily needs."
  },

  {
    keywords: ["skincare routine", "skin care routine", "routine"],
    reply:
      "A simple routine is a great starting point 🌸 Morning: gentle cleanser → moisturizer → sunscreen. Night: gentle cleanser → treatment or serum if needed → moisturizer. You don't need a huge number of products."
  },

  {
    keywords: ["sensitive skin", "sensitive", "irritated skin"],
    reply:
      "For sensitive skin, keep things simple. Choose gentle, fragrance-free products when possible and introduce one new product at a time. If something causes persistent burning, swelling, or significant irritation, stop using it."
  },

  {
    keywords: ["exfoliate", "exfoliation", "scrub", "scrubbing"],
    reply:
      "You don't need to exfoliate every day. Over-exfoliation can irritate your skin barrier. If you use an exfoliating product, start slowly and avoid combining several strong exfoliating or active products at once."
  },

  {
    keywords: ["face wash", "cleanser", "cleansing"],
    reply:
      "A gentle cleanser is usually enough for everyday cleansing. Avoid very hot water and harsh scrubbing. If your skin feels tight or uncomfortable after washing, your cleanser may be too drying."
  },

  {
    keywords: ["glowing skin", "glow", "bright skin"],
    reply:
      "Healthy-looking skin usually comes from consistent basics rather than lots of products: gentle cleansing, moisturization, daily sunscreen, enough sleep, and avoiding unnecessary irritation."
  },

  {
    keywords: ["morning routine", "morning skincare"],
    reply:
      "A simple morning routine can be: gentle cleanser → optional serum → moisturizer → sunscreen ☀️. Keep it simple and choose products that suit your skin."
  },

  {
    keywords: ["night routine", "night skincare", "night routine"],
    reply:
      "A simple night routine can be: gentle cleanser → optional treatment/serum → moisturizer 🌙. If you're using an active ingredient, introduce it gradually."
  },

  {
    keywords: ["thank you", "thanks", "thank"],
    reply:
      "You're welcome! 💜 I'm always happy to talk skincare with you."
  },

  {
    keywords: ["bye", "goodbye", "good night"],
    reply:
      "Bye! 🌸 Take care of your skin and remember — consistency matters more than having a shelf full of products."
  }
];

function getNovaReply(message) {
  const text = message.toLowerCase().trim();

  for (const item of responses) {
    if (item.keywords.some((keyword) => text.includes(keyword))) {
      return item.reply;
    }
  }

  return (
    "Hmm, I'm not quite sure about that one yet 😊 " +
    "You can ask me about acne, dry skin, oily skin, sunscreen, " +
    "moisturizers, serums, ingredients, skincare routines, or common skin concerns."
  );
}

export default function NovaChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const [messages, setMessages] = useState([
    {
      sender: "nova",
      text:
        "Hi, I'm Nova! ✨\nYour AI skin assistant.\nLet's talk about your skin."
    }
  ]);

  const recognitionRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth"
    });
  }, [messages, isTyping]);

  const speak = (text) => {
    if (!("speechSynthesis" in window)) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);

    utterance.rate = 0.95;
    utterance.pitch = 1.08;
    utterance.volume = 1;

    window.speechSynthesis.speak(utterance);
  };

  const sendMessage = () => {
    const text = input.trim();

    if (!text || isTyping) return;

    setMessages((prev) => [
      ...prev,
      {
        sender: "user",
        text
      }
    ]);

    setInput("");
    setIsTyping(true);

    const reply = getNovaReply(text);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          sender: "nova",
          text: reply
        }
      ]);

      setIsTyping(false);

      speak(reply);
    }, 700);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  const startVoiceInput = () => {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert(
        "Voice input isn't supported in this browser. Please use Chrome or Edge."
      );
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = "en-IN";
    recognition.interimResults = false;
    recognition.continuous = false;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      const transcript =
        event.results[0][0].transcript;

      setInput(transcript);
    };

    recognition.onerror = (event) => {
      console.error("Voice recognition error:", event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    recognition.start();
  };

  const stopSpeaking = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  };

  const toggleChat = () => {
    setIsOpen((prev) => !prev);

    if (isOpen) {
      stopSpeaking();
    }
  };

  return (
    <>
      {/* ==============================
          FLOATING NOVA ROBOT
      ============================== */}
      {!isOpen && (
        <button
          className="nova-launcher"
          onClick={toggleChat}
          aria-label="Open Nova AI skin assistant"
        >
          <div className="nova-launcher-glow" />

          <div className="nova-robot">
            <div className="nova-antenna">
              <span />
            </div>

            <div className="nova-head">
              <div className="nova-face">
                <span className="nova-eye left" />
                <span className="nova-eye right" />

                <span className="nova-smile" />
              </div>
            </div>

            <div className="nova-wave-hand">
              <span>👋</span>
            </div>
          </div>

          <span className="nova-sparkle sparkle-one">✦</span>
          <span className="nova-sparkle sparkle-two">✧</span>
          <span className="nova-sparkle sparkle-three">✦</span>
        </button>
      )}

      {/* ==============================
          CHAT WINDOW
      ============================== */}
      {isOpen && (
        <div className="nova-chat-window">

          {/* HEADER */}
          <div className="nova-chat-header">
            <div className="nova-header-avatar">
              <div className="mini-antenna" />
              <div className="mini-face">
                <span />
                <span />
                <b />
              </div>
            </div>

            <div className="nova-header-text">
              <h3>Nova AI</h3>
              <span>Skin assistant</span>
            </div>

            <button
              className="nova-close"
              onClick={toggleChat}
              aria-label="Close Nova"
            >
              ×
            </button>
          </div>

          {/* CHAT */}
          <div className="nova-chat-body">

            {messages.map((message, index) => (
              <div
                key={index}
                className={`nova-message-row ${
                  message.sender === "user"
                    ? "user-row"
                    : "nova-row"
                }`}
              >
                {message.sender === "nova" && (
                  <div className="nova-small-avatar">
                    ✨
                  </div>
                )}

                <div
                  className={`nova-message ${
                    message.sender === "user"
                      ? "user-message"
                      : "nova-message-bubble"
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="nova-message-row nova-row">
                <div className="nova-small-avatar">
                  ✨
                </div>

                <div className="nova-typing">
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* INPUT */}
          <div className="nova-input-area">

            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                isListening
                  ? "Listening..."
                  : "Ask Nova about your skin..."
              }
              rows={1}
            />

            <button
              className={`nova-voice-button ${
                isListening ? "listening" : ""
              }`}
              onClick={startVoiceInput}
              aria-label="Voice input"
            >
              {isListening ? "🔴" : "🎙️"}
            </button>

            <button
              className="nova-send-button"
              onClick={sendMessage}
              disabled={!input.trim() || isTyping}
              aria-label="Send message"
            >
              ➤
            </button>
          </div>

          <div className="nova-disclaimer">
            Nova provides general skincare information, not a medical diagnosis.
          </div>
        </div>
      )}
    </>
  );
}