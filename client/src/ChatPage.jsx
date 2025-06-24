import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import axios from "axios";

const socket = io("http://localhost:5000", { withCredentials: true });

const ChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState("");
  const [replyTo, setReplyTo] = useState(null);
  const [file, setFile] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (user) {
      socket.emit("setup", user);
    }
  }, [user]);

  useEffect(() => {
    socket.on("message received", (newMsg) => {
      setMessages((prev) => [...prev, newMsg]);
    });

    return () => socket.off("message received");
  }, []);
  

  const handleSend = () => {
    const message = {
      chatId: 1,
      senderId: user?.id,
      content: newMsg,
      replyTo: replyTo?.id || null,
      isForwarded: false,
      originalSenderId: null,
    };
    socket.emit("send_message", message);
    setNewMsg("");
    setReplyTo(null);
  };

  const handleReact = (msgId) => {
    const emoji = prompt("Enter emoji:");
    const updated = messages.map((m) =>
      m.id === msgId ? { ...m, reactions: [...(m.reactions || []), emoji] } : m
    );
    setMessages(updated);
  };

  const handleForward = (msg) => {
    const message = {
      ...msg,
      chatId: 1,
      senderId: user?.id,
      isForwarded: true,
      originalSenderId: msg.senderId,
    };
    socket.emit("send_message", message);
  };

  const handleUpload = async () => {
    const form = new FormData();
    form.append("file", file);
    const res = await axios.post("http://localhost:5000/api/upload", form);
    alert("File uploaded: " + res.data.url);
  };

  return (
    <div>
      <h2>Chat</h2>
      <div style={{ height: 300, overflowY: "auto" }}>
        {messages.map((msg) => (
          <div key={msg.id} style={{ borderBottom: "1px solid #ddd" }}>
            {msg.replyTo && (
              <p style={{ fontStyle: "italic" }}>Replying to #{msg.replyTo}</p>
            )}
            <strong>{msg.senderId}</strong>: {msg.content}
            {msg.reactions && <p>Reactions: {msg.reactions.join(" ")}</p>}
            <button onClick={() => setReplyTo(msg)}>Reply</button>
            <button onClick={() => handleReact(msg.id)}>React</button>
            <button onClick={() => handleForward(msg)}>Forward</button>
          </div>
        ))}
      </div>
      <input
        value={newMsg}
        onChange={(e) => setNewMsg(e.target.value)}
        placeholder="Type a message"
      />
      <button onClick={handleSend}>Send</button>
      <br />
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={handleUpload}>Upload File</button>
    </div>
  );
};

export default ChatPage;
