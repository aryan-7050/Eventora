import React from 'react';

const AdminPlaceholder = ({ title, icon }) => (
    <div className="animate-fade-in" style={{ padding: '2rem 0' }}>
        <h2 style={{ marginBottom: '0.5rem' }}>{title}</h2>
        <p style={{ color: 'var(--text-secondary)' }}>This section is under construction.</p>
    </div>
);

export const AdminEvents = () => <AdminPlaceholder title="Approved Events" />;
export const AdminApproveClubs = () => <AdminPlaceholder title="Approve Clubs" />;
export const AdminApproveEvents = () => <AdminPlaceholder title="Approve Events" />;
export const AdminCollegeCode = () => <AdminPlaceholder title="College Code" />;
export const AdminProfile = () => <AdminPlaceholder title="My Profile" />;
