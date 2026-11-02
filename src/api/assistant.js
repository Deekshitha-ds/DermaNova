
import client from "./client";

export const sendAssistantMessage = async ({
  message,
  consultationType = "general",
  conversationHistory = [],
}) => {
  const response = await client.post("/assistant/chat", {
    message,
    consultation_type: consultationType,
    conversation_history: conversationHistory,
  });

  return response.data;
};
