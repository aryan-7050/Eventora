import React, { useState, useEffect } from 'react';
import {
    Calendar, MapPin, Users, Edit3, XSquare, Bell,
    AlertCircle, Eye, Clock, Send, CheckCircle2
} from 'lucide-react';
import {
    getClubEvents, closeRegistration, notifyParticipants,
    getClubEditedEvents, applyEventEdit
} from '../../api/events';
import EventDetailsModal from '../../components/EventDetailsModal/EventDetailsModal';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import './ManageEvents.css';

const ManageEvents = () => {
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [editedEvents, setEditedEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [clubId, setClubId] = useState(null);
    const [selectedEvent, setSelectedEvent] = useState(null);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user && (user.id || user._id)) {
            setClubId(user.id || user._id);
        } else {
            setLoading(false);
            toast.error('Club info not found. Please log in.');
        }
    }, []);

    useEffect(() => {
        if (clubId) {
            fetchData();
        }
    }, [clubId]);

    const fetchData = async () => {
        try {
            const [eventsRes, editsRes] = await Promise.all([
                getClubEvents(clubId),
                getClubEditedEvents(clubId)
            ]);
            // Only show posted (approved + published) events
            const postedEvents = eventsRes.data.filter(e => e.status === 'approved' && e.isPosted);
            setEvents(postedEvents);
            setEditedEvents(editsRes.data);
        } catch (err) {
            toast.error('Failed to fetch events');
        } finally {
            setLoading(false);
        }
    };

    const handleCloseRegistration = async (eventId) => {
        if (!window.confirm('Are you sure you want to close registration? This will remove the event from the student browse page.')) return;
        try {
            await closeRegistration(eventId);
            toast.success('Registration closed successfully');
            fetchData();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to close registration');
        }
    };

    const handleNotify = async (eventId) => {
        try {
            const res = await notifyParticipants(eventId);
            toast.success(res.data.message);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to notify participants');
        }
    };

    const handleApplyEdit = async (editId) => {
        try {
            await applyEventEdit(editId);
            toast.success('Changes applied to the event successfully!');
            fetchData();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to apply changes');
        }
    };

    // Get pending/approved/rejected edit for a specific event
    const getEditStatus = (eventId) => {
        return editedEvents.find(e => e.originalEventId === eventId);
    };

    if (loading) return <div className="loading-spinner">Loading manage events...</div>;

    return (
        <>
            <div className="manage-events-container animate-fade-in">
                <div className="dashboard-header">
                    <h1 className="dashboard-title">Manage Events</h1>
                    <p className="dashboard-subtitle">Edit, close registrations, and notify participants for your posted events.</p>
                </div>

                {events.length > 0 ? (
                    <div className="manage-grid">
                        {events.map(event => {
                            const editInfo = getEditStatus(event._id);
                            return (
                                <div key={event._id} className="manage-card glass-panel">
                                    {event.posterUrl && (
                                        <div className="manage-card-poster">
                                            <img src={event.posterUrl} alt={event.title} />
                                        </div>
                                    )}

                                    <div className="manage-card-body">
                                        <div className="manage-card-top">
                                            <span className="category-tag">{event.category}</span>
                                            {event.registrationClosed && (
                                                <span className="closed-tag">Registration Closed</span>
                                            )}
                                        </div>

                                        <h3 className="manage-card-title">{event.title}</h3>
                                        <p className="manage-card-desc">{event.description.substring(0, 100)}...</p>

                                        <div className="manage-card-meta">
                                            <div className="meta-item">
                                                <Calendar size={14} />
                                                <span>{new Date(event.eventDate).toLocaleDateString()}</span>
                                            </div>
                                            <div className="meta-item">
                                                <Clock size={14} />
                                                <span>{event.startTime} - {event.endTime}</span>
                                            </div>
                                            <div className="meta-item">
                                                <MapPin size={14} />
                                                <span>{event.venue}</span>
                                            </div>
                                            <div className="meta-item">
                                                <Users size={14} />
                                                <span>Max: {event.maxParticipants || 'N/A'}</span>
                                            </div>
                                        </div>

                                        {/* Edit status display */}
                                        {editInfo && (
                                            <div className={`edit-status-box edit-${editInfo.status}`}>
                                                {editInfo.status === 'pending' && (
                                                    <>
                                                        <Clock size={14} />
                                                        <span>Edit proposal pending admin approval</span>
                                                    </>
                                                )}
                                                {editInfo.status === 'approved' && (
                                                    <div className="edit-approved-actions">
                                                        <div className="edit-approved-text">
                                                            <CheckCircle2 size={14} />
                                                            <span>Edit approved! Post changes to update the event.</span>
                                                        </div>
                                                        <button
                                                            className="btn-post-changes"
                                                            onClick={() => handleApplyEdit(editInfo._id)}
                                                        >
                                                            <Send size={14} /> Post Changes
                                                        </button>
                                                    </div>
                                                )}
                                                {editInfo.status === 'rejected' && (
                                                    <>
                                                        <AlertCircle size={14} />
                                                        <span>Edit rejected: {editInfo.rejectionReason || 'No reason'}</span>
                                                    </>
                                                )}
                                            </div>
                                        )}

                                        <div className="manage-card-actions">
                                            <button
                                                className="btn-manage edit"
                                                onClick={() => navigate(`/club/manage-edit/${event._id}`)}
                                                disabled={editInfo && editInfo.status === 'pending'}
                                            >
                                                <Edit3 size={16} /> Edit Event
                                            </button>
                                            <button
                                                className="btn-manage close-reg"
                                                onClick={() => handleCloseRegistration(event._id)}
                                                disabled={event.registrationClosed}
                                            >
                                                <XSquare size={16} />
                                                {event.registrationClosed ? 'Closed' : 'Close Registration'}
                                            </button>
                                            <button
                                                className="btn-manage notify"
                                                onClick={() => handleNotify(event._id)}
                                            >
                                                <Bell size={16} /> Notify Participants
                                            </button>
                                            <button
                                                className="btn-manage details"
                                                onClick={() => setSelectedEvent(event)}
                                            >
                                                <Eye size={16} /> Details
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="empty-state glass-panel">
                        <AlertCircle size={48} className="muted-icon" />
                        <h3>No posted events found</h3>
                        <p>Only events that have been approved and posted will appear here for management.</p>
                    </div>
                )}
            </div>

            {selectedEvent && (
                <EventDetailsModal
                    event={selectedEvent}
                    showRegister={false}
                    onClose={() => setSelectedEvent(null)}
                />
            )}
        </>
    );
};

export default ManageEvents;
