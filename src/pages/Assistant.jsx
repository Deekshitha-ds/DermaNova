import React, { useState } from "react";
import "./Assistant.css";
import { sendAssistantMessage } from "../api/assistant";

const consultations = [
  {
    id: "skin",
    icon: "✧",
    title: "Skin Analysis",
    description: "Understand your skin scan and detected concerns.",
    prompt: "Please explain my latest skin analysis results in detail.",
  },
  {
    id: "ingredients",
    icon: "⚗",
    title: "Ingredient Guide",
    description: "Learn about skincare ingredients and their benefits.",
    prompt: "Explain the most useful skincare ingredients and how to use them.",
  },
  {
    id: "products",
    icon: "♧",
    title: "Product Consultation",
    description: "Understand product recommendations and suitability.",
    prompt: "Help me understand which skincare products may suit my skin.",
  },
  {
    id: "progress",
    icon: "↗",
    title: "Progress Insights",
    description: "Understand changes across your saved skin scans.",
    prompt: "Help me understand my skin progress over time.",
  },
];

const features = [
  {
    icon: "✧",
    title: "Skin Insights",
    description: "Understand your skin and its unique needs.",
  },
  {
    icon: "♡",
    title: "Skincare Education",
    description: "Discover ingredients and skincare knowledge.",
  },
  {
    icon: "✦",
    title: "Personalized Guidance",
    description: "Explore skincare guidance for your journey.",
  },
];

export default function Assistant() {
  const [question, setQuestion] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("general");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState("");

  const chooseTopic = (topic) => {
    setSelectedTopic(topic.id);
    setQuestion(topic.prompt);
    setNotice("");

    document.getElementById("assistant-question")?.focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedQuestion = question.trim();

    if (!trimmedQuestion || loading) return;

    setNotice("");

    // Keep the previous conversation for context.
    const previousHistory = messages.map((message) => ({
      role: message.role === "assistant" ? "model" : "user",
      text: message.text,
    }));

    // Show the user's message immediately.
    setMessages((previous) => [
      ...previous,
      { role: "user", text: trimmedQuestion },
    ]);

    setQuestion("");
    setLoading(true);

    try {
      const response = await sendAssistantMessage({
        message: trimmedQuestion,
        consultationType: selectedTopic,
        conversationHistory: previousHistory,
      });

      if (!response?.reply) {
        throw new Error("The Assistant returned an empty response.");
      }

      setMessages((previous) => [
        ...previous,
        { role: "assistant", text: response.reply },
      ]);
    } catch (error) {
      console.error("Assistant API error:", error);

      const errorMessage =
        error.response?.data?.detail ||
        error.message ||
        "Unable to connect to Nova AI. Please try again.";

      setNotice(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const startNewConsultation = () => {
    setMessages([]);
    setQuestion("");
    setSelectedTopic("general");
    setNotice("");
  };

  return (
    <div className="assistant-page">
      {/* HERO SECTION */}

      <section className="assistant-hero">
        <div className="assistant-hero-content">
          <span className="assistant-eyebrow">
            ✨ DERMANOVA INTELLIGENCE
          </span>

          <h1>
            Your Personal
            <br />
            <span>Skin Consultation</span>
          </h1>

          <p>
            Understand your skin better with personalized insights,
            ingredient knowledge and intelligent skincare guidance.
          </p>

          {/* THREE INTERACTIVE FEATURE CARDS */}

          <div className="assistant-hero-tags">
            {features.map((feature) => (
              <div className="hero-feature" key={feature.title}>
                <span className="hero-feature-icon">
                  {feature.icon}
                </span>

                <span className="hero-feature-text">
                  {feature.title}
                </span>

                <span className="hero-feature-tooltip">
                  {feature.description}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ANIMATED DIAMOND DESIGN */}

        <div className="assistant-orb">
          <div className="diamond-orbit orbit-one"></div>
          <div className="diamond-orbit orbit-two"></div>
          <div className="diamond-glow"></div>

          <div className="assistant-orb-inner">
            <div className="diamond-symbol">✧</div>
          </div>

          <span className="diamond-spark spark-one">✦</span>
          <span className="diamond-spark spark-two">✧</span>
          <span className="diamond-spark spark-three">✦</span>
          <span className="diamond-spark spark-four">·</span>

          <div className="assistant-orb-caption">
            Your skincare journey, understood.
          </div>
        </div>
      </section>

      {/* CONSULTATION CARDS */}

      <section className="consultation-section">
        <div className="assistant-section-heading">
          <div>
            <span className="assistant-eyebrow">
              EXPLORE YOUR SKIN
            </span>

            <h2>How can we help you today?</h2>

            <p>Choose a consultation to get started.</p>
          </div>
        </div>

        <div className="consultation-grid">
          {consultations.map((item) => (
            <button
              type="button"
              key={item.id}
              className={`consultation-card ${
                selectedTopic === item.id ? "active" : ""
              }`}
              onClick={() => chooseTopic(item)}
              disabled={loading}
            >
              <div className="consultation-icon">
                {item.icon}
              </div>

              <h3>{item.title}</h3>

              <p>{item.description}</p>

              <span className="consultation-link">
                Explore consultation <span>→</span>
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* PERSONALIZED CONSULTATION SECTION */}

      <section className="consultation-chat-section">
        <div className="chat-intro">
          <span className="assistant-eyebrow">
            PERSONALIZED CONSULTATION
          </span>

          <h2>Let's understand your skin.</h2>

          <p>
            Have a specific question? Tell us what you would
            like to understand about your skincare journey.
          </p>
        </div>

        <div className="consultation-chat-card">
          <div className="consultation-welcome">
            <div className="consultation-avatar">✧</div>

            <div>
              <h3>DermaNova Skin Consultant</h3>

              <p>
                Welcome! Explore your skin concerns, learn about
                ingredients and make more informed skincare choices.
              </p>
            </div>
          </div>

          {/* CONVERSATION MESSAGES */}

          {messages.length > 0 && (
            <div className="assistant-messages" aria-live="polite">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`assistant-message ${
                    message.role === "user"
                      ? "user-message"
                      : "ai-message"
                  }`}
                >
                  <div className="message-avatar">
                    {message.role === "user" ? "You" : "✧"}
                  </div>

                  <div className="message-content">
                    <span className="message-sender">
                      {message.role === "user"
                        ? "You"
                        : "DermaNova AI"}
                    </span>

                    <p>{message.text}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {loading && (
            <div className="assistant-loading" role="status">
              <span className="message-avatar">✧</span>
              <span>Nova is preparing your skincare guidance...</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <label htmlFor="assistant-question">
              What would you like to know?
            </label>

            <textarea
              id="assistant-question"
              value={question}
              onChange={(e) => {
                setQuestion(e.target.value);
                setNotice("");
              }}
              placeholder="For example: Why am I experiencing dark spots, and what skincare steps can I consider?"
              rows={4}
              disabled={loading}
            />

            <div className="consultation-form-footer">
              <span>✧ Detailed skincare guidance</span>

              <button
                type="submit"
                disabled={!question.trim() || loading}
              >
                {loading ? "Thinking..." : "Continue"}
                {!loading && <span> →</span>}
              </button>
            </div>
          </form>

          {notice && (
            <div className="assistant-notice" role="alert">
              {notice}
            </div>
          )}

          {messages.length > 0 && !loading && (
            <button
              type="button"
              className="assistant-new-chat"
              onClick={startNewConsultation}
            >
              Start a new consultation
            </button>
          )}
        </div>

        <p className="assistant-disclaimer">
          DermaNova provides AI-generated skincare information
          for educational purposes. It does not replace professional
          medical advice or diagnosis.
        </p>
      </section>
    </div>
  );
}