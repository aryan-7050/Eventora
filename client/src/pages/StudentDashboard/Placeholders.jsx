import React from 'react';

const PlaceholderPage = ({ title }) => (
    <div className="animate-fade-in">
        <h2>{title}</h2>
        <p>This page is under construction.</p>
    </div>
);

export const BrowseEvents = () => <PlaceholderPage title="Browse Events" />;
export const RegisteredEvents = () => <PlaceholderPage title="Registered Events" />;
export const StudentProfile = () => <PlaceholderPage title="My Profile" />;
