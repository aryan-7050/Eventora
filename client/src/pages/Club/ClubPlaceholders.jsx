import React from 'react';

const ClubPlaceholder = ({ title }) => (
    <div className="animate-fade-in" style={{ padding: '2rem 0' }}>
        <h2 style={{ marginBottom: '0.5rem', color: 'var(--text-primary)' }}>{title}</h2>
        <p style={{ color: 'var(--text-secondary)' }}>This module is currently being developed for the Club Portal.</p>
    </div>
);

export const ClubCreateEvent = () => <ClubPlaceholder title="Create New Event" />;
export const ClubPostedEvents = () => <ClubPlaceholder title="Events Created/Posted" />;
export const ClubEventStatus = () => <ClubPlaceholder title="Approved/Rejected Events" />;
export const ClubApproveStudents = () => <ClubPlaceholder title="Approve Student Registrations" />;
export const ClubAnnouncements = () => <ClubPlaceholder title="Emergency Announcements" />;
export const ClubBudget = () => <ClubPlaceholder title="Budget Tracker" />;
