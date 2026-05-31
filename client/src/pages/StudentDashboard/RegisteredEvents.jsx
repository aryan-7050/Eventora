import React, { useState, useEffect } from 'react';
import { getStudentRegistrations } from '../../api/registrations';
import { markAttendance } from '../../api/events';
import {
    Calendar, Clock, MapPin, Tag, CheckCircle2,
    Clock3, XCircle, QrCode, X
} from 'lucide-react';
import { toast } from 'react-toastify';
import './RegisteredEvents.css';

const RegisteredEvents = () => {
    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCodeModal, setShowCodeModal] = useState(false);
    const [selectedEventId, setSelectedEventId] = useState(null);
    const [attendanceCode, setAttendanceCode] = useState('');
    const [submittingCode, setSubmittingCode] = useState(false);

    useEffect(() => {
        fetchRegistrations();
    }, []);

    const fetchRegistrations = async () => {
        try {
            const student = JSON.parse(localStorage.getItem('user'));
            if (!student) return;
            const res = await getStudentRegistrations(student.id || student._id);
            setRegistrations(res.data);
        } catch (err) {
            toast.error('Failed to load your registrations');
        } finally {
            setLoading(false);
        }
    };

    const handleMarkAttendance = async () => {
        if (!attendanceCode || attendanceCode.length !== 4) {
            return toast.error('Please enter a valid 4-digit code');
        }

        setSubmittingCode(true);
        try {
            const student = JSON.parse(localStorage.getItem('user'));
            await markAttendance(selectedEventId, {
                studentId: student.id || student._id,
                code: attendanceCode
            });
            toast.success('Attendance marked successfully!');
            setShowCodeModal(false);
            setAttendanceCode('');
            fetchRegistrations(); // Refresh status
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to mark attendance');
        } finally {
            setSubmittingCode(false);
        }
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'approved': return { bg: 'rgba(34, 197, 94, 0.1)', color: '#22c55e', icon: <CheckCircle2 size={16} /> };
            case 'rejected': return { bg: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', icon: <XCircle size={16} /> };
            default: return { bg: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', icon: <Clock3 size={16} /> };
        }
    };

    if (loading) return <div className="loading-container">Loading registrations...</div>;

    return (
        <>
            <div className="registered-events-container animate-fade-in">
                <div className="dashboard-header">
                    <h1 className="dashboard-title">My Registered Events</h1>
                    <p className="dashboard-subtitle">Track the status of your event participations.</p>
                </div>

                {registrations.length > 0 ? (
                    <div className="reg-list">
                        {registrations.map((reg) => {
                            const style = getStatusStyle(reg.status);
                            return (
                                <div key={reg._id} className="reg-card glass-panel">
                                    <div className="reg-info">
                                        <div className="reg-header">
                                            <h3 className="reg-title">{reg.event.title}</h3>
                                            <div className="status-badge" style={{ backgroundColor: style.bg, color: style.color }}>
                                                {style.icon} {reg.status.toUpperCase()}
                                            </div>
                                        </div>
                                        <p className="reg-club">by {reg.event.organizingClub.name}</p>

                                        {reg.isPaid && (
                                            <div className="payment-tag">
                                                <Tag size={14} /> Paid Event (Ref: {reg.transactionID})
                                            </div>
                                        )}

                                        {reg.status === 'rejected' && reg.rejectionReason && (
                                            <div className="rejection-note">
                                                <strong>Reason:</strong> {reg.rejectionReason}
                                            </div>
                                        )}

                                        {reg.status === 'approved' && reg.attendanceStatus === 'absent' && (
                                            <button
                                                className="btn-mark-attendance"
                                                onClick={() => {
                                                    setSelectedEventId(reg.event.id);
                                                    setShowCodeModal(true);
                                                }}
                                            >
                                                <QrCode size={16} /> Attendance
                                            </button>
                                        )}

                                        {reg.attendanceStatus === 'present' && (
                                            <div className="present-badge">
                                                <CheckCircle2 size={14} /> Attendance Marked
                                            </div>
                                        )}
                                    </div>
                                    <div className="reg-date">
                                        <p>Registered on {new Date(reg.registeredAt).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="empty-state glass-panel">
                        <Calendar size={48} className="empty-icon" />
                        <h3>No registrations yet</h3>
                        <p>Browse events and register to see them here.</p>
                    </div>
                )}
            </div>

            {/* Attendance Code Modal */}
            {showCodeModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <button className="modal-close" onClick={() => setShowCodeModal(false)}>
                            <X size={24} />
                        </button>
                        <div className="attendance-modal-body">
                            <h2 className="modal-title">Enter Attendance Code</h2>
                            <p className="modal-subtitle">Enter the 4-digit code provided by the club organizers.</p>

                            <input
                                type="text"
                                className="code-input"
                                placeholder="0000"
                                maxLength={4}
                                value={attendanceCode}
                                onChange={(e) => setAttendanceCode(e.target.value.replace(/\D/g, ''))}
                            />

                            <button
                                className="btn-submit-code"
                                onClick={handleMarkAttendance}
                                disabled={submittingCode || attendanceCode.length !== 4}
                            >
                                {submittingCode ? 'Submitting...' : 'Mark Attendance'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default RegisteredEvents;
