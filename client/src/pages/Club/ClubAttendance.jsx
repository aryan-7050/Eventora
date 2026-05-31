import React, { useState, useEffect } from 'react';
import {
    Calendar, MapPin, Users, QrCode, ClipboardList,
    X, CheckCircle2, AlertCircle, Clock
} from 'lucide-react';
import { getClubEvents, generateAttendanceCode, getAttendanceStatus } from '../../api/events';
import { getAttendees, updateManualAttendance } from '../../api/registrations';
import { toast } from 'react-toastify';
import './ClubAttendance.css';

const ClubAttendance = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCodeModal, setShowCodeModal] = useState(false);
    const [showListModal, setShowListModal] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [attendanceCode, setAttendanceCode] = useState('');
    const [expiryTime, setExpiryTime] = useState(null);
    const [timeLeft, setTimeLeft] = useState(0);
    const [attendees, setAttendees] = useState([]);
    const [fetchingAttendees, setFetchingAttendees] = useState(false);

    useEffect(() => {
        fetchPostedEvents();
    }, []);

    useEffect(() => {
        let timer;
        if (timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
        } else if (timeLeft === 0 && showCodeModal) {
            toast.warning('Attendance code has expired');
            setShowCodeModal(false);
        }
        return () => clearInterval(timer);
    }, [timeLeft, showCodeModal]);

    const fetchPostedEvents = async () => {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            const clubId = user.id || user._id;
            const res = await getClubEvents(clubId);
            // Only show events that are approved and posted
            const postedEvents = res.data.filter(ev => ev.status === 'approved' && ev.isPosted);
            setEvents(postedEvents);
        } catch (err) {
            toast.error('Failed to fetch events');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenAttendance = async (event) => {
        try {
            setSelectedEvent(event);

            // First, check if there's already an active code for this event
            const statusRes = await getAttendanceStatus(event._id);

            if (statusRes.data.active) {
                setAttendanceCode(statusRes.data.code);
                const expiry = new Date(statusRes.data.expires);
                setExpiryTime(expiry);
                const seconds = Math.floor((expiry - new Date()) / 1000);
                setTimeLeft(seconds > 0 ? seconds : 0);
                setShowCodeModal(true);
            } else {
                // No active code, generate one
                const res = await generateAttendanceCode(event._id);
                setAttendanceCode(res.data.code);
                const expiry = new Date(res.data.expires);
                setExpiryTime(expiry);
                const seconds = Math.floor((expiry - new Date()) / 1000);
                setTimeLeft(seconds > 0 ? seconds : 0);
                setShowCodeModal(true);
                toast.success('Attendance code generated!');
            }
        } catch (err) {
            toast.error('Failed to manage attendance session');
        }
    };

    const handleViewAttendance = async (event) => {
        setSelectedEvent(event);
        setShowListModal(true);
        setFetchingAttendees(true);
        try {
            const res = await getAttendees(event._id);
            setAttendees(res.data);
        } catch (err) {
            toast.error('Failed to fetch attendee list');
        } finally {
            setFetchingAttendees(false);
        }
    };

    const handleManualMark = async (regId) => {
        try {
            await updateManualAttendance(regId, { status: 'present' });
            toast.success('Attendance marked manually');
            // Refresh attendee list
            const res = await getAttendees(selectedEvent._id);
            setAttendees(res.data);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to mark attendance');
        }
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const isAttendanceClosed = (event) => {
        return event.attendanceCode && new Date() > new Date(event.attendanceCodeExpires);
    };

    if (loading) return <div className="loading-spinner">Loading attendance manager...</div>;

    return (
        <>
            <div className="attendance-container animate-fade-in">
                <div className="dashboard-header">
                    <h1 className="dashboard-title">Attendance Management</h1>
                    <p className="dashboard-subtitle">Manage attendance for your ongoing and upcoming events.</p>
                </div>

                {events.length > 0 ? (
                    <div className="attendance-grid">
                        {events.map(event => {
                            const closed = isAttendanceClosed(event);
                            return (
                                <div key={event._id} className="event-card glass-panel">
                                    <div className="event-card-header">
                                        <h3 className="event-title">{event.title}</h3>
                                        {closed && <span className="closed-badge">Closed</span>}
                                    </div>

                                    <div className="event-meta">
                                        <div className="meta-item">
                                            <Calendar size={14} />
                                            <span>{new Date(event.eventDate).toLocaleDateString()}</span>
                                        </div>
                                        <div className="meta-item">
                                            <MapPin size={14} />
                                            <span>{event.venue}</span>
                                        </div>
                                        <div className="meta-item">
                                            <Users size={14} />
                                            <span>{event.category}</span>
                                        </div>
                                    </div>

                                    <div className="event-actions">
                                        <button
                                            className={`btn-open-attendance ${closed ? 'btn-disabled' : ''}`}
                                            onClick={() => handleOpenAttendance(event)}
                                            disabled={closed}
                                        >
                                            {closed ? <CheckCircle2 size={18} /> : <QrCode size={18} />}
                                            {closed ? 'Attendance Completed' : 'Open Attendance'}
                                        </button>
                                        <button
                                            className="btn-view-attendance"
                                            onClick={() => handleViewAttendance(event)}
                                        >
                                            <ClipboardList size={18} /> View Attendance
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="empty-state glass-panel">
                        <AlertCircle size={48} className="muted-icon" />
                        <h3>No posted events found</h3>
                        <p>Only events that have been approved and posted will appear here for attendance management.</p>
                    </div>
                )}
            </div>

            {/* Code Generation Modal */}
            {showCodeModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <button className="modal-close" onClick={() => { setShowCodeModal(false); fetchPostedEvents(); }}>
                            <X size={24} />
                        </button>
                        <div className="generate-modal-content">
                            <h2 className="modal-title">Attendance Code</h2>
                            <p>Share this code with the students present at <strong>{selectedEvent?.title}</strong>.</p>

                            <div className="code-display">
                                {attendanceCode}
                            </div>

                            <div className="timer-display">
                                <Clock size={20} />
                                <span>Valid for: {formatTime(timeLeft)}</span>
                            </div>

                            <p className="hint-text">Students can enter this code in their 'Registered Events' page.</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Attendee List Modal */}
            {showListModal && (
                <div className="modal-overlay">
                    <div className="modal-content" style={{ maxWidth: '700px' }}>
                        <button className="modal-close" onClick={() => { setShowListModal(false); fetchPostedEvents(); }}>
                            <X size={24} />
                        </button>
                        <h2 className="modal-title">Attendance List</h2>
                        <p className="modal-subtitle">{selectedEvent?.title}</p>

                        <div className="attendees-table-container">
                            {fetchingAttendees ? (
                                <div className="loading-small">Fetching attendees...</div>
                            ) : attendees.length > 0 ? (
                                <table className="attendees-table">
                                    <thead>
                                        <tr>
                                            <th>Student Details</th>
                                            <th>Status</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {attendees.map(reg => (
                                            <tr key={reg._id}>
                                                <td>
                                                    <div className="attendee-name">{reg.student.name}</div>
                                                    <div className="attendee-id">{reg.student.universityID}</div>
                                                </td>
                                                <td>
                                                    <span className={`attendance-status-pill status-${reg.attendanceStatus}`}>
                                                        {reg.attendanceStatus.toUpperCase()}
                                                    </span>
                                                </td>
                                                <td>
                                                    {reg.attendanceStatus === 'absent' && (
                                                        <button
                                                            className="btn-mark-present"
                                                            onClick={() => handleManualMark(reg._id)}
                                                        >
                                                            Mark Present
                                                        </button>
                                                    )}
                                                    {reg.attendanceStatus === 'present' && (
                                                        <CheckCircle2 size={20} color="#22c55e" />
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <div className="empty-mini">No approved registrations for this event.</div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ClubAttendance;
