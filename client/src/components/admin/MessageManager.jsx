import { useEffect, useState } from "react";
import styles from "./MessageManager.module.css";
// import { getSpamMessages, deleteMessage } from "../../api/adminApi"; // Uncomment later
import { toast } from "react-toastify";

function MessageManager() {
  const [messages, setMessages] = useState([]);
  const useMockData = true;

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        if (useMockData) {
          const mockMessages = [
            { id: 1, sender: "user123", content: "Spam message #1", time: "10:12 AM" },
            { id: 2, sender: "troll_user", content: "Buy followers now!", time: "11:05 AM" },
          ];
          setMessages(mockMessages);
        } else {
          const res = await getSpamMessages();
          setMessages(res.data);
        }
      } catch (err) {
        toast.error("Failed to load messages");
      }
    };

    fetchMessages();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Delete this spam message?")) {
      try {
        if (useMockData) {
          toast.warn(`Pretend delete for message ID ${id}`);
          setMessages((prev) => prev.filter((m) => m.id !== id));
        } else {
          await deleteMessage(id);
          toast.success("Message deleted");
          setMessages((prev) => prev.filter((m) => m.id !== id));
        }
      } catch {
        toast.error("Failed to delete message");
      }
    }
  };

  return (
    <div className={styles.container}>
      <h2>Manage Spam Messages</h2>
      {messages.length === 0 ? (
        <p>No spam messages found.</p>
      ) : (
        <ul className={styles.messageList}>
          {messages.map((msg) => (
            <li key={msg.id} className={styles.messageItem}>
              <div>
                <strong>{msg.sender}</strong> at {msg.time}
                <p>{msg.content}</p>
              </div>
              <button onClick={() => handleDelete(msg.id)} className={styles.deleteBtn}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default MessageManager;
