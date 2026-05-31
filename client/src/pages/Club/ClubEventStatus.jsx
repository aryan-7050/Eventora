import React, { useState, useEffect } from 'react';
import {
    Clock, CheckCircle2, XCircle, AlertCircle,
    Edit3, Send, Calendar, MapPin, Eye, Bell
} from 'lucide-react';
import { getClubEvents, postEvent, getClubEditedEvents, applyEventEdit, notifyParticipants } from '../../api/events';
import EventDetailsModal from '../../components/EventDetailsModal/EventDetailsModal';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import './ClubEventStatus.css';

const ClubEventStatus = () => {
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
            toast.error('Club information not found. Please log in.');
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
            setEvents(eventsRes.data);
            setEditedEvents(editsRes.data);
            setLoading(false);
        } catch (err) {
            toast.error('Failed to fetch event status');
            setLoading(false);
        }
    };

    const handlePost = async (id) => {
        try {
            await postEvent(id);
            toast.success('Event published! It is now visible to students.');
            fetchData();
        } catch (err) {
            toast.error('Failed to post event');
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

    const handleNotify = async (eventId) => {
        try {
            const res = await notifyParticipants(eventId);
            toast.success(res.data.message);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to notify participants');
        }
    };

    // Get edit info for a specific event
    const getEditForEvent = (eventId) => {
        return editedEvents.find(e => e.originalEventId === eventId);
    };

    if (loading) return <div className="loading-spinner">Retrieving event status...</div>;

    return (
        <>
            <div className="event-status-container animate-fade-in">
                <div className="dashboard-header">
                    <h1 className="dashboard-title">My Event Proposals</h1>
                    <p className="dashboard-subtitle">Track the approval status of your events and publish approved ones.</p>
                </div>

                <div className="status-grid">
                    {events.length > 0 ? (
                        events.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map(event => {
                            const editInfo = getEditForEvent(event._id);
                            return (
                                <div key={event._id} className={`status-card glass-panel status-${event.status}`}>
                                    <div className="status-card-header">
                                        <span className={`status-pill ${event.status}`}>
                                            {event.status === 'pending' && <Clock size={12} />}
                                            {event.status === 'approved' && <CheckCircle2 size={12} />}
                                            {event.status === 'rejected' && <XCircle size={12} />}
                                            {event.status.toUpperCase()}
                                        </span>
                                        {event.isPosted && <span className="posted-pill">POSTED</span>}
                                        <button className="view-details-btn-small" onClick={() => setSelectedEvent(event)}>
                                            <Eye size={14} /> Details
                                        </button>
                                    </div>

                                    <h3 className="event-title">{event.title}</h3>

                                    <div className="event-mini-meta">
                                        <span><Calendar size={13} /> {new Date(event.eventDate).toLocaleDateString()}</span>
                                        <span><MapPin size={13} /> {event.venue}</span>
                                    </div>

                                    {event.status === 'rejected' && (
                                        <div className="rejection-box">
                                            <div className="rb-header">
                                                <AlertCircle size={14} />
                                                <span>Rejection Reason:</span>
                                            </div>
                                            <p>{event.rejectionReason || 'No reason provided by admin.'}</p>
                                            <button className="btn edit-btn" onClick={() => navigate(`/club/edit-event/${event._id}`)}>
                                                <Edit3 size={16} /> Edit & Repost
                                            </button>
                                        </div>
                                    )}

                                    {event.status === 'approved' && !event.isPosted && (
                                        <div className="post-box">
                                            <p>Your event is approved! Click below to make it visible to all students.</p>
                                            <button className="btn post-btn" onClick={() => handlePost(event._id)}>
                                                <Send size={16} /> Post Event Now
                                            </button>
                                        </div>
                                    )}

                                    {event.status === 'approved' && event.isPosted && (
                                        <div className="live-box">
                                            <Eye size={16} /> <span>Event is live on Student Portal</span>
                                        </div>
                                    )}

                                    {/* Edit proposal status */}
                                    {editInfo && (
                                        <div className={`edit-proposal-box edit-${editInfo.status}`}>
                                            {editInfo.status === 'pending' && (
                                                <div className="edit-proposal-text">
                                                    <Clock size={14} />
                                                    <span>Edit proposal pending admin approval</span>
                                                </div>
                                            )}
                                            {editInfo.status === 'approved' && (
                                                <div className="edit-proposal-approved">
                                                    <div className="edit-proposal-text">
                                                        <CheckCircle2 size={14} />
                                                        <span>Edit approved! Post the changes below.</span>
                                                    </div>
                                                    <div className="edit-proposal-actions">
                                                        <button className="btn post-btn" onClick={() => handleApplyEdit(editInfo._id)}>
                                                            <Send size={14} /> Post Changes
                                                        </button>
                                                        <button className="btn notify-btn" onClick={() => handleNotify(event._id)}>
                                                            <Bell size={14} /> Notify Participants
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                            {editInfo.status === 'rejected' && (
                                                <div className="edit-proposal-text">
                                                    <XCircle size={14} />
                                                    <span>Edit rejected: {editInfo.rejectionReason || 'No reason'}</span>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {event.status === 'pending' && (
                                        <div className="pending-box">
                                            <p>Our administrators are currently reviewing your proposal. You will be notified once a decision is made.</p>
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    ) : (
                        <div className="empty-state glass-panel">
                            <AlertCircle size={48} className="muted-icon" />
                            <h3>No events found</h3>
                            <p>You haven't proposed any events yet. Click 'Create Event' to get started!</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Event Details Modal */}
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

export default ClubEventStatus;
