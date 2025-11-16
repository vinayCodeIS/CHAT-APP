import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import ChatWindow from "../components/ChatWindow";
import ThemeToggle from "../components/ThemeToggle";

import "../App.css";

const apiBase = "http://localhost:5000";

export default function LandingPage() {
  const [sessions, setSessions] = useState([]);
  const [currentSession, setCurrentSession] = useState(null);

  const fetchSessions = async () => {
    try {
      const res = await axios.get(`${apiBase}/api/sessions`);
      setSessions(res.data);
    } catch (err) {
      console.error("Failed to fetch sessions", err);
    }
  };

  const startNewChat = async () => {
    try {
      const res = await axios.post(`${apiBase}/api/sessions/new`);
      setSessions((prev) => [...prev, res.data]);
      setCurrentSession(res.data.sessionId);
    } catch (err) {
      console.error("Failed to start new session", err);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  return (
    <div className="app-container">
      <Sidebar
        sessions={sessions}
        onNewChat={startNewChat}
        setCurrentSession={setCurrentSession}
      />
      <ChatWindow sessionId={currentSession} apiBase={apiBase} />
      <ThemeToggle />
    </div>
  );
}
