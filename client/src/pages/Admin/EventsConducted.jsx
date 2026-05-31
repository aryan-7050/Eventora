import React, { useState, useEffect } from 'react';
import { Trophy, Calendar, MapPin, Users, ExternalLink, Filter } from 'lucide-react';
import { toast } from 'react-toastify';
import { getConductedEvents } from '../../api/admin';
import './EventsConducted.css';

const EventsConducted = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All');

    useEffect(() => {
        fetchConductedEvents();
    }, []);

    const fetchConductedEvents = async () => {
        try {
            const res = await getConductedEvents();
            setEvents(res.data);
            setLoading(false);
        } catch (err) {
            toast.error('Failed to fetch conducted events');
            setLoading(false);
        }
    };

    const categories = ['All', ...new Set(events.map(e => e.category))];
    const filteredEvents = filter === 'All' ? events : events.filter(e => e.category === filter);

    if (loading) return <div className="loading-spinner">Accessing event archives...</div>;

    return (
        <div className="conducted-events-container animate-fade-in">
            <div className="dashboard-header">
                <div>
                    <h1 className="dashboard-title">Events Conducted</h1>
                    <p className="dashboard-subtitle">Official archive of all events successfully posted and live on the platform.</p>
                </div>
                <div className="filter-wrapper glass-panel">
                    <Filter size={16} />
                    <select value={filter} onChange={(e) => setFilter(e.target.value)}>
                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>
            </div>

            <div className="archives-grid">
                {filteredEvents.length > 0 ? (
                    filteredEvents.map(event => (
                        <div key={event._id} className="archive-card glass-panel">
                            <div className="archive-badge">
                                <Trophy size={14} /> LIVE
                            </div>
                            <h3 className="event-title">{event.title}</h3>
                            <p className="event-club">Organized by {event.organizingClub.name}</p>

                            <div className="archive-meta">
                                <span><Calendar size={13} /> {new Date(event.eventDate).toLocaleDateString()}</span>
                                <span><MapPin size={13} /> {event.venue}</span>
                                <span><Users size={13} /> {event.maxParticipants || 'Unlimited'}</span>
                            </div>

                            <div className="archive-footer">
                                <span className="category-pill">{event.category}</span>
                                <button className="view-details-btn">
                                    Details <ExternalLink size={14} />
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="empty-state glass-panel">
                        <Trophy size={48} className="muted-icon" />
                        <h3>Archive is empty</h3>
                        <p>No events have been posted to the platform yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EventsConducted;
