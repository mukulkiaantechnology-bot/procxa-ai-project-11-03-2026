import { useState, useRef, useEffect } from "react";
import useApi from "../hooks/useApi"; // Use custom hook
import endpoints from "../api/endPoints";
import "./Sidebar.css"; // Ensure styles are applied

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState([
    { text: "Hello! How can I help you today?", sender: "bot" },
  ]);
  const messagesEndRef = useRef(null);

  const { post } = useApi(); // Destructure post from useApi

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Toggle Chatbot Open/Close
  const toggleChatbot = () => {
    setIsOpen(!isOpen);
  };

  // Send user message to API and handle response
  const sendMessage = async () => {
    if (!userInput.trim()) return;

    // Add user's message to chat
    const newUserMessage = { text: userInput, sender: "user" };
    setMessages((prev) => [...prev, newUserMessage]);

    // Clear input immediately to stop double sends and improve UX
    const currentInput = userInput;
    setUserInput("");

    try {
      // Use authenticated post request
      const response = await post("/procxa/chat", {
        human_message: currentInput,
      });

      console.log("DEBUG: Full API Response object:", response); // Enhanced debugging

      if (response?.status === false) {
        console.error("DEBUG: API reported failure:", response);
        const errorMsg = response.message || "Something went wrong.";
        setMessages((prev) => [...prev, { text: `Error: ${errorMsg}`, sender: "bot" }]);
        return;
      }

      // Robustly extract the bot reply
      let botReply = "I'm here to help! (No specific response)";

      if (response?.response) {
        botReply = response.response;
      } else if (response?.data?.response) {
        botReply = response.data.response;
      } else if (typeof response?.data === 'string') {
        botReply = response.data;
      } else if (typeof response === 'string') {
        botReply = response;
      }

      console.log("DEBUG: Extracted botReply:", botReply);

      setMessages((prev) => [...prev, { text: botReply, sender: "bot" }]);
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) => [
        ...prev,
        { text: "Failed to send the message. Please try again.", sender: "bot" },
      ]);
    }
  };

  return (
    <div className="chatbot-container">
      {/* Chatbot Toggle Button */}
      {!isOpen && (
        <div
          className="chatbot-icon"
          onClick={toggleChatbot}
          title="Open Chatbot"
        >
          <i className="fa-solid fa-comments"></i>
        </div>
      )}

      {/* Chatbox Window */}
      {isOpen && (
        <div className="chatbot-window">
          {/* Header */}
          <div className="chatbot-header">
            <h3>Assistant</h3>
            <button className="close-btn" onClick={toggleChatbot} title="Close">
              <i className="fa-solid fa-times"></i>
            </button>
          </div>

          {/* Chat Messages */}
          <div className="chatbot-messages">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`message ${msg.sender === "user" ? "user-message" : "bot-message"}`}
              >
                {msg.text}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input and Send Button */}
          <div className="chatbot-input">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Type your message..."
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  sendMessage();
                }
              }}
              autoFocus
            />
            <button
              type="button"
              onClick={sendMessage}
              title="Send"
            >
              <i className="fa-solid fa-paper-plane"></i>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;