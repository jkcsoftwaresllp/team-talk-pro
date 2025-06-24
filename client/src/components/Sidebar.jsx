import { FaTrashRestore } from "react-icons/fa";
import styles from "./Sidebar.module.css";
import { FaUser, FaChartBar, FaComment, FaFileAlt } from "react-icons/fa";

function Sidebar({ currentSection, setCurrentSection }) {
  const links = [
    { id: "users", label: "Users", icon: <FaUser /> },
    { id: "channels", label: "Channels", icon: <FaChartBar /> },
    { id: "messages", label: "Messages", icon: <FaComment /> },
    { id: "files", label: "Files", icon: <FaFileAlt /> },
    { id: "recycle", label: "Recycle Bin", icon: <FaTrashRestore /> }

  ];

  return (
    <div className={styles.sidebar}>
      <h2 className={styles.logo}>TeamTalk Pro+</h2>
      <ul className={styles.nav}>
        {links.map((link) => (
          <li
            key={link.id}
            className={`${styles.navItem} ${currentSection === link.id ? styles.active : ""}`}
            onClick={() => setCurrentSection(link.id)}
          >
            {link.icon}
            <span>{link.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Sidebar;
