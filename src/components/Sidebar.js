import React, { useState } from "react";
import "./Sidebar.css";

export default function Sidebar({ sessions, onNewChat, setCurrentSession }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={`sidebar ${collapsed ? "collapsed" : "expanded"}`}>
      <button onClick={() => setCollapsed(!collapsed)}>
        {collapsed ? "→" : "←"}
      </button>

      {!collapsed && (
        <>
          <button onClick={onNewChat}>New Chat</button>

          <h3>Sessions</h3>
          {sessions.map((s) => (
            <div
              className="session-item"
              key={s.sessionId}
              onClick={() => setCurrentSession(s.sessionId)}
            >
              {s.title || s.sessionId}
            </div>
          ))}
        </>
      )}
    </div>
  );
}
