import React, { useState, useEffect } from 'react';
import { 
    Calculator, Plus, Trash2, Save, Download, 
    TrendingUp, TrendingDown, DollarSign, PieChart,
    AlertCircle, CheckCircle2, Info
} from 'lucide-react';
import { getClubEvents } from '../../api/events';
import { getEventBudget, updateEventBudget } from '../../api/budget';
import { toast } from 'react-toastify';
import './ClubBudget.css';

const ClubBudget = () => {
    const [clubId, setClubId] = useState(null);
    const [events, setEvents] = useState([]);
    const [selectedEventId, setSelectedEventId] = useState('');
    const [budget, setBudget] = useState(null);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            const id = user.id || user._id;
            setClubId(id);
            fetchEvents(id);
        }
    }, []);

    const fetchEvents = async (id) => {
        try {
            const res = await getClubEvents(id);
            setEvents(res.data.filter(e => e.status === 'approved'));
        } catch (err) {
            toast.error('Failed to load events');
        }
    };

    const handleEventSelect = async (eventId) => {
        setSelectedEventId(eventId);
        if (!eventId) {
            setBudget(null);
            return;
        }

        setLoading(true);
        try {
            const res = await getEventBudget(eventId, clubId);
            setBudget(res.data);
        } catch (err) {
            toast.error('Failed to load budget data');
        } finally {
            setLoading(false);
        }
    };

    const handleAddItem = () => {
        const newItem = {
            description: '',
            category: 'Other',
            estimatedAmount: 0,
            actualAmount: 0,
            status: 'Planned'
        };
        setBudget({ ...budget, items: [...budget.items, newItem] });
    };

    const handleItemChange = (index, field, value) => {
        const updatedItems = [...budget.items];
        updatedItems[index][field] = value;
        setBudget({ ...budget, items: updatedItems });
    };

    const handleRemoveItem = (index) => {
        const updatedItems = budget.items.filter((_, i) => i !== index);
        setBudget({ ...budget, items: updatedItems });
    };

    const handleAddSponsor = () => {
        const newSponsor = { name: '', amount: 0 };
        setBudget({ ...budget, sponsors: [...(budget.sponsors || []), newSponsor] });
    };

    const handleSponsorChange = (index, field, value) => {
        const updatedSponsors = [...budget.sponsors];
        updatedSponsors[index][field] = value;
        setBudget({ ...budget, sponsors: updatedSponsors });
    };

    const handleRemoveSponsor = (index) => {
        const updatedSponsors = budget.sponsors.filter((_, i) => i !== index);
        setBudget({ ...budget, sponsors: updatedSponsors });
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await updateEventBudget(selectedEventId, budget);
            setBudget(res.data.budget);
            toast.success('Budget saved successfully');
        } catch (err) {
            toast.error('Failed to save budget');
        } finally {
            setSaving(false);
        }
    };

    const calculateTotals = () => {
        if (!budget) return { est: 0, act: 0, diff: 0, income: 0 };
        const est = budget.items.reduce((sum, item) => sum + Number(item.estimatedAmount || 0), 0);
        const act = budget.items.reduce((sum, item) => sum + Number(item.actualAmount || 0), 0);
        const income = (budget.sponsors || []).reduce((sum, s) => sum + Number(s.amount || 0), 0);
        return { est, act, diff: est - act, income };
    };

    const totals = calculateTotals();

    return (
        <div className="budget-container animate-fade-in">
            <div className="dashboard-header">
                <div>
                    <h1 className="dashboard-title">Budget Tracker</h1>
                    <p className="dashboard-subtitle">Manage finances, track expenses and monitor sponsorships for your events.</p>
                </div>
                {selectedEventId && (
                    <button className="btn-save-budget" onClick={handleSave} disabled={saving}>
                        <Save size={18} /> {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                )}
            </div>

            <div className="budget-selector glass-panel">
                <label><Calculator size={18} /> Select Event to Manage Budget</label>
                <select value={selectedEventId} onChange={(e) => handleEventSelect(e.target.value)}>
                    <option value="">-- Choose an Event --</option>
                    {events.map(e => (
                        <option key={e._id} value={e._id}>{e.title}</option>
                    ))}
                </select>
            </div>

            {!selectedEventId && (
                <div className="budget-empty-state glass-panel">
                    <PieChart size={64} className="muted-icon" />
                    <h3>No Event Selected</h3>
                    <p>Select an approved event from the dropdown above to start tracking its budget.</p>
                </div>
            )}

            {selectedEventId && budget && (
                <div className="budget-content">
                    <div className="budget-summary-cards">
                        <div className="summary-card est">
                            <TrendingUp size={24} />
                            <div className="sc-info">
                                <span>Total Estimated</span>
                                <h3>₹{totals.est.toLocaleString()}</h3>
                            </div>
                        </div>
                        <div className="summary-card act">
                            <TrendingDown size={24} />
                            <div className="sc-info">
                                <span>Total Actual</span>
                                <h3>₹{totals.act.toLocaleString()}</h3>
                            </div>
                        </div>
                        <div className="summary-card income">
                            <DollarSign size={24} />
                            <div className="sc-info">
                                <span>Sponsorship Income</span>
                                <h3>₹{totals.income.toLocaleString()}</h3>
                            </div>
                        </div>
                        <div className={`summary-card balance ${totals.income - totals.act >= 0 ? 'positive' : 'negative'}`}>
                            <PieChart size={24} />
                            <div className="sc-info">
                                <span>Net Balance</span>
                                <h3>₹{(totals.income - totals.act).toLocaleString()}</h3>
                            </div>
                        </div>
                    </div>

                    <div className="budget-sections-grid">
                        <div className="budget-section glass-panel">
                            <div className="bs-header">
                                <h3><DollarSign size={20} /> Expenses & Items</h3>
                                <button className="btn-add-item" onClick={handleAddItem}><Plus size={16} /> Add Item</button>
                            </div>
                            <div className="budget-table-wrapper">
                                <table className="budget-table">
                                    <thead>
                                        <tr>
                                            <th>Description</th>
                                            <th>Category</th>
                                            <th>Est. (₹)</th>
                                            <th>Act. (₹)</th>
                                            <th>Status</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {budget.items.map((item, idx) => (
                                            <tr key={idx}>
                                                <td>
                                                    <input 
                                                        type="text" 
                                                        value={item.description} 
                                                        onChange={(e) => handleItemChange(idx, 'description', e.target.value)}
                                                        placeholder="Item name"
                                                    />
                                                </td>
                                                <td>
                                                    <select 
                                                        value={item.category} 
                                                        onChange={(e) => handleItemChange(idx, 'category', e.target.value)}
                                                    >
                                                        <option value="Venue">Venue</option>
                                                        <option value="Equipment">Equipment</option>
                                                        <option value="Marketing">Marketing</option>
                                                        <option value="Refreshments">Refreshments</option>
                                                        <option value="Prizes">Prizes</option>
                                                        <option value="Speakers">Speakers</option>
                                                        <option value="Other">Other</option>
                                                    </select>
                                                </td>
                                                <td>
                                                    <input 
                                                        type="number" 
                                                        value={item.estimatedAmount} 
                                                        onChange={(e) => handleItemChange(idx, 'estimatedAmount', e.target.value)}
                                                    />
                                                </td>
                                                <td>
                                                    <input 
                                                        type="number" 
                                                        value={item.actualAmount || 0} 
                                                        onChange={(e) => handleItemChange(idx, 'actualAmount', e.target.value)}
                                                    />
                                                </td>
                                                <td>
                                                    <select 
                                                        value={item.status} 
                                                        onChange={(e) => handleItemChange(idx, 'status', e.target.value)}
                                                        className={`status-select ${item.status.toLowerCase()}`}
                                                    >
                                                        <option value="Planned">Planned</option>
                                                        <option value="Pending">Pending</option>
                                                        <option value="Paid">Paid</option>
                                                    </select>
                                                </td>
                                                <td>
                                                    <button className="btn-remove" onClick={() => handleRemoveItem(idx)}><Trash2 size={16} /></button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {budget.items.length === 0 && <p className="empty-table-text">No items added yet.</p>}
                            </div>
                        </div>

                        <div className="budget-side-panels">
                            <div className="budget-section glass-panel">
                                <div className="bs-header">
                                    <h3><TrendingUp size={20} /> Sponsors</h3>
                                    <button className="btn-add-item" onClick={handleAddSponsor}><Plus size={16} /> Add Sponsor</button>
                                </div>
                                <div className="sponsors-list">
                                    {(budget.sponsors || []).length > 0 ? (
                                        <div className="sponsor-table-header">
                                            <span>Sponsor / Partner Name</span>
                                            <span>Amount (₹)</span>
                                            <span></span>
                                        </div>
                                    ) : null}
                                    {(budget.sponsors || []).map((s, idx) => (
                                        <div key={idx} className="sponsor-record-row animate-slide-right">
                                            <div className="sr-input-group">
                                                <input 
                                                    type="text" 
                                                    value={s.name} 
                                                    onChange={(e) => handleSponsorChange(idx, 'name', e.target.value)}
                                                    placeholder="e.g. Red Bull India"
                                                    className="sr-name-input"
                                                />
                                            </div>
                                            <div className="sr-input-group amount">
                                                <input 
                                                    type="number" 
                                                    value={s.amount} 
                                                    onChange={(e) => handleSponsorChange(idx, 'amount', e.target.value)}
                                                    placeholder="0"
                                                    className="sr-amount-input"
                                                />
                                            </div>
                                            <button 
                                                className="btn-remove-sponsor" 
                                                onClick={() => handleRemoveSponsor(idx)}
                                                title="Remove Sponsor"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    ))}
                                    {(!budget.sponsors || budget.sponsors.length === 0) && (
                                        <div className="empty-sponsors">
                                            <TrendingUp size={32} className="muted-icon" />
                                            <p>No sponsorship records yet.</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="budget-section glass-panel">
                                <div className="bs-header">
                                    <h3><Info size={20} /> Budget Notes</h3>
                                </div>
                                <textarea 
                                    className="budget-notes-area"
                                    value={budget.notes || ''}
                                    onChange={(e) => setBudget({...budget, notes: e.target.value})}
                                    placeholder="Add any financial summaries or notes here..."
                                ></textarea>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ClubBudget;
