import React, { useEffect, useRef, useState } from "react";
import "./NovaChatbot.css";

const initialMessages = [
  {
    id: 1,
    sender: "nova",
    text: "I'm Nova, your AI skin assistant ✨",
  },
  {
    id: 2,
    sender: "nova",
    text: "Tell me what's going on with your skin, or tap the microphone and talk to me.",
  },
];

const quickPrompts = [
  "My skin feels very dry lately",
  "I have frequent breakouts",
  "How can I build a simple routine?",
];

function NovaIcon() {
  return (
    <svg viewBox="0 0 64 64" className="nova-icon" aria-hidden="true">
      <defs>
        <linearGradient id="novaRobotGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f4dfff" />
          <stop offset="50%" stopColor="#d9b8ff" />
          <stop offset="100%" stopColor="#ffb7d9" />
        </linearGradient>
      </defs>

      <rect
        x="13"
        y="17"
        width="38"
        height="32"
        rx="12"
        fill="url(#novaRobotGradient)"
      />

      <path
        d="M32 17V11"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />

      <circle cx="32" cy="8" r="3" fill="currentColor" />

      <circle cx="24" cy="31" r="4" fill="#6f4a93" />
      <circle cx="40" cy="31" r="4" fill="#6f4a93" />

      <path
        d="M24 40C27 43 37 43 40 40"
        fill="none"
        stroke="#6f4a93"
        strokeWidth="3"
        strokeLinecap="round"
      />

      <path
        d="M13 28H8M51 28H56"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M21 3L10.5 13.5M21 3L14.3 21L10.5 13.5L3 9.7L21 3Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MicIcon({ active = false }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect
        x="8"
        y="3"
        width="8"
        height="12"
        rx="4"
        fill={active ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M5 11C5 14.87 8.13 18 12 18C15.87 18 19 14.87 19 11"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M12 18V22M9 22H15"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M6 6L18 18M18 6L6 18"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function Sparkles() {
  return (
    <span className="nova-sparkles" aria-hidden="true">
      <i className="sparkle sparkle-one">✦</i>
      <i className="sparkle sparkle-two">✧</i>
      <i className="sparkle sparkle-three">✦</i>
    </span>
  );
}

export default function NovaChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState(initialMessages);

  const recognitionRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
    });
  }, [messages]);

  useEffect(() => {
    return () => {
      recognitionRef.current?.stop();
    };
  }, []);

  const addMessage = (sender, text) => {
    setMessages((current) => [
      ...current,
      {
        id: Date.now() + Math.random(),
        sender,
        text,
      },
    ]);
  };

  const generateNovaResponse = (userText) => {
    const text = userText.toLowerCase();

    if (text.includes("dry") || text.includes("dehydrated")) {
      return "Dry or dehydrated skin usually benefits from a gentle cleanser, a hydrating layer, and a moisturizer that supports the skin barrier. If you tell me your current routine, I can help you simplify it.";
    }

    if (
      text.includes("breakout") ||
      text.includes("acne") ||
      text.includes("pimple")
    ) {
      return "For frequent breakouts, consistency is usually more useful than using lots of products at once. A gentle cleanser, non-comedogenic moisturizer, and one suitable acne-focused active can be a good starting point.";
    }

    if (
      text.includes("routine") ||
      text.includes("skincare") ||
      text.includes("skin care")
    ) {
      return "Let's keep it simple: cleanse, moisturize, and use sunscreen in the morning. Depending on your concerns, we can gradually add one targeted product rather than overwhelming your skin.";
    }

    if (
      text.includes("sensitive") ||
      text.includes("irritat") ||
      text.includes("redness")
    ) {
      return "If your skin is feeling sensitive, I'd keep your routine gentle for now and avoid introducing several new products together. Tell me what you're currently using and what you're noticing.";
    }

    return "I can help you think through your skin concerns and build a simple routine. Tell me a little more about what you're noticing, including how long it's been happening and what products you're currently using.";
  };

  const handleSend = (text = input) => {
    const cleanText = text.trim();

    if (!cleanText) return;

    addMessage("user", cleanText);
    setInput("");

    window.setTimeout(() => {
      addMessage("nova", generateNovaResponse(cleanText));
    }, 650);
  };

  const startVoiceRecognition = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      addMessage(
        "nova",
        "Voice input isn't supported by this browser yet. You can still type your skincare question below."
      );
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = "en-US";
    recognition.interimResults = true;
    recognition.continuous = false;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      let transcript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }

      setInput(transcript);

      if (event.results[event.results.length - 1].isFinal) {
        handleSend(transcript);
      }
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {!isOpen && (
        <button
          className="nova-launcher"
          onClick={() => setIsOpen(true)}
          aria-label="Open Nova AI skin assistant"
        >
          <span className="launcher-glow" />
          <Sparkles />

          <span className="launcher-robot">
            <NovaIcon />
          </span>

          <span className="launcher-status" />
        </button>
      )}

      {isOpen && (
        <section className="nova-chatbot" aria-label="Nova AI skin assistant">
          <div className="nova-background-glow glow-left" />
          <div className="nova-background-glow glow-right" />

          <header className="nova-header">
            <div className="nova-brand">
              <div className="nova-mini-avatar">
                <NovaIcon />
              </div>

              <div>
                <div className="nova-title-row">
                  <h2>Nova</h2>
                  <span className="nova-ai-pill">AI</span>
                </div>

                <div className="nova-online">
                  <span />
                  Skin assistant
                </div>
              </div>
            </div>

            <button
              className="nova-close"
              onClick={() => setIsOpen(false)}
              aria-label="Close Nova"
            >
              <CloseIcon />
            </button>
          </header>

          <div className="nova-content">
            <aside className="nova-voice-panel">
              <div className="voice-intro">
                <span className="voice-eyebrow">YOUR SKIN COMPANION</span>
                <h3>
                  Let's talk about
                  <br />
                  <em>your skin.</em>
                </h3>
                <p>
                  Ask Nova anything about your skincare routine, concerns, or
                  everyday skin habits.
                </p>
              </div>

              <div
                className={`voice-orb-wrapper ${
                  isListening ? "is-listening" : ""
                }`}
              >
                <div className="voice-ripple ripple-one" />
                <div className="voice-ripple ripple-two" />
                <div className="voice-ripple ripple-three" />

                <button
                  className="voice-orb"
                  onClick={startVoiceRecognition}
                  aria-label={
                    isListening
                      ? "Stop listening"
                      : "Start voice conversation"
                  }
                >
                  <div className="orb-shine" />

                  <div className="orb-robot">
                    <NovaIcon />
                  </div>

                  <span className="orb-mic">
                    <MicIcon active={isListening} />
                  </span>
                </button>

                <span className="voice-orb-label">
                  {isListening ? "Listening..." : "Tap to talk"}
                </span>
              </div>

              <div className="voice-hint">
                <span className="hint-icon">✦</span>
                <span>
                  {isListening
                    ? "I'm listening to you"
                    : "Your skin questions stay in this conversation"}
                </span>
              </div>
            </aside>

            <div className="nova-chat-panel">
              <div className="chat-heading">
                <div>
                  <span className="chat-eyebrow">CONVERSATION</span>
                  <h3>Hi, I'm Nova ✨</h3>
                </div>

                <span className="secure-badge">
                  <span>●</span> Ready
                </span>
              </div>

              <div className="nova-messages">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`message-row ${
                      message.sender === "user" ? "user-row" : "nova-row"
                    }`}
                  >
                    {message.sender === "nova" && (
                      <div className="message-avatar">
                        <NovaIcon />
                      </div>
                    )}

                    <div
                      className={`message-bubble ${
                        message.sender === "user"
                          ? "user-bubble"
                          : "nova-bubble"
                      }`}
                    >
                      {message.text}
                    </div>
                  </div>
                ))}

                <div ref={messagesEndRef} />
              </div>

              <div className="quick-prompts">
                {quickPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => handleSend(prompt)}
                  >
                    {prompt}
                  </button>
                ))}
              </div>

              <div className="nova-composer">
                <button
                  className={`composer-mic ${
                    isListening ? "composer-mic-active" : ""
                  }`}
                  onClick={startVoiceRecognition}
                  aria-label="Use voice input"
                >
                  <MicIcon active={isListening} />
                </button>

                <textarea
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Tell Nova what's on your mind..."
                  rows={1}
                  aria-label="Message Nova"
                />

                <button
                  className="composer-send"
                  onClick={() => handleSend()}
                  disabled={!input.trim()}
                  aria-label="Send message"
                >
                  <SendIcon />
                </button>
              </div>

              <div className="nova-disclaimer">
                Nova provides general skincare information and isn't a
                substitute for a dermatologist.
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
}