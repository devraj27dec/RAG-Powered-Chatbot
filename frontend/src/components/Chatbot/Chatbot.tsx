import { useState } from "react";
import { SiChatbot } from "react-icons/si";
import { LuSendHorizontal } from "react-icons/lu";
import { ArrowLeftFromLine, History} from "lucide-react";
import { RiResetLeftFill } from "react-icons/ri";
// import {X} from "lucide-react"
import "./chabot.scss"
import { useChatbot } from "../../hooks/useChatbot";


export default function Chatbot() {
 const [open, setOpen] = useState(false);
 const {messages,
  sendMessage,
  loading, 
  inputMessage, 
  setInputMessage,
  clearChat,
  setShowHistory,
  showHistory
} = useChatbot()

  return (
    <div className="chatbot-popup">
      <button onClick={() => setOpen(!open)} className="chatbot-btn">
        💬
      </button>
      {open && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <SiChatbot className="icons" />
            {/* <X className="icons" onClick={() => setOpen(false)} /> */}
            <div className="header-btn-section">
              {showHistory ? (
                <button
                className="tooltip-btn history-btn" data-tooltip="Back to Chats"
                onClick={() => setShowHistory(!showHistory)}
              >
                <ArrowLeftFromLine />
              </button>
              ) : (
                <button
                className="tooltip-btn history-btn" data-tooltip="Show History"
                onClick={() => setShowHistory(!showHistory)}
              >
                <History />
              </button>
              )}
              <button
                className="tooltip-btn reset-btn" data-tooltip="Reset Session"
                onClick={clearChat}
              >
                <RiResetLeftFill />
              </button>
            </div>
            
          </div>
          <div className="chatbot-messages">
            {showHistory ? (
              <div className="chatbot-history">
                  {messages.length === 0 ? (
                    <div className="no-messages">No chat history available.</div>
                  ) : (
                    messages.map((msg, idx) => (
                      <div
                        key={idx}
                        className={`chatbot-message-box ${
                          msg.sender === "user" ? "user-message" : "bot-message"
                        }`}
                      >
                        <p>{msg.text}</p>
                      </div>
                    ))
                  )}
                </div>
            ) : (
              <>
              {loading ? (
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
              ) : (
                <>
                  {messages.map((msg, index) => (
                    <div
                      key={index}
                      className={`chatbot-message-box ${
                        msg.sender === "user" ? "user-message" : "bot-message"
                      }`}
                    >
                      <p>{msg.text}</p>
                    </div>
                  ))}
                </>
              )}
              </>
            )}

          </div>
          <div className="chatbot-footer">
            <input
              disabled={showHistory}
              type="text"
              className="chatbot-input"
              placeholder="Type a message..." 
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage(inputMessage)}
            />
            
            <button disabled={showHistory} onClick={() => sendMessage(inputMessage)}><LuSendHorizontal /></button>
          </div>
        </div>
      )}
    </div>
  )
}


