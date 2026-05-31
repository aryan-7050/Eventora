import React, { useState, useEffect } from 'react';
import { Users, Mail, Trash2, IdCard, GraduationCap, Loader2, AlertTriangle } from 'lucide-react';
import { toast } from 'react-toastify';
import { getStudents, removeStudent } from '../../api/admin';
import './AdminUsers.css';

const AdminStudents = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            const res = await getStudents();
            setStudents(res.data);
        } catch (err) {
            toast.error('Failed to fetch registered students');
        } finally {
            setLoading(false);
        }
    };

    const handleRemove = async (studentId, studentName) => {
        if (!window.confirm(`Are you sure you want to remove ${studentName}? This action cannot be undone.`)) {
            return;
        }

        try {
            await removeStudent(studentId);
            toast.success(`${studentName} has been removed from the system`);
            setStudents(students.filter(s => s._id !== studentId));
        } catch (err) {
            toast.error('Failed to remove student');
        }
    };

    if (loading) {
        return (
            <div className="loading-container">
                <Loader2 className="animate-spin" size={40} />
                <p>Retrieving Institutional Student Directory...</p>
            </div>
        );
    }

    return (
        <div className="admin-users-container animate-fade-in">
            <div className="admin-users-header">
                <div>
                    <h2>Institutional Student Directory</h2>
                    <p className="text-secondary">Manage all registered students for {JSON.parse(localStorage.getItem('user'))?.collegeCode || 'the institution'}</p>
                </div>
                <div className="stats-badge glass-panel">
                    <Users size={16} />
                    <span>{students.length} Registered Students</span>
                </div>
            </div>

            {students.length > 0 ? (
                <div className="users-list">
                    {students.map((student) => (
                        <div key={student._id} className="user-horizontal-card glass-panel">
                            <div className="user-main-info">
                                <div className="user-avatar-circle">
                                    {student.name.charAt(0)}
                                </div>
                                <div className="user-details">
                                    <h3>{student.name}</h3>
                                    <div className="user-email">
                                        <Mail size={14} />
                                        <span>{student.email}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="user-meta-grid">
                                <div className="meta-item">
                                    <span className="meta-label">
                                        <IdCard size={12} style={{marginRight: '4px'}} />
                                        Student ID / Roll No
                                    </span>
                                    <span className="meta-value">{student.studentId || "Not Provided"}</span>
                                </div>
                                <div className="meta-item">
                                    <span className="meta-label">
                                        <GraduationCap size={12} style={{marginRight: '4px'}} />
                                        Institutional Code
                                    </span>
                                    <span className="meta-value">{student.collegeCode}</span>
                                </div>
                                <div className="meta-item">
                                    <span className="meta-label">Account Status</span>
                                    <span className="meta-value" style={{color: '#22c55e'}}>✓ Verified</span>
                                </div>
                            </div>

                            <div className="user-actions">
                                <button 
                                    className="btn-remove-user"
                                    onClick={() => handleRemove(student._id, student.name)}
                                    title="Remove Student Account"
                                >
                                    <Trash2 size={16} />
                                    <span>Remove</span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="empty-state">
                    <AlertTriangle size={48} style={{color: 'var(--text-secondary)', marginBottom: '1rem'}} />
                    <p>No students found in the institutional directory.</p>
                </div>
            )}
        </div>
    );
};

export default AdminStudents;
