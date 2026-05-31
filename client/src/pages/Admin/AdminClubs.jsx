import React, { useState, useEffect } from 'react';
import { Building2, Mail, Trash2, ShieldCheck, User, Loader2, AlertTriangle, ExternalLink } from 'lucide-react';
import { toast } from 'react-toastify';
import { getApprovedClubs, removeClub } from '../../api/admin';
import './AdminUsers.css';

const AdminClubs = () => {
    const [clubs, setClubs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchClubs();
    }, []);

    const fetchClubs = async () => {
        try {
            const res = await getApprovedClubs();
            setClubs(res.data);
        } catch (err) {
            toast.error('Failed to fetch registered clubs');
        } finally {
            setLoading(false);
        }
    };

    const handleRemove = async (clubId, clubName) => {
        if (!window.confirm(`Are you sure you want to remove ${clubName}? This will permanently delete the club and its associated data. This action cannot be undone.`)) {
            return;
        }

        try {
            await removeClub(clubId);
            toast.success(`${clubName} has been removed from the platform`);
            setClubs(clubs.filter(c => c._id !== clubId));
        } catch (err) {
            toast.error('Failed to remove club');
        }
    };

    if (loading) {
        return (
            <div className="loading-container">
                <Loader2 className="animate-spin" size={40} />
                <p>Synchronizing Institutional Club Directory...</p>
            </div>
        );
    }

    return (
        <div className="admin-users-container animate-fade-in">
            <div className="admin-users-header">
                <div>
                    <h2>Verified Institutional Clubs</h2>
                    <p className="text-secondary">Oversee all approved student organizations for your institution</p>
                </div>
                <div className="stats-badge glass-panel">
                    <Building2 size={16} />
                    <span>{clubs.length} Authorized Clubs</span>
                </div>
            </div>

            {clubs.length > 0 ? (
                <div className="users-list">
                    {clubs.map((club) => (
                        <div key={club._id} className="user-horizontal-card glass-panel">
                            <div className="user-main-info">
                                <div className="user-avatar-circle" style={{background: 'linear-gradient(135deg, #10b981, #059669)'}}>
                                    {club.name.charAt(0)}
                                </div>
                                <div className="user-details">
                                    <h3>{club.name}</h3>
                                    <div className="user-email">
                                        <Mail size={14} />
                                        <span>{club.email}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="user-meta-grid">
                                <div className="meta-item">
                                    <span className="meta-label">
                                        <User size={12} style={{marginRight: '4px'}} />
                                        Lead Coordinator
                                    </span>
                                    <span className="meta-value">{club.coordinatorName || "N/A"}</span>
                                </div>
                                <div className="meta-item">
                                    <span className="meta-label">Club Category</span>
                                    <span className="meta-value">{club.category || "Technical"}</span>
                                </div>
                                <div className="meta-item">
                                    <span className="meta-label">Verification Status</span>
                                    <span className="meta-value" style={{color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px'}}>
                                        <ShieldCheck size={14} /> Approved
                                    </span>
                                </div>
                            </div>

                            <div className="user-actions">
                                <button 
                                    className="btn-remove-user"
                                    onClick={() => handleRemove(club._id, club.name)}
                                    title="Revoke Club Authorization"
                                >
                                    <Trash2 size={16} />
                                    <span>Revoke</span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="empty-state">
                    <AlertTriangle size={48} style={{color: 'var(--text-secondary)', marginBottom: '1rem'}} />
                    <p>No verified clubs found in the institutional directory.</p>
                </div>
            )}
        </div>
    );
};

export default AdminClubs;
