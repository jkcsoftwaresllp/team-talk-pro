import { useState } from "react";
import styles from "./AdminDashboard.module.css";
import RecycleBin from "../components/admin/RecycleBin";

// Sidebar
import Sidebar from "../components/Sidebar";

// Admin Features
import UserList from "../components/admin/UserList";
import ChannelStats from "../components/admin/ChannelStats";
import MessageManager from "../components/admin/MessageManager";
import FileManager from "../components/admin/FileManager";

function AdminDashboard() {
  const [section, setSection] = useState("users"); // default section

  return (
    <div className={styles.container}>
      {/* Sidebar on the left */}
      <div className={styles.sidebar}>
        <Sidebar currentSection={section} setCurrentSection={setSection} />
      </div>

      {/* Main dashboard content */}
      <main className={styles.main}>
        <h1 className={styles.title}>Admin Dashboard</h1>

        {section === "users" && (
          <section className={styles.section}>
            <UserList />
          </section>
        )}

        {section === "channels" && (
          <section className={styles.section}>
            <ChannelStats />
          </section>
        )}

        {section === "messages" && (
          <section className={styles.section}>
            <MessageManager />
          </section>
        )}

        {section === "files" && (
          <section className={styles.section}>
            <FileManager />
          </section>
        )}

        {section === "recycle" && (
          <section className={styles.section}>
            <RecycleBin />
          </section>
        )}
      </main>
    </div>
  );
}

export default AdminDashboard;
