import { memo, useState, useEffect, useRef } from "react";
import { MessageCircle, Send } from "lucide-react";

const ChatPanel = memo(function ChatPanel({
  socket,
  loaclName,
  messages,
  roomId,
}) {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  const sendMessage = () => {
    if (input.trim()) {
      socket.emit("chat-message", {
        roomId,
        user: socket.id,
        username: loaclName,
        message: input,
      });
      setInput("");
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="h-full flex flex-col bg-base-300 p-2 shadow-lg">
      <div className="w-full flex items-center gap-2 mb-2">
        <MessageCircle />
        <h2 className="text-base md:text-lg font-bold">Chat</h2>
      </div>
      <div className="flex-1 overflow-y-auto pr-1 pb-1 text-sm space-y-1">
        {messages.map((msg, idx) => (
          <div key={idx}>
            <span className="font-semibold">{msg.username.slice(0, 5)}:</span>{" "}
            {msg.message}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="w-full flex items-center gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          className="flex-1 input"
          placeholder="Type message..."
        />
        <button onClick={sendMessage} className="btn btn-primary">
          <Send size={16} />
        </button>
      </div>
    </div>
  );
});

export default ChatPanel;
