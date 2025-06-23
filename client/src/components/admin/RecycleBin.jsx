import { useEffect, useState } from "react";
import styles from "./RecycleBin.module.css";
import { getDeletedFiles, restoreFile, permanentlyDeleteFile } from "../../api/adminApi";
import { toast } from "react-toastify";

function RecycleBin() {
  const [deletedFiles, setDeletedFiles] = useState([]);
  const useMockData = false; // Toggle this to false when backend is ready

  useEffect(() => {
    const fetchDeletedFiles = async () => {
      try {
        if (useMockData) {
          const mock = [
            {
              id: 1,
              name: "removed.pdf",
              uploader: "admin1",
              time: "Today 10:10 AM",
              url: "https://example.com/removed.pdf",
            },
            {
              id: 2,
              name: "trashfile.jpg",
              uploader: "spammer",
              time: "Yesterday 3:15 PM",
              url: "https://example.com/trashfile.jpg",
            },
          ];
          setDeletedFiles(mock);
        } else {
          const res = await getDeletedFiles();
          setDeletedFiles(res.data);
        }
      } catch (err) {
        toast.error("Failed to fetch recycle bin files");
      }
    };

    fetchDeletedFiles();
  }, []);

  const handleRestore = async (id) => {
    if (useMockData) {
      toast.success(`Pretend restored file ID ${id}`);
      setDeletedFiles((prev) => prev.filter((f) => f.id !== id));
    } else {
      try {
        await restoreFile(id);
        toast.success("File restored");
        setDeletedFiles((prev) => prev.filter((f) => f.id !== id));
      } catch {
        toast.error("Failed to restore file");
      }
    }
  };

  const handlePermanentDelete = async (id) => {
    if (window.confirm("Permanently delete this file? This can't be undone.")) {
      if (useMockData) {
        toast.warn(`Pretend hard delete for file ID ${id}`);
        setDeletedFiles((prev) => prev.filter((f) => f.id !== id));
      } else {
        try {
          await permanentlyDeleteFile(id);
          toast.success("File permanently deleted");
          setDeletedFiles((prev) => prev.filter((f) => f.id !== id));
        } catch {
          toast.error("Failed to permanently delete file");
        }
      }
    }
  };

  return (
    <div className={styles.container}>
      <h2>Recycle Bin</h2>
      {deletedFiles.length === 0 ? (
        <p>No deleted files found.</p>
      ) : (
        <ul className={styles.fileList}>
          {deletedFiles.map((file) => (
            <li key={file.id} className={styles.fileItem}>
              <div>
                <strong>{file.name}</strong> (by <em>{file.uploader}</em>)
                <div className={styles.meta}>{file.time}</div>
                <a href={file.url} target="_blank" rel="noopener noreferrer">View</a>
              </div>
              <div className={styles.actions}>
                <button onClick={() => handleRestore(file.id)} className={styles.restore}>Restore</button>
                <button onClick={() => handlePermanentDelete(file.id)} className={styles.permanentDelete}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default RecycleBin;
