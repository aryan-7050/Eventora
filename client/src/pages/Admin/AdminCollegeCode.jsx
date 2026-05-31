import React, { useState, useEffect } from 'react';
import { Key, RefreshCw, Copy, CheckCircle, ShieldCheck, Trash2, Loader2 } from 'lucide-react';
import { getAdminProfile, updateAdminProfile } from '../../api/admin';
import { toast } from 'react-toastify';
import './AdminCollegeCode.css';

const generateCode = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no ambiguous chars
    return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
};

const AdminCollegeCode = () => {
    const [code, setCode] = useState('');
    const [customCode, setCustomCode] = useState('');
    const [copied, setCopied] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchCode();
    }, []);

    const fetchCode = async () => {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            const res = await getAdminProfile(user.id || user._id);
            setCode(res.data.collegeCode || '');
        } catch (err) {
            toast.error('Failed to fetch college code');
        } finally {
            setLoading(false);
        }
    };

    const saveCodeToDb = async (newCode) => {
        setSaving(true);
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            await updateAdminProfile(user.id || user._id, { collegeCode: newCode });
            setCode(newCode);
            toast.success(newCode ? 'College code updated!' : 'College code deleted!');
            setError('');
        } catch (err) {
            toast.error('Failed to update college code');
        } finally {
            setSaving(false);
        }
    };

    const handleGenerate = () => {
        const newCode = generateCode();
        saveCodeToDb(newCode);
    };

    const handleCustomSave = () => {
        const trimmed = customCode.trim().toUpperCase();
        if (trimmed.length !== 6) {
            setError('Code must be exactly 6 characters.');
            return;
        }
        if (!/^[A-Z0-9]+$/.test(trimmed)) {
            setError('Only letters and numbers are allowed.');
            return;
        }
        saveCodeToDb(trimmed);
        setCustomCode('');
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDelete = () => {
        if (!confirmDelete) { setConfirmDelete(true); return; }
        saveCodeToDb('');
        setConfirmDelete(false);
    };

    if (loading) return (
        <div className="loader-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', color: '#64748b' }}>
            <Loader2 className="animate-spin" size={48} />
            <p style={{ marginTop: '1rem' }}>Fetching institutional credentials...</p>
        </div>
    );

    return (
        <div className="cc-container animate-fade-in">
            <div className="dashboard-header">
                <h1 className="dashboard-title">College Code</h1>
                <p className="dashboard-subtitle">Generate or manage a unique 6-character code clubs and students use at registration.</p>
            </div>

            {/* Main Card */}
            <div className="cc-main-card glass-panel">
                <div className="cc-icon-top">
                    {saving ? <Loader2 className="animate-spin" size={40} /> : <Key size={40} />}
                </div>

                {code ? (
                    <>
                        <p className="cc-label">Current Active College Code</p>
                        <div className="cc-code-display">
                            {code.split('').map((char, i) => (
                                <span key={i} className="cc-char">{char}</span>
                            ))}
                        </div>
                        <div className="cc-actions">
                            <button className="btn cc-btn copy" onClick={handleCopy}>
                                {copied ? <><CheckCircle size={17} />Copied!</> : <><Copy size={17} />Copy Code</>}
                            </button>
                            <button className="btn cc-btn regen" onClick={handleGenerate}>
                                <RefreshCw size={17} /> Regenerate
                            </button>
                            <button className={`btn cc-btn del ${confirmDelete ? 'confirm' : ''}`} onClick={handleDelete}>
                                <Trash2 size={17} />
                                {confirmDelete ? 'Confirm Delete' : 'Delete Code'}
                            </button>
                        </div>
                        {confirmDelete && (
                            <p className="cc-warn">⚠ Clubs will no longer be able to register with the old code. Click again to confirm.</p>
                        )}
                    </>
                ) : (
                    <>
                        <p className="cc-label cc-empty">No college code generated yet.</p>
                        <button className="btn btn-admin cc-gen-btn" onClick={handleGenerate}>
                            <Key size={17} /> Generate College Code
                        </button>
                    </>
                )}
            </div>

            {/* Custom Code Panel */}
            <div className="cc-custom-card glass-panel">
                <h3><ShieldCheck size={18} /> Set a Custom Code</h3>
                <p>Manually enter a 6-character alphanumeric code instead of auto-generating one.</p>
                <div className="cc-input-row">
                    <input
                        className="cc-input"
                        type="text"
                        maxLength={6}
                        placeholder="e.g. ABC123"
                        value={customCode}
                        onChange={e => { setCustomCode(e.target.value.toUpperCase()); setError(''); }}
                    />
                    <button className="btn btn-admin" onClick={handleCustomSave}>
                        <ShieldCheck size={18} /> Save Code
                    </button>
                </div>
                {error && <p className="cc-error">{error}</p>}
            </div>

            {/* Info Panel */}
            <div className="cc-info-card glass-panel">
                <h4>How It Works</h4>
                <ul>
                    <li>🔐 Clubs & Students must enter this code during registration to associate with your college.</li>
                    <li>🆔 Students are also required to provide their unique Institutional ID (Roll No/UID).</li>
                    <li>🔄 You can regenerate or change the code at any time.</li>
                    <li>⚠️ Changing the code does not affect already-registered users.</li>
                    <li>📋 Share this code only with authorised institutional representatives.</li>
                </ul>
            </div>
        </div>
    );
};

export default AdminCollegeCode;
