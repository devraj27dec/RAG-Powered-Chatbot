import { useEffect, useMemo, useState } from "react";
import { API_BASE_URL } from "../config";
import { v4 as uuidv4 } from "uuid";

type Message = {
  sender: "user" | "bot";
  text: string;
};

export const useChatbot = () => {
  const sessionId = useMemo(() => uuidv4(), []);
  const [messages, setMessages] = useState<Message[]>([
     { sender: "bot", text: "How can I help you?" }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(false);
   const [showHistory, setShowHistory] = useState(false);

  const fetchHistory = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/history/${sessionId}`);
      const data = await res.json();
      setMessages(
        data.map((m: any) => ({
          sender: m.user_message ? "user" : "bot",
          text: m.user_message || m.bot_response,
        }))
      );
      setShowHistory(true)
    } catch (error) {
      console.error("Failed to fetch chat history:", error);
    }finally{
        setShowHistory(false)
    }
  };

  // Send a new message
  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    setMessages((prev) => [...prev, { sender: "user", text }]);
    setInputMessage("");
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/chat-handler`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, message: text }),
      });
      const data = await res.json();

      if (data.reply) {
        setMessages((prev) => [...prev, { sender: "bot", text: data.reply }]);
      }
    } catch (error) {
      console.error("Chatbot error:", error);
      setMessages((prev) => [...prev, { sender: "bot", text: "⚠️ Something went wrong" }]);
    } finally {
      setLoading(false);
    }
  };

  // Clear session
  const clearChat = async () => {
    try {
      await fetch(`${API_BASE_URL}/history/${sessionId}`, { method: "DELETE" });
      setMessages([]);
    } catch (error) {
      console.error("Failed to clear chat:", error);
    }
  };

  // Load chat history on mount
  useEffect(() => {
    fetchHistory();
  }, []);

  return { messages, loading, sendMessage, inputMessage, setInputMessage , clearChat , showHistory , setShowHistory};
};
