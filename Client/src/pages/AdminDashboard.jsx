// src/pages/AdminDashboard.jsx

import React from 'react';

const AdminDashboard = () => {
  return (
    <div style={{ padding: '2rem' }}>
      <h2>Admin Dashboard</h2>

      <section>
        <h3>Users</h3>
        <p>List all users with roles and statuses (FR9.1)</p>
        <p>Remove or ban users from channels (FR9.2)</p>
      </section>

      <section>
        <h3>Channels</h3>
        <p>View chat volume per channel (FR9.3)</p>
      </section>

      <section>
        <h3>Messages & Files</h3>
        <p>Delete spam messages/files from dashboard (FR9.4)</p>
      </section>
    </div>
  );
};

export default AdminDashboard;
