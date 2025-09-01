import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { IoMdSend } from "react-icons/io";
import API from "../api";
import { logout } from "../Redux/userSlice";

async function sendChatRequest(payload, dispatch) {
  try {
    const res = await API.post("/api/chat/update", payload);
    return res.data;
  } catch (err) {
    if (err.response?.status === 401) {
      console.error("Error response:", err.response);
      dispatch(logout());
    } else {
      console.error("Error:", err.message);
    }
    return {
      role: "bot",
      content: "Sorry, there was an error. Please try again.",
    };
  }
}

export default function Chat() {
  const user = useSelector((state) => state.user.user);
  const token = useSelector((state) => state.user.token);
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const chatBoxRef = useRef(null);
  const dispatch = useDispatch();

  const [chatSessions, setChatSessions] = useState([]);
  const allMessages = chatSessions.flatMap((session) =>
    (session.messages || []).map((msg) => ({
      ...msg,
      content: msg.query,
    }))
  );

  const [context, setContext] = useState({
    lastUserQuery: "The user hasn't yet asked a question",
    lastBotAnswer: "No answer, as user hasn't asked anything before",
    conversation_history: "",
  });
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
    const fetchChat = async () => {
      try {
        const res = await API.get("/api/chat");
        setChatSessions(res.data);
      } catch (err) {
        console.error("Failed to fetch chat messages:", err);
      }
    };
    fetchChat();
  }, [user, navigate]);

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [allMessages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const content = inputRef.current?.value;
    if (!content) return;
    inputRef.current.value = "";
    const newUserMsg = { role: "user", query: content };
    let updatedSessions = [...chatSessions];
    if (updatedSessions.length === 0) {
      updatedSessions.push({ messages: [newUserMsg] });
    } else {
      updatedSessions[updatedSessions.length - 1].messages.push(newUserMsg);
    }
    setChatSessions(updatedSessions);
    setContext((prev) => ({
      ...prev,
      conversation_history: `${prev.conversation_history}User: ${content}\n`,
    }));
    const { chat } = await sendChatRequest(
      {
        query: content,
        last_user_query: context.lastUserQuery,
        last_bot_answer: context.lastBotAnswer,
      },
      dispatch
    );
    const newBotMsg = chat?.messages?.[1] || {
      role: "bot",
      query: chat?.messages?.[1].query || "No response",
    };
    updatedSessions = [...updatedSessions];
    updatedSessions[updatedSessions.length - 1].messages.push(newBotMsg);
    setChatSessions(updatedSessions);
    setContext((prev) => ({
      ...prev,
      lastUserQuery: newUserMsg.query,
      lastBotAnswer: newBotMsg.query,
      conversation_history: `${prev.conversation_history}Cura: ${newBotMsg.query}\n`,
    }));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSubmit(e);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-[93.2vh] flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300 py-8">
      <div className="w-full max-w-5xl bg-white/90 dark:bg-gray-900/90 rounded-2xl shadow-xl p-6 flex flex-col h-[70vh] text-gray-800 dark:text-gray-100 transition-colors duration-300">
        <div className="text-2xl font-bold text-blue-700 dark:text-blue-300 mb-4 text-center">
          Cura - Your Personal Healthcare Assistant
        </div>

        <div
          ref={chatBoxRef}
          className="flex-1 overflow-y-auto space-y-3 px-2 py-2 mb-4 bg-blue-50 dark:bg-gray-800 rounded-lg"
        >
          {allMessages.length === 0 && (
            <div className="text-gray-400 dark:text-gray-500 text-center mt-8">
              Start the conversation by asking a health question!
            </div>
          )}
          {allMessages.map((chat, idx) => (
            <div
              key={chat._id || idx}
              className={`flex ${
                chat.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`px-4 py-2 rounded-lg max-w-[80%] ${
                  chat.role === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100"
                }`}
              >
                {chat.query}
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="flex gap-2 mt-auto">
          <input
            ref={inputRef}
            type="text"
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center justify-center transition"
          >
            <IoMdSend size={22} />
          </button>
        </form>
      </div>
    </div>
  );
}
