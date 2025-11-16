import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import ChatInput from "./ChatInput";
import ChatTable from "./ChatTable";
import "./ChatWindow.css";

export default function ChatWindow({ sessionId, apiBase }) {
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  // Fetch messages when session changes
  useEffect(() => {
    if (!sessionId) return;
    fetchMessages();
  }, [sessionId]);

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Fetch full chat history for session
  const fetchMessages = async () => {
    try {
      const res = await axios.get(`${apiBase}/api/chat/${sessionId}`);
      setMessages(res.data || []);
    } catch (err) {
      console.error("Unable to fetch messages", err);
    }
  };

  // Handle message sending
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
        text: res.data?.text || "No reply yet",
        table: res.data?.table || [],
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error("Failed to send message", err);
    }
  };

  // Like / dislike button handler
  const handleFeedback = (index, type) => {
    const updated = [...messages];
    updated[index].feedback = type;
    setMessages(updated);
  };

  if (!sessionId)
    return <div style={{ padding: "20px" }}>Start a new chat</div>;

  return (
    <div className="chat-window">
      <div className="messages-list">
        {messages.map((msg, i) => {
          if (!msg.text && (!msg.table || msg.table.length === 0)) return null;

          return (
            <div className={`message ${msg.sender}`} key={i}>
              {msg.text}

              {/* Table inside bot message */}
              {msg.table && msg.table.length > 0 && (
                <div className="table-wrapper">
                  <table>
                    <thead>
                      <tr>
                        {Object.keys(msg.table[0]).map((h, j) => (
                          <th key={j}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {msg.table.map((row, k) => (
                        <tr key={k}>
                          {Object.values(row).map((v, j) => (
                            <td key={j}>{v}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Feedback icons */}
              {msg.sender === "bot" && (
                <div className="feedback-icons">
                  <span onClick={() => handleFeedback(i, "like")}>👍</span>
                  <span onClick={() => handleFeedback(i, "dislike")}>👎</span>
                  {msg.feedback && <span>({msg.feedback})</span>}
                </div>
              )}
            </div>
          );
        })}

        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="chat-input-container">
        <ChatInput onSend={sendMessage} />
      </div>
    </div>
  );
}
