import { useEffect, useState } from "react";
import styles from "./ChannelStats.module.css";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";
// import { getChannelStats } from "../../api/adminApi"; // Uncomment when backend is ready
import { toast } from "react-toastify";

function ChannelStats() {
  const [channels, setChannels] = useState([]);
  const useMockData = true;

  useEffect(() => {
    const fetchStats = async () => {
      try {
        if (useMockData) {
          const mockStats = [
            { name: "General", messages: 120, activeUsers: 10 },
            { name: "Team", messages: 85, activeUsers: 7 },
            { name: "Support", messages: 45, activeUsers: 4 },
          ];
          setChannels(mockStats);
        } else {
          const res = await getChannelStats();
          setChannels(res.data);
        }
      } catch (err) {
        toast.error("Failed to load channel stats");
      }
    };

    fetchStats();
  }, []);

  return (
    <div className={styles.statsContainer}>
      <h2>Channel Message Volume</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={channels}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="messages" fill="#8884d8" name="Messages" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default ChannelStats;
