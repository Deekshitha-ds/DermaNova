import { useEffect, useRef, useState } from "react";
import "./NovaChatbot.css"
/* =====================================================
   NOVA ROBOT
   Uses ONE consistent robot asset everywhere.
===================================================== */

function NovaRobot({ className = "" }) {
  return (
    <img
      src="/robot.png"
      alt="Nova AI"
      className={`nova-robot ${className}`}
      draggable="false"
    />
  );
}


/* =====================================================
   ICONS
===================================================== */

function MicIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect
        x="8"
        y="3"
        width="8"
        height="12"
        rx="4"
      />

      <path d="M5 11C5 15.2 8 18 12 18C16 18 19 15.2 19 11" />

      <path d="M12 18V21" />
    </svg>
  );
}


function SendIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M21 3L10.5 13.5" />
      <path d="M21 3L14.2 21L10.5 13.5L3 9.6L21 3Z" />
    </svg>
  );
}


function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M6 6L18 18" />
      <path d="M18 6L6 18" />
    </svg>
  );
}


/* =====================================================
   NOVA CHATBOT
===================================================== */

export default function NovaChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [message, setMessage] = useState("");

  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "nova",
      text: "Hi! I'm Nova ✨",
    },
    {
      id: 2,
      type: "nova",
      text: "Let's talk about your skin. Tell me what's on your mind.",
    },
  ]);

  const recognitionRef = useRef(null);
  const messagesRef = useRef(null);


  /* =====================================================
     SPEECH RECOGNITION
  ===================================================== */

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onresult = (event) => {
      const spokenText =
        event.results[0][0].transcript;

      setMessage((previous) =>
        previous
          ? `${previous} ${spokenText}`
          : spokenText
      );
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
    };
  }, []);


  /* =====================================================
     AUTO SCROLL
  ===================================================== */

  useEffect(() => {
    if (!messagesRef.current) return;

    messagesRef.current.scrollTop =
      messagesRef.current.scrollHeight;
  }, [messages]);


  /* =====================================================
     OPEN / CLOSE
  ===================================================== */

  const openNova = () => {
    setIsOpen(true);
  };

  const closeNova = () => {
    setIsListening(false);

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // already stopped
      }
    }

    setIsOpen(false);
  };


  /* =====================================================
     MICROPHONE
  ===================================================== */

  const toggleMicrophone = () => {
    if (!recognitionRef.current) {
      setIsListening((previous) => !previous);
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      return;
    }

    try {
      recognitionRef.current.start();
    } catch {
      setIsListening(true);
    }
  };


  /* =====================================================
     SEND
  ===================================================== */

  const sendMessage = () => {
    const cleanMessage = message.trim();

    if (!cleanMessage) return;

    setMessages((previous) => [
      ...previous,
      {
        id: Date.now(),
        type: "user",
        text: cleanMessage,
      },
    ]);

    setMessage("");

    /* Temporary response */
    setTimeout(() => {
      setMessages((previous) => [
        ...previous,
        {
          id: Date.now() + 1,
          type: "nova",
          text:
            "I'd love to help ✨ Tell me a little more about your skin.",
        },
      ]);
    }, 700);
  };


  /* =====================================================
     ENTER TO SEND
  ===================================================== */

  const handleKeyDown = (event) => {
    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {
      event.preventDefault();
      sendMessage();
    }
  };


  /* =====================================================
     CLOSED STATE — FLOATING ROBOT
  ===================================================== */

  if (!isOpen) {
    return (
      <button
        className="nova-launcher"
        onClick={openNova}
        aria-label="Open Nova AI"
      >
        <span className="launcher-aura" />

        <span className="launcher-card">
          <NovaRobot />
        </span>

        <span className="launcher-online" />

        <span className="launcher-spark spark-one">
          ✦
        </span>

        <span className="launcher-spark spark-two">
          ✧
        </span>
      </button>
    );
  }


  /* =====================================================
     OPEN CHATBOT
  ===================================================== */

  return (
    <div className="nova-window">


      {/* =================================================
          HEADER
      ================================================= */}

      <header className="nova-header">

        <div className="nova-header-left">

          <div className="nova-header-avatar">
            <NovaRobot />
          </div>

          <div className="nova-header-info">

            <div className="nova-title">
              NOVA AI

              <span className="nova-ai-pill">
                AI
              </span>

              <span className="title-spark">
                ✦
              </span>
            </div>

            <div className="nova-subtitle">
              <span className="status-dot" />
              AI Assistant
            </div>

          </div>

        </div>


        <button
          className="nova-close"
          onClick={closeNova}
          aria-label="Close Nova"
        >
          <CloseIcon />
        </button>

      </header>


      {/* =================================================
          CHAT BODY
      ================================================= */}

      <main className="nova-body">

        {/* Decorative background */}
        <div className="body-glow glow-left" />
        <div className="body-glow glow-right" />
        <div className="body-spark spark-top">
          ✦
        </div>


        {/* =============================================
            WELCOME
        ============================================= */}

        <section className="nova-welcome">

          <div className="welcome-spark">
            ✦
          </div>

          <h1>
            Hi, I'm Nova
            <span>✦</span>
          </h1>

          <p>
            Let's talk about your skin.
          </p>

          <div className="welcome-decoration">
            <span />
            <b>♥</b>
            <span />
          </div>

        </section>


        {/* =============================================
            CONVERSATION
        ============================================= */}

        <section
          className="nova-messages"
          ref={messagesRef}
        >

          {messages.map((item) => (

            <div
              key={item.id}
              className={`nova-message-row ${item.type}`}
            >

              {item.type === "nova" && (
                <div className="message-avatar">
                  <NovaRobot />
                </div>
              )}

              <div className="message-bubble">
                {item.text}
              </div>

            </div>

          ))}

        </section>


        {/* =============================================
            LISTENING OVERLAY
        ============================================= */}

        {isListening && (

          <div className="nova-listening">

            <button
              className="listening-close"
              onClick={toggleMicrophone}
              aria-label="Stop listening"
            >
              ×
            </button>


            <div className="listening-content">

              <div className="listening-orb">

                {/* Ripple rings */}

                <span className="orb-ring orb-ring-1" />
                <span className="orb-ring orb-ring-2" />
                <span className="orb-ring orb-ring-3" />
                <span className="orb-ring orb-ring-4" />

                {/* Sound waves */}

                <span className="sound-wave sound-wave-1" />
                <span className="sound-wave sound-wave-2" />

                {/* Robot */}

                <div className="orb-robot">
                  <NovaRobot />
                </div>

                {/* Mic */}

                <div className="orb-mic">
                  <MicIcon />
                </div>

              </div>


              <h2>
                Nova is listening...
              </h2>

              <p>
                Speak naturally
              </p>


              <div className="voice-bars">
                <span />
                <span />
                <span />
                <span />
                <span />
                <span />
                <span />
              </div>

            </div>

          </div>

        )}

      </main>


      {/* =================================================
          MESSAGE INPUT
      ================================================= */}

      <footer className="nova-footer">

        <div className="nova-input-container">

          <textarea
            value={message}
            onChange={(event) =>
              setMessage(event.target.value)
            }
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            rows={1}
          />


          <button
            className={`nova-mic-button ${
              isListening ? "listening" : ""
            }`}
            onClick={toggleMicrophone}
            aria-label="Use microphone"
          >
            <MicIcon />
          </button>


          <button
            className="nova-send-button"
            onClick={sendMessage}
            disabled={!message.trim()}
            aria-label="Send message"
          >
            <SendIcon />
          </button>

        </div>


        <div className="nova-disclaimer">
          Nova provides general skincare guidance, not medical diagnosis.
        </div>

      </footer>

    </div>
  );
}