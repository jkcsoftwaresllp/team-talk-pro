import { useEffect, useState } from "react";
import styles from "./FileManager.module.css";
import { getSpamFiles, deleteFile } from "../../api/adminApi"; // Uncomment later
import { toast } from "react-toastify";

function FileManager() {
  const [files, setFiles] = useState([]);
  const useMockData = false; // Toggle this to false when backend is ready

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        if (useMockData) {
          const mockFiles = [
            {
              id: 1,
              name: "document1.pdf",
              uploader: "user123",
              time: "Today 10:10 AM",
              url: "https://example.com/document1.pdf",
            },
            {
              id: 2,
              name: "spamfile.jpg",
              uploader: "spammer",
              time: "Today 9:15 AM",
              url: "https://example.com/spamfile.jpg",
            },
          ];
          setFiles(mockFiles);
        } else {
          const res = await getSpamFiles();
          setFiles(res.data);
        }
      } catch {
        toast.error("Failed to load files");
      }
    };

    fetchFiles();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Delete this file?")) {
      try {
        if (useMockData) {
          toast.warn(`Pretend delete for file ID ${id}`);
          setFiles((prev) => prev.filter((f) => f.id !== id));
        } else {
          await deleteFile(id);
          toast.success("File deleted");
          setFiles((prev) => prev.filter((f) => f.id !== id));
        }
      } catch {
        toast.error("Failed to delete file");
      }
    }
  };

  return (
    <div className={styles.container}>
      <h2>Manage Spam Files</h2>
      {files.length === 0 ? (
        <p>No spam files found.</p>
      ) : (
        <ul className={styles.fileList}>
          {files.map((file) => (
            <li key={file.id} className={styles.fileItem}>
              <div>
                <strong>{file.name}</strong> uploaded by <em>{file.uploader}</em>
                <div className={styles.meta}>{file.time}</div>
                <a href={file.url} target="_blank" rel="noopener noreferrer">Open</a> |{" "}
                <a href={file.url} download>Download</a>
              </div>
              <button onClick={() => handleDelete(file.id)} className={styles.deleteBtn}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default FileManager;
