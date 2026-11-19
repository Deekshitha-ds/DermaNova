import { useState } from "react";
import {
  HiOutlineSparkles,
  HiOutlineBeaker,
  HiOutlineShoppingBag,
  HiOutlineTrendingUp,
  HiOutlineHeart,
  HiOutlinePaperAirplane,
  HiOutlineRefresh,
  HiOutlineChatAlt2,
} from "react-icons/hi";

import { sendAssistantMessage } from "../api/assistant";
import "./Assistant.css";

const consultations = [
  {
    id: "skin_analysis",
    title: "Skin Analysis",
    description: "Understand your skin concerns and learn what your skin may need.",
    icon: HiOutlineSparkles,
    label: "Skin",
  },
  {
    id: "ingredient_guide",
    title: "Ingredient Guide",
    description: "Explore skincare ingredients and their common uses.",
    icon: HiOutlineBeaker,
    label: "Ingredients",
  },
  {
    id: "product_consultation",
    title: "Product Consultation",
    description: "Learn how to compare products and choose suitable options.",
    icon: HiOutlineShoppingBag,
    label: "Products",
  },
  {
    id: "progress_insights",
    title: "Progress Insights",
    description: "Reflect on your routine and track changes over time.",
    icon: HiOutlineTrendingUp,
    label: "Progress",
  },
];

const features = [
  {
    icon: HiOutlineHeart,
    title: "Skin Insights",
    description: "Understand common skin concerns.",
  },
  {
    icon: HiOutlineBeaker,
    title: "Skincare Education",
    description: "Learn about ingredients and routines.",
  },
  {
    icon: HiOutlineSparkles,
    title: "Personalized Guidance",
    description: "Get suggestions based on your questions.",
  },
];

export default function Assistant() {
  const [consultationType, setConsultationType] = useState(
    "skin_analysis"
  );
  const [message, setMessage] = useState("");
  const [conversationHistory, setConversationHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const selectedConsultation = consultations.find(
    (item) => item.id === consultationType
  );

  const handleSubmit = async (event) => {
    event.preventDefault();

    const trimmedMessage = message.trim();

    if (!trimmedMessage || loading) return;

    setError("");

    const userMessage = {
      role: "user",
      content: trimmedMessage,
    };

    const updatedHistory = [...conversationHistory, userMessage];

    setConversationHistory(updatedHistory);
    setMessage("");
    setLoading(true);

    try {
      const formattedHistory = conversationHistory.map((item) => ({
        role: item.role === "assistant" ? "model" : "user",
        content: item.content,
      }));

      const response = await sendAssistantMessage({
        message: trimmedMessage,
        consultationType,
        conversationHistory: formattedHistory,
      });

      const assistantReply =
        response?.reply ||
        response?.message ||
        response?.response ||
        "I couldn't generate a response. Please try again.";

      setConversationHistory([
        ...updatedHistory,
        {
          role: "assistant",
          content: assistantReply,
        },
      ]);
    } catch (err) {
      console.error("Assistant request failed:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleNewChat = () => {
    setConversationHistory([]);
    setMessage("");
    setError("");
  };

  const handleTopicChange = (topic) => {
    if (loading) return;

    setConsultationType(topic);
    setError("");
  };

  return (
    <main className="assistant-page">
      <div className="assistant-orb assistant-orb-one" />
      <div className="assistant-orb assistant-orb-two" />
      <div className="assistant-orb assistant-orb-three" />

      <div className="assistant-shell">
        {/* Hero */}
        <section className="assistant-hero">
          <div className="assistant-hero-copy">
            <div className="assistant-brand">
              <span className="assistant-brand-icon">
                <HiOutlineSparkles />
              </span>
              <span>DERMANOVA AI</span>
              <i />
            </div>

            <span className="assistant-eyebrow">
              YOUR PERSONAL SKINCARE COMPANION
            </span>

            <h1 className="assistant-title">
              A little more
              <br />
              <span>care, a lot more glow.</span>
            </h1>

            <p className="assistant-subtitle">
              Have questions about your skin, ingredients, or routine?
              Explore skincare knowledge with your personal AI assistant.
            </p>

            <div className="assistant-hero-tags">
              <span>
                <HiOutlineSparkles /> Skin insights
              </span>
              <span>
                <HiOutlineBeaker /> Ingredient education
              </span>
              <span>
                <HiOutlineHeart /> Everyday care
              </span>
            </div>
          </div>

          <div className="assistant-hero-art" aria-hidden="true">
            <div className="assistant-art-glow" />
            <div className="assistant-art-orbit assistant-orbit-a" />
            <div className="assistant-art-orbit assistant-orbit-b" />

            
            <span className="assistant-art-star star-one">✦</span>
            <span className="assistant-art-star star-two">✧</span>
            <span className="assistant-art-star star-three">✦</span>

           
          </div>
        </section>

        {/* Features */}
        <section className="assistant-features" aria-label="Assistant features">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <article className="assistant-feature" key={feature.title}>
                <div className="assistant-feature-icon">
                  <Icon />
                </div>

                <div>
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </div>
              </article>
            );
          })}
        </section>

        {/* Consultation topics */}
        <section className="assistant-consultation">
          <div className="assistant-section-heading">
            <div>
              <span className="assistant-section-kicker">
                LET'S GET STARTED
              </span>
              <h2>What would you like to explore?</h2>
              <p>
                Choose a topic to guide your conversation.
              </p>
            </div>

            <div className="assistant-heading-decoration">
              <HiOutlineSparkles />
            </div>
          </div>

          <div className="assistant-topic-grid">
            {consultations.map((topic) => {
              const Icon = topic.icon;
              const isSelected = consultationType === topic.id;

              return (
                <button
                  type="button"
                  key={topic.id}
                  className={`assistant-topic-card ${
                    isSelected ? "is-selected" : ""
                  }`}
                  onClick={() => handleTopicChange(topic.id)}
                  aria-pressed={isSelected}
                  disabled={loading}
                >
                  <div className="assistant-topic-top">
                    <span className="assistant-topic-icon">
                      <Icon />
                    </span>

                    {isSelected && (
                      <span className="assistant-selected-mark">
                        <HiOutlineSparkles />
                      </span>
                    )}
                  </div>

                  <span className="assistant-topic-label">
                    {topic.label}
                  </span>

                  <h3>{topic.title}</h3>
                  <p>{topic.description}</p>

                  
                </button>
              );
            })}
          </div>
        </section>

        {/* Chat */}
        <section className="assistant-chat-section" id="assistant-chat">
          <div className="assistant-chat-heading">
            <div>
              <span className="assistant-section-kicker">
                YOUR CONVERSATION
              </span>
              <h2>Let's talk skincare.</h2>
              <p>
                Ask a question and explore reliable skincare information.
              </p>
            </div>

            {conversationHistory.length > 0 && (
              <button
                type="button"
                className="assistant-new-chat"
                onClick={handleNewChat}
                disabled={loading}
              >
                <HiOutlineRefresh />
                New chat
              </button>
            )}
          </div>

          <div className="assistant-chat-card">
            <div className="assistant-chat-topbar">
              <div className="assistant-chat-avatar">
                <HiOutlineSparkles />
              </div>

              <div className="assistant-chat-identity">
                <strong>DermaNova Assistant</strong>
                <span>
                  <i />
                  Ready to help you learn
                </span>
              </div>

              <span className="assistant-chat-topic">
                {selectedConsultation?.label || "Skin"}
              </span>
            </div>

            <div
              className="assistant-messages"
              aria-live="polite"
              aria-label="Conversation messages"
            >
              {conversationHistory.length === 0 ? (
                <div className="assistant-welcome">
                  <div className="assistant-welcome-icon">
                    <HiOutlineChatAlt2 />
                  </div>

                  <h3>Welcome to your skincare space.</h3>

                  <p>
                    I'm here to help you understand skincare, ingredients,
                    and everyday routines. What would you like to know?
                  </p>

                  <div className="assistant-suggestions">
                    {[
                      "How do I build a simple skincare routine?",
                      "What is the purpose of niacinamide?",
                      "How can I understand my skin type?",
                    ].map((suggestion) => (
                      <button
                        type="button"
                        key={suggestion}
                        onClick={() => setMessage(suggestion)}
                        disabled={loading}
                      >
                        {suggestion}
                        <span>↗</span>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                conversationHistory.map((item, index) => (
                  <div
                    key={`${item.role}-${index}`}
                    className={`assistant-message-row ${
                      item.role === "user" ? "user-row" : "bot-row"
                    }`}
                  >
                    {item.role === "assistant" && (
                      <span className="assistant-message-avatar">
                        <HiOutlineSparkles />
                      </span>
                    )}

                    <div
                      className={`assistant-message ${
                        item.role === "user"
                          ? "user-message"
                          : "bot-message"
                      }`}
                    >
                      <span className="assistant-message-author">
                        {item.role === "user" ? "You" : "DermaNova"}
                      </span>

                      <p>{item.content}</p>
                    </div>
                  </div>
                ))
              )}

              {loading && (
                <div className="assistant-message-row bot-row">
                  <span className="assistant-message-avatar">
                    <HiOutlineSparkles />
                  </span>

                  <div className="assistant-message bot-message assistant-typing">
                    <span className="assistant-message-author">
                      DermaNova
                    </span>
                    <div className="assistant-typing-dots">
                      <i />
                      <i />
                      <i />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {error && (
              <div className="assistant-error" role="alert">
                {error}
              </div>
            )}

            <form className="assistant-input-area" onSubmit={handleSubmit}>
              <div className="assistant-input-wrap">
                <textarea
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  placeholder="Ask me anything about skincare..."
                  rows={1}
                  aria-label="Your skincare question"
                  disabled={loading}
                  onKeyDown={(event) => {
                    if (
                      event.key === "Enter" &&
                      !event.shiftKey
                    ) {
                      event.preventDefault();
                      event.currentTarget.form?.requestSubmit();
                    }
                  }}
                />

                <button
                  type="submit"
                  className="assistant-send-button"
                  disabled={loading || !message.trim()}
                  aria-label="Send message"
                >
                  <HiOutlinePaperAirplane />
                </button>
              </div>

              <span className="assistant-input-hint">
                Press Enter to send · Shift + Enter for a new line
              </span>
            </form>
          </div>

          <p className="assistant-disclaimer">
            <HiOutlineHeart />
            DermaNova AI provides general skincare education, not medical
            diagnosis or treatment. For persistent or concerning skin
            problems, consult a qualified healthcare professional.
          </p>
        </section>
      </div>
    </main>
  );
}