import { useState } from "react";
import { SiChatbot } from "react-icons/si";
import { LuSendHorizontal } from "react-icons/lu";
import { History} from "lucide-react";
// import {X} from "lucide-react"
import "./chabot.scss"

export default function Chatbot() {
 const [open, setOpen] = useState(false);
 const [showHistory, setShowHistory] = useState(false);
 
 

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
            <button
              className="history-btn"
              onClick={() => setShowHistory(!showHistory)}
            >
              <History />
            </button>
          </div>

          <div className="chatbot-messages">
            <p>How can I help you?</p>
          </div>
          <div className="chatbot-footer">
            <input type="text" className="chatbot-input" placeholder="Type a message..." />
            <button><LuSendHorizontal /></button>
          </div>
        </div>
      )}
    </div>
  )
}


