import { useEffect, useState } from "react";
import styles from "./UserList.module.css";
import { toast } from "react-toastify";

import { getAllUsers, banUser, removeUser } from "../../api/adminApi"; // Uncomment later

function UserList() {
  const [users, setUsers] = useState([]);

  const useMockData = false; // 🔁 Toggle this to false when backend is ready

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        if (useMockData) {
          // ✅ Mock Data
          const mockUsers = [
            { id: 1, username: "admin1", role: "admin", status: "online" },
            { id: 2, username: "user123", role: "member", status: "offline" },
            { id: 3, username: "guest007", role: "member", status: "online" },
          ];
          setUsers(mockUsers);
        } else {
          // 🔁 Real API Call
          const res = await getAllUsers();
          setUsers(res.data);
        }
      } catch (error) {
        toast.error("Failed to fetch users");
      }
    };

    fetchUsers();
  }, []);

  const handleBan = async (id) => {
    if (window.confirm("Are you sure you want to ban this user?")) {
      if (useMockData) {
        toast.warn(`Pretend to ban user ID ${id}`);
      } else {
        try {
          await banUser(id);
          toast.success("User banned");
          setUsers((prev) => prev.filter((u) => u.id !== id)); 
        } catch (err) {
          toast.error("Failed to ban user");
        }
      }
    }
  };

  const handleRemove = async (id) => {
    if (window.confirm("Are you sure you want to remove this user?")) {
      if (useMockData) {
        toast.warn(`Pretend to remove user ID ${id}`);
        setUsers((prev) => prev.filter((u) => u.id !== id));
      } else {
        try {
          await removeUser(id);
          toast.success("User removed");
          setUsers((prev) => prev.filter((u) => u.id !== id)); 
        } catch (err) {
          toast.error("Failed to remove user");
        }
      }
    }
  };

  return (
    <div className={styles.userList}>
      <h2>All Users</h2>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Username</th>
            <th>Role</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.username}</td>
              <td>
                <span className={styles.role}>{u.role}</span>
              </td>
              <td>
                <span
                  className={`${styles.status} ${
                    u.status === "online" ? styles.online : styles.offline
                  }`}
                >
                  {u.status}
                </span>
              </td>
              <td>
                <button className={styles.ban} onClick={() => handleBan(u.id)}>Ban</button>
                <button className={styles.remove} onClick={() => handleRemove(u.id)}>Remove</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UserList;
