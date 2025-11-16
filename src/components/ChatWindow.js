import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import ChatInput from "./ChatInput";
import ChatTable from "./ChatTable";
import "./ChatWindow.css";

const apiBase = process.env.REACT_APP_API_BASE;

export default function ChatWindow({ sessionId, apiBase }) {
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

useEffect(() => {
    if (!sessionId) return;
    fetchMessages();
  }, [sessionId]);

useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

const fetchMessages = async () => {
    try {
      const res = await axios.get(`${apiBase}/api/chat/${sessionId}`);
      setMessages(res.data || []);
    } catch (err) {
      console.error("Unable to fetch messages", err);
    }
  };

const sendMessage = async (text) => {
    if (!sessionId) return;

    const userMessage = { sender: "user", text };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const res = await axios.post(`${apiBase}/api/chat/ask`, {
        sessionId,
        text,
      });

      const botMessage = {
        sender: "bot",
        text: res.data?.text || "No reply from bot",
        table: res.data?.table || [],
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error("Message send failed", err);
    }
  };

  const handleFeedback = (index, type) => {
    const newMessages = [...messages];
    newMessages[index].feedback = type;
    setMessages(newMessages);
  };

  if (!sessionId)
    return <div style={{ padding: "20px" }}>Start a new chat</div>;

  return (
    <div className="chat-window">
      <div className="messages-list">
        {messages.map((m, i) => {
          if (!m.text && (!m.table || m.table.length === 0)) return null;

          return (
            <div className={`message ${m.sender}`} key={i}>
              <div>{m.text || "(No text)"}</div>

              {/* 🔥 FIXED: show table for that specific bot message */}
              {m.table && m.table.length > 0 && (
                <ChatTable rows={m.table} />
              )}

              {m.sender === "bot" && (
                <div className="feedback-icons">
                  <span onClick={() => handleFeedback(i, "like")}>👍</span>
                  <span onClick={() => handleFeedback(i, "dislike")}>👎</span>
                  {m.feedback && <span>({m.feedback})</span>}
                </div>
              )}
            </div>
          );
        })}
       <div ref={messagesEndRef} />
      </div>

      <ChatInput onSend={sendMessage} />
    </div>
  );
}
