import React, { useState, useMemo, useEffect } from 'react';
import { Search, Filter, X, SlidersHorizontal, Loader2 } from 'lucide-react';
import EventCard from '../../components/EventCard/EventCard';
import EventDetailsModal from '../../components/EventDetailsModal/EventDetailsModal';
import { browseEvents } from '../../api/events';
import { toast } from 'react-toastify';
import './BrowseEvents.css';

const FILTER_TYPES = ['All', 'Online', 'Offline', 'Hybrid'];
const CATEGORIES = ['All', 'Technical', 'Cultural', 'Workshop', 'Seminar', 'Sports', 'Other'];
const SORT_OPTIONS = [
    { value: 'default', label: 'Default' },
    { value: 'newest', label: 'Newest First' },
    { value: 'popular', label: 'Most Participants' },
];

const BrowseEvents = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [typeFilter, setTypeFilter] = useState('All');
    const [categoryFilter, setCategoryFilter] = useState('All');
    const [sortBy, setSortBy] = useState('default');
    const [showFilters, setShowFilters] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const res = await browseEvents();
            setEvents(res.data);
            setLoading(false);
        } catch (err) {
            toast.error('Failed to load events');
            setLoading(false);
        }
    };

    const filtered = useMemo(() => {
        let list = [...events];

        if (search.trim()) {
            const q = search.toLowerCase();
            list = list.filter(e =>
                e.title.toLowerCase().includes(q) ||
                (e.organizingClub?.name || '').toLowerCase().includes(q) ||
                e.venue.toLowerCase().includes(q)
            );
        }

        if (typeFilter !== 'All') list = list.filter(e => e.mode === typeFilter);
        if (categoryFilter !== 'All') list = list.filter(e => e.category === categoryFilter);

        if (sortBy === 'newest') list = list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        else if (sortBy === 'popular') list = list.sort((a, b) => (b.maxParticipants || 0) - (a.maxParticipants || 0));

        return list;
    }, [events, search, typeFilter, categoryFilter, sortBy]);

    const clearFilters = () => {
        setSearch('');
        setTypeFilter('All');
        setCategoryFilter('All');
        setSortBy('default');
    };

    const hasActiveFilters = search || typeFilter !== 'All' || categoryFilter !== 'All' || sortBy !== 'default';

    if (loading) return (
        <div className="browse-loading">
            <Loader2 className="animate-spin" size={48} />
            <p>Syncing with event frequency...</p>
        </div>
    );

    return (
        <>
            <div className="browse-container animate-fade-in">
                {/* Header */}
                <div className="browse-header">
                    <div>
                        <h1 className="dashboard-title">Browse Events</h1>
                        <p className="dashboard-subtitle">{filtered.length} event{filtered.length !== 1 ? 's' : ''} found</p>
                    </div>
                    <button
                        className={`filters-toggle-btn ${showFilters ? 'active' : ''}`}
                        onClick={() => setShowFilters(v => !v)}
                    >
                        <SlidersHorizontal size={18} />
                        Filters
                        {hasActiveFilters && <span className="filter-dot"></span>}
                    </button>
                </div>

                {/* Search Bar */}
                <div className="search-row">
                    <div className="search-wrapper">
                        <Search size={18} className="search-icon" />
                        <input
                            type="text"
                            className="search-input"
                            placeholder="Search events, clubs, venues…"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                        {search && (
                            <button className="search-clear" onClick={() => setSearch('')}>
                                <X size={16} />
                            </button>
                        )}
                    </div>
                </div>

                {/* Filter Panel */}
                {showFilters && (
                    <div className="filter-panel glass-panel animate-fade-in">
                        <div className="filter-group">
                            <label>Event Mode</label>
                            <div className="filter-pills">
                                {FILTER_TYPES.map(t => (
                                    <button
                                        key={t}
                                        className={`pill ${typeFilter === t ? 'active' : ''}`}
                                        onClick={() => setTypeFilter(t)}
                                    >{t}</button>
                                ))}
                            </div>
                        </div>

                        <div className="filter-group">
                            <label>Category</label>
                            <div className="filter-pills">
                                {CATEGORIES.map(c => (
                                    <button
                                        key={c}
                                        className={`pill ${categoryFilter === c ? 'active' : ''}`}
                                        onClick={() => setCategoryFilter(c)}
                                    >{c}</button>
                                ))}
                            </div>
                        </div>

                        <div className="filter-group">
                            <label>Sort By</label>
                            <select
                                className="sort-select"
                                value={sortBy}
                                onChange={e => setSortBy(e.target.value)}
                            >
                                {SORT_OPTIONS.map(o => (
                                    <option key={o.value} value={o.value}>{o.label}</option>
                                ))}
                            </select>
                        </div>

                        {hasActiveFilters && (
                            <button className="clear-filters-btn" onClick={clearFilters}>
                                <X size={14} /> Clear All Filters
                            </button>
                        )}
                    </div>
                )}

                {/* Active filter chips */}
                {hasActiveFilters && (
                    <div className="active-chips">
                        {typeFilter !== 'All' && (
                            <span className="chip">{typeFilter} <button onClick={() => setTypeFilter('All')}><X size={12} /></button></span>
                        )}
                        {categoryFilter !== 'All' && (
                            <span className="chip">{categoryFilter} <button onClick={() => setCategoryFilter('All')}><X size={12} /></button></span>
                        )}
                        {sortBy !== 'default' && (
                            <span className="chip">{SORT_OPTIONS.find(o => o.value === sortBy)?.label} <button onClick={() => setSortBy('default')}><X size={12} /></button></span>
                        )}
                        {search && (
                            <span className="chip">"{search}" <button onClick={() => setSearch('')}><X size={12} /></button></span>
                        )}
                    </div>
                )}

                {/* Events Grid */}
                {filtered.length > 0 ? (
                    <div className="events-grid">
                        {filtered.map(event => (
                            <EventCard
                                key={event._id || event.id}
                                event={event}
                                onClick={() => setSelectedEvent(event)}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="empty-state glass-panel">
                        <Filter size={48} className="empty-icon" />
                        <h3>No events found</h3>
                        <p>Try adjusting your filters or search term.</p>
                        <button className="btn btn-primary" onClick={clearFilters}>Clear Filters</button>
                    </div>
                )}
            </div>

            {/* Event Details Modal - RENDERED OUTSIDE animated container */}
            {selectedEvent && (
                <EventDetailsModal
                    event={selectedEvent}
                    onClose={() => setSelectedEvent(null)}
                />
            )}
        </>
    );
};

export default BrowseEvents;
