import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    MessageSquare,
    Send,
    Users,
    AlertTriangle,
    CheckCircle2,
    XCircle,
    RotateCcw,
    RefreshCw,
    Clock,
    Search,
    ChevronRight,
    ArrowLeft
} from 'lucide-react';
import mainAxios from '../../Instance/mainAxios';

interface UserRecord {
    id: number;
    fname?: string;
    lname?: string;
    email?: string;
    phone?: string;
    role?: string;
    is_active?: boolean;
    is_verified?: boolean;
}

interface FailedSMSLog {
    id: number;
    user_id?: number;
    phone_number: string;
    last_error: string;
    retry_count: number;
    created_at: string;
}

interface SMSBatchDetail {
    id: number;
    message_content: string;
    created_by?: number;
    creator_name: string;
    total_recipients: number;
    status: 'QUEUED' | 'IN_PROGRESS' | 'COMPLETED' | 'COMPLETED_WITH_FAILURES';
    created_at: string;
    counts: {
        total: number;
        processed: number;
        sent: number;
        failed: number;
        pending: number;
    };
    failed_logs: FailedSMSLog[];
}

interface SMSBatchSummary {
    id: number;
    message_content: string;
    created_by?: number;
    creator_name: string;
    total_recipients: number;
    sent_count: number;
    failed_count: number;
    status: 'QUEUED' | 'IN_PROGRESS' | 'COMPLETED' | 'COMPLETED_WITH_FAILURES';
    created_at: string;
}

const SMSBroadcastManager: React.FC = () => {
    // Mode navigation: 'compose' | 'batch_detail' | 'history'
    const [activeTab, setActiveTab] = useState<'compose' | 'history'>('compose');
    const [viewBatchId, setViewBatchId] = useState<number | null>(null);

    // Data States
    const [usersList, setUsersList] = useState<UserRecord[]>([]);
    const [loadingUsers, setLoadingUsers] = useState(false);
    const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);

    // Filtering
    const [searchQuery, setSearchQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState('ALL');
    const [statusFilter, setStatusFilter] = useState('ALL');

    // Composition State
    const [messageText, setMessageText] = useState('');
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

    // Active Batch Detail & Polling
    const [batchDetail, setBatchDetail] = useState<SMSBatchDetail | null>(null);
    const [loadingBatchDetail, setLoadingBatchDetail] = useState(false);
    const [retryingLogIds, setRetryingLogIds] = useState<number[]>([]);
    const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

    // Batch History State
    const [batchesList, setBatchesList] = useState<SMSBatchSummary[]>([]);
    const [loadingBatches, setLoadingBatches] = useState(false);

    // Auto-clear notifications after 4 seconds
    useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => setNotification(null), 4000);
            return () => clearTimeout(timer);
        }
    }, [notification]);

    // Fetch users list on mount
    useEffect(() => {
        fetchUsers();
        fetchBatchesList();
    }, []);

    const fetchUsers = async () => {
        setLoadingUsers(true);
        try {
            const res = await mainAxios.get('/auth/users');
            if (Array.isArray(res.data)) {
                setUsersList(res.data);
            } else if (res.data && Array.isArray(res.data.users)) {
                setUsersList(res.data.users);
            }
        } catch (err: any) {
            console.error("Failed to fetch user list:", err);
        } finally {
            setLoadingUsers(false);
        }
    };

    const fetchBatchesList = async () => {
        setLoadingBatches(true);
        try {
            const res = await mainAxios.get('/admin/notifications/sms-batch');
            if (res.data && Array.isArray(res.data.batches)) {
                setBatchesList(res.data.batches);
            }
        } catch (err: any) {
            console.error("Failed to fetch SMS batch history:", err);
            const msg = err.response?.data?.detail || "Failed to load SMS batch history";
            setNotification({ type: 'error', message: msg });
        } finally {
            setLoadingBatches(false);
        }
    };

    const fetchBatchDetail = async (batchId: number) => {
        setLoadingBatchDetail(true);
        try {
            const res = await mainAxios.get(`/admin/notifications/sms-batch/${batchId}`);
            setBatchDetail(res.data);
            return res.data;
        } catch (err: any) {
            console.error("Failed to fetch batch details:", err);
            const msg = err.response?.data?.detail || `Failed to load details for batch #${batchId}`;
            setNotification({ type: 'error', message: msg });
        } finally {
            setLoadingBatchDetail(false);
        }
    };

    // Polling effect for active batch detail view
    useEffect(() => {
        if (!viewBatchId) {
            if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
            return;
        }

        fetchBatchDetail(viewBatchId);

        pollIntervalRef.current = setInterval(async () => {
            const detail = await fetchBatchDetail(viewBatchId);
            if (detail && (detail.status === 'COMPLETED' || detail.status === 'COMPLETED_WITH_FAILURES')) {
                if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
            }
        }, 3000);

        return () => {
            if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
        };
    }, [viewBatchId]);

    // Filtered Users List
    const filteredUsers = usersList.filter(u => {
        const fullName = `${u.fname || ''} ${u.lname || ''}`.toLowerCase();
        const matchesSearch = fullName.includes(searchQuery.toLowerCase()) ||
            (u.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (u.phone || '').includes(searchQuery);

        const matchesRole = roleFilter === 'ALL' || (u.role || '').toUpperCase() === roleFilter;
        const matchesStatus = statusFilter === 'ALL' ||
            (statusFilter === 'ACTIVE' && u.is_active) ||
            (statusFilter === 'INACTIVE' && !u.is_active);

        return matchesSearch && matchesRole && matchesStatus;
    });

    // Checkbox selections
    const toggleSelectUser = (id: number) => {
        setSelectedUserIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const toggleSelectAllFiltered = () => {
        const filteredIds = filteredUsers.map(u => u.id);
        const allSelected = filteredIds.every(id => selectedUserIds.includes(id));
        if (allSelected) {
            setSelectedUserIds(prev => prev.filter(id => !filteredIds.includes(id)));
        } else {
            setSelectedUserIds(prev => Array.from(new Set([...prev, ...filteredIds])));
        }
    };

    // Selected User Stats
    const selectedUsersObjects = usersList.filter(u => selectedUserIds.includes(u.id));
    const selectedWithPhone = selectedUsersObjects.filter(u => u.phone && u.phone.trim().length >= 8);
    const selectedMissingPhone = selectedUsersObjects.filter(u => !u.phone || u.phone.trim().length < 8);

    // Segment Math
    const charCount = messageText.length;
    const segmentsPerMsg = charCount === 0 ? 1 : Math.ceil(charCount / 160);
    const totalSegments = selectedWithPhone.length * segmentsPerMsg;
    const estimatedCostRwf = totalSegments * 8.5; // ~8.5 RWF per segment on Intouch SMS

    // Handlers
    const handleInitiateBroadcast = () => {
        if (selectedUserIds.length === 0) {
            setNotification({ type: 'error', message: 'Please select at least one recipient user.' });
            return;
        }
        if (!messageText.trim()) {
            setNotification({ type: 'error', message: 'Please compose an SMS message before sending.' });
            return;
        }
        setShowConfirmModal(true);
    };

    const handleConfirmSendBatch = async () => {
        setIsSubmitting(true);
        setShowConfirmModal(false);
        try {
            const res = await mainAxios.post('/admin/notifications/sms-batch', {
                user_ids: selectedUserIds,
                message: messageText.trim()
            });

            const batchId = res.data.batch_id;
            setNotification({ type: 'success', message: 'SMS Batch broadcast dispatched successfully!' });
            setMessageText('');
            setSelectedUserIds([]);
            setActiveTab('history');
            setViewBatchId(batchId);
            await fetchBatchDetail(batchId);
            fetchBatchesList();
        } catch (err: any) {
            const errMsg = err.response?.data?.detail || 'Failed to dispatch SMS batch.';
            setNotification({ type: 'error', message: errMsg });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleRetryLogs = async (logIds: number[]) => {
        if (!viewBatchId || logIds.length === 0) return;
        setRetryingLogIds(prev => [...prev, ...logIds]);
        try {
            await mainAxios.post(`/admin/notifications/sms-batch/${viewBatchId}/retry`, {
                log_ids: logIds
            });
            setNotification({ type: 'success', message: `Retried ${logIds.length} failed recipient(s).` });
            await fetchBatchDetail(viewBatchId);
            fetchBatchesList();
        } catch (err: any) {
            const errMsg = err.response?.data?.detail || 'Retry dispatch failed.';
            setNotification({ type: 'error', message: errMsg });
        } finally {
            setRetryingLogIds(prev => prev.filter(id => !logIds.includes(id)));
        }
    };

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            {/* Header Banner */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <MessageSquare className="text-primary" size={28} />
                        SMS Broadcast Manager
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Select specific user recipients, compose SMS broadcasts, track delivery status, and retry failed dispatches.
                    </p>
                </div>

                {/* Tab Controls */}
                <div className="flex items-center gap-2 bg-gray-100 p-1.5 rounded-xl self-start md:self-auto">
                    <button
                        onClick={() => { setActiveTab('compose'); setViewBatchId(null); }}
                        className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                            activeTab === 'compose' && !viewBatchId
                                ? 'bg-white text-gray-900 shadow-sm'
                                : 'text-gray-600 hover:text-gray-900'
                        }`}
                    >
                        Compose & Send
                    </button>
                    <button
                        onClick={() => { setActiveTab('history'); setViewBatchId(null); fetchBatchesList(); }}
                        className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                            activeTab === 'history' && !viewBatchId
                                ? 'bg-white text-gray-900 shadow-sm'
                                : 'text-gray-600 hover:text-gray-900'
                        }`}
                    >
                        Batch History ({batchesList.length})
                    </button>
                </div>
            </div>

            {/* Floating Notification */}
            <AnimatePresence>
                {notification && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className={`p-4 rounded-xl flex items-center justify-between ${
                            notification.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'
                        }`}
                    >
                        <div className="flex items-center gap-2 font-medium">
                            {notification.type === 'success' ? <CheckCircle2 size={20} /> : <AlertTriangle size={20} />}
                            <span>{notification.message}</span>
                        </div>
                        <button onClick={() => setNotification(null)} className="text-gray-500 hover:text-gray-700">
                            &times;
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* BATCH DETAIL & TRACKER VIEW */}
            {viewBatchId && (
                loadingBatchDetail && !batchDetail ? (
                    <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-200 text-center space-y-3">
                        <RefreshCw className="animate-spin text-primary mx-auto" size={32} />
                        <p className="text-gray-600 font-medium">Loading batch status & delivery records...</p>
                    </div>
                ) : batchDetail ? (
                    <div className="space-y-6">
                    <button
                        onClick={() => setViewBatchId(null)}
                        className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                    >
                        <ArrowLeft size={16} /> Back to Broadcast Manager
                    </button>

                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 space-y-6">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-4">
                            <div>
                                <div className="flex items-center gap-3">
                                    <h2 className="text-xl font-bold text-gray-900">
                                        Batch Broadcast #{batchDetail.id}
                                    </h2>
                                    <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                                        batchDetail.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                                        batchDetail.status === 'COMPLETED_WITH_FAILURES' ? 'bg-amber-100 text-amber-700' :
                                        'bg-blue-100 text-blue-700 animate-pulse'
                                    }`}>
                                        {batchDetail.status}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-500 mt-1">
                                    Created by <span className="font-semibold text-gray-700">{batchDetail.creator_name}</span> on{' '}
                                    {batchDetail.created_at ? new Date(batchDetail.created_at).toLocaleString() : 'N/A'}
                                </p>
                            </div>

                            <button
                                onClick={() => fetchBatchDetail(viewBatchId)}
                                disabled={loadingBatchDetail}
                                className="inline-flex items-center gap-2 px-3.5 py-2 text-sm font-medium bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-all self-start md:self-auto"
                            >
                                <RefreshCw size={16} className={loadingBatchDetail ? 'animate-spin' : ''} />
                                Refresh Status
                            </button>
                        </div>

                        {/* Progress Cards */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                <span className="text-xs text-gray-500 font-medium">Total Recipients</span>
                                <p className="text-2xl font-bold text-gray-900 mt-1">{batchDetail.counts.total}</p>
                            </div>
                            <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                                <span className="text-xs text-green-700 font-medium">Successfully Sent</span>
                                <p className="text-2xl font-bold text-green-800 mt-1">{batchDetail.counts.sent}</p>
                            </div>
                            <div className="bg-red-50 p-4 rounded-xl border border-red-100">
                                <span className="text-xs text-red-700 font-medium">Failed Dispatches</span>
                                <p className="text-2xl font-bold text-red-800 mt-1">{batchDetail.counts.failed}</p>
                            </div>
                            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                                <span className="text-xs text-blue-700 font-medium">Pending Queue</span>
                                <p className="text-2xl font-bold text-blue-800 mt-1">{batchDetail.counts.pending}</p>
                            </div>
                        </div>

                        {/* Message Preview */}
                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Message Content</span>
                            <p className="text-gray-800 text-sm whitespace-pre-wrap">{batchDetail.message_content}</p>
                        </div>

                        {/* Failed Recipients Section & Retry */}
                        {batchDetail.failed_logs.length > 0 && (
                            <div className="space-y-4 pt-4 border-t border-gray-100">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                    <h3 className="text-lg font-bold text-red-800 flex items-center gap-2">
                                        <XCircle size={20} /> Failed Recipients ({batchDetail.failed_logs.length})
                                    </h3>

                                    <button
                                        onClick={() => handleRetryLogs(batchDetail.failed_logs.map(l => l.id))}
                                        disabled={retryingLogIds.length > 0}
                                        className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium text-sm rounded-xl transition-all shadow-sm disabled:opacity-50"
                                    >
                                        <RotateCcw size={16} className={retryingLogIds.length > 0 ? 'animate-spin' : ''} />
                                        Retry All Failed ({batchDetail.failed_logs.length})
                                    </button>
                                </div>

                                <div className="overflow-x-auto border border-gray-200 rounded-xl">
                                    <table className="w-full text-left text-sm text-gray-600">
                                        <thead className="bg-gray-100 text-gray-700 font-semibold border-b border-gray-200">
                                            <tr>
                                                <th className="p-3">Log ID</th>
                                                <th className="p-3">Phone Number</th>
                                                <th className="p-3">Last Error Reason</th>
                                                <th className="p-3">Retries</th>
                                                <th className="p-3 text-right">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {batchDetail.failed_logs.map(log => (
                                                <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                                                    <td className="p-3 font-mono text-xs">#{log.id}</td>
                                                    <td className="p-3 font-medium text-gray-900">{log.phone_number}</td>
                                                    <td className="p-3 text-red-700 font-mono text-xs max-w-md truncate">{log.last_error}</td>
                                                    <td className="p-3"><span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs">{log.retry_count}</span></td>
                                                    <td className="p-3 text-right">
                                                        <button
                                                            onClick={() => handleRetryLogs([log.id])}
                                                            disabled={retryingLogIds.includes(log.id)}
                                                            className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-900 hover:bg-gray-800 text-white text-xs font-medium rounded-lg transition-all disabled:opacity-50"
                                                        >
                                                            <RotateCcw size={12} className={retryingLogIds.includes(log.id) ? 'animate-spin' : ''} />
                                                            Retry
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                ) : null
            )}

            {/* TAB 1: COMPOSE & SELECT RECIPIENTS VIEW */}
            {activeTab === 'compose' && !viewBatchId && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column: Recipient Checkbox List */}
                    <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-200 space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
                            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                <Users size={20} className="text-primary" />
                                Select Recipients ({filteredUsers.length})
                            </h2>

                            <button
                                onClick={toggleSelectAllFiltered}
                                className="text-xs font-semibold text-primary hover:underline self-start sm:self-auto flex items-center gap-1"
                            >
                                {filteredUsers.length > 0 && filteredUsers.every(u => selectedUserIds.includes(u.id)) ? 'Deselect All Filtered' : 'Select All Filtered'}
                            </button>
                        </div>

                        {/* Search & Filters */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                                <input
                                    type="text"
                                    placeholder="Search name, email, phone..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                                />
                            </div>

                            <select
                                value={roleFilter}
                                onChange={(e) => setRoleFilter(e.target.value)}
                                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none text-gray-700 bg-white"
                            >
                                <option value="ALL">All Roles</option>
                                <option value="BUYER">Buyers</option>
                                <option value="VENDOR">Vendors</option>
                                <option value="ADMIN">Admins</option>
                            </select>

                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none text-gray-700 bg-white"
                            >
                                <option value="ALL">All Status</option>
                                <option value="ACTIVE">Active Users</option>
                                <option value="INACTIVE">Inactive Users</option>
                            </select>
                        </div>

                        {/* Selection Stats Bar */}
                        <div className="bg-gray-50 p-3 rounded-xl border border-gray-200 flex flex-wrap items-center justify-between text-xs text-gray-600 gap-2">
                            <span>Selected: <strong className="text-gray-900">{selectedUserIds.length}</strong> recipients</span>
                            <span className="text-green-700">Valid Phone: <strong>{selectedWithPhone.length}</strong></span>
                            {selectedMissingPhone.length > 0 && (
                                <span className="text-amber-700 font-semibold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                                    ⚠️ {selectedMissingPhone.length} Missing Phone Number
                                </span>
                            )}
                        </div>

                        {/* Users Table */}
                        <div className="max-h-[420px] overflow-y-auto border border-gray-200 rounded-xl">
                            {loadingUsers ? (
                                <div className="p-8 text-center text-gray-500">Loading user database...</div>
                            ) : filteredUsers.length === 0 ? (
                                <div className="p-8 text-center text-gray-500">No matching users found.</div>
                            ) : (
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-gray-50 text-gray-700 font-semibold border-b border-gray-200 sticky top-0">
                                        <tr>
                                            <th className="p-3 w-10">#</th>
                                            <th className="p-3">User Name</th>
                                            <th className="p-3">Phone Number</th>
                                            <th className="p-3">Role</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {filteredUsers.map(user => {
                                            const isSelected = selectedUserIds.includes(user.id);
                                            const hasPhone = user.phone && user.phone.trim().length >= 8;
                                            return (
                                                <tr
                                                    key={user.id}
                                                    onClick={() => toggleSelectUser(user.id)}
                                                    className={`cursor-pointer transition-colors ${
                                                        isSelected ? 'bg-blue-50/70' : 'hover:bg-gray-50'
                                                    }`}
                                                >
                                                    <td className="p-3">
                                                        <input
                                                            type="checkbox"
                                                            checked={isSelected}
                                                            onChange={() => { }} // handled by row click
                                                            className="rounded border-gray-300 text-primary focus:ring-primary h-4 w-4"
                                                        />
                                                    </td>
                                                    <td className="p-3">
                                                        <div className="font-semibold text-gray-900">
                                                            {user.fname || user.lname ? `${user.fname || ''} ${user.lname || ''}`.trim() : 'User'}
                                                        </div>
                                                        <div className="text-xs text-gray-500">{user.email}</div>
                                                    </td>
                                                    <td className="p-3">
                                                        {hasPhone ? (
                                                            <span className="font-mono text-gray-800 text-xs">{user.phone}</span>
                                                        ) : (
                                                            <span className="text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded font-medium">No Phone</span>
                                                        )}
                                                    </td>
                                                    <td className="p-3">
                                                        <span className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded font-medium">
                                                            {user.role || 'BUYER'}
                                                        </span>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>

                    {/* Right Column: Message Compose & Segment Calculator */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 space-y-5 flex flex-col justify-between">
                        <div className="space-y-4">
                            <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
                                <Send size={20} className="text-primary" /> Compose Broadcast
                            </h2>

                            <div>
                                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                                    Message Text Content
                                </label>
                                <textarea
                                    rows={7}
                                    placeholder="Type your broadcast SMS message here..."
                                    value={messageText}
                                    onChange={(e) => setMessageText(e.target.value)}
                                    className="w-full p-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-sm text-gray-800 resize-none"
                                />
                            </div>

                            {/* Segment Estimation Cards */}
                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-2 text-xs text-gray-600">
                                <div className="flex justify-between">
                                    <span>Character Count:</span>
                                    <strong className="text-gray-900">{charCount} chars</strong>
                                </div>
                                <div className="flex justify-between">
                                    <span>Segments Per Message:</span>
                                    <strong className="text-gray-900">{segmentsPerMsg} segment(s) (160 GSM)</strong>
                                </div>
                                <div className="flex justify-between border-t border-gray-200 pt-2">
                                    <span>Total Estimated Segments:</span>
                                    <strong className="text-primary font-bold">{totalSegments} segment(s)</strong>
                                </div>
                                <div className="flex justify-between text-gray-700">
                                    <span>Estimated Intouch Cost:</span>
                                    <strong className="text-green-700 font-bold">~{estimatedCostRwf.toLocaleString()} RWF</strong>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handleInitiateBroadcast}
                            disabled={selectedUserIds.length === 0 || !messageText.trim() || isSubmitting}
                            className="w-full py-3.5 px-4 bg-primary hover:bg-primary/90 text-white font-medium rounded-xl transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
                        >
                            <Send size={18} />
                            Send SMS Broadcast ({selectedUserIds.length})
                        </button>
                    </div>
                </div>
            )}

            {/* TAB 2: BATCH HISTORY VIEW */}
            {activeTab === 'history' && !viewBatchId && (
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 space-y-4">
                    <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                            <Clock className="text-primary" size={20} />
                            SMS Broadcast Batch History
                        </h2>

                        <button
                            onClick={fetchBatchesList}
                            disabled={loadingBatches}
                            className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-all"
                        >
                            <RefreshCw size={14} className={loadingBatches ? 'animate-spin' : ''} /> Refresh
                        </button>
                    </div>

                    <div className="overflow-x-auto border border-gray-200 rounded-xl">
                        {loadingBatches ? (
                            <div className="p-8 text-center text-gray-500">Loading batch history...</div>
                        ) : batchesList.length === 0 ? (
                            <div className="p-8 text-center text-gray-500">No broadcast batches recorded yet.</div>
                        ) : (
                            <table className="w-full text-left text-sm text-gray-600">
                                <thead className="bg-gray-100 text-gray-700 font-semibold border-b border-gray-200">
                                    <tr>
                                        <th className="p-3">Batch ID</th>
                                        <th className="p-3">Message Preview</th>
                                        <th className="p-3">Creator</th>
                                        <th className="p-3">Recipients</th>
                                        <th className="p-3">Sent / Failed</th>
                                        <th className="p-3">Status</th>
                                        <th className="p-3">Date</th>
                                        <th className="p-3 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {batchesList.map(b => (
                                        <tr key={b.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="p-3 font-mono font-bold text-gray-900">#{b.id}</td>
                                            <td className="p-3 max-w-xs truncate text-gray-800">{b.message_content}</td>
                                            <td className="p-3 font-medium text-gray-800">{b.creator_name}</td>
                                            <td className="p-3 font-semibold">{b.total_recipients}</td>
                                            <td className="p-3">
                                                <span className="text-green-700 font-medium">{b.sent_count} sent</span> /{' '}
                                                <span className="text-red-700 font-medium">{b.failed_count} failed</span>
                                            </td>
                                            <td className="p-3">
                                                <span className={`px-2.5 py-0.5 text-xs font-bold rounded-full ${
                                                    b.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                                                    b.status === 'COMPLETED_WITH_FAILURES' ? 'bg-amber-100 text-amber-700' :
                                                    'bg-blue-100 text-blue-700'
                                                }`}>
                                                    {b.status}
                                                </span>
                                            </td>
                                            <td className="p-3 text-xs text-gray-500">
                                                {b.created_at ? new Date(b.created_at).toLocaleString() : 'N/A'}
                                            </td>
                                            <td className="p-3 text-right">
                                                <button
                                                    onClick={() => setViewBatchId(b.id)}
                                                    className="inline-flex items-center gap-1 px-3 py-1 bg-primary text-white text-xs font-medium rounded-lg hover:bg-primary/90 transition-all"
                                                >
                                                    View Details <ChevronRight size={14} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            )}

            {/* CONFIRMATION MODAL */}
            {showConfirmModal && (
                <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl space-y-4"
                    >
                        <h3 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
                            <AlertTriangle className="text-amber-500" size={24} />
                            Confirm SMS Broadcast
                        </h3>

                        <div className="space-y-2 text-sm text-gray-700">
                            <div className="flex justify-between py-1 border-b border-gray-100">
                                <span>Total Selected Recipients:</span>
                                <strong>{selectedUserIds.length} users</strong>
                            </div>
                            <div className="flex justify-between py-1 border-b border-gray-100">
                                <span>Recipients with Valid Phone:</span>
                                <strong className="text-green-700">{selectedWithPhone.length} users</strong>
                            </div>
                            {selectedMissingPhone.length > 0 && (
                                <div className="flex justify-between py-1 border-b border-gray-100 text-amber-700">
                                    <span>Skipped (No Phone Number):</span>
                                    <strong>{selectedMissingPhone.length} users</strong>
                                </div>
                            )}
                            <div className="flex justify-between py-1 border-b border-gray-100">
                                <span>Total Segments to Dispatch:</span>
                                <strong className="text-primary font-bold">{totalSegments} segment(s)</strong>
                            </div>
                            <div className="flex justify-between py-1 pt-2 font-semibold text-gray-900">
                                <span>Estimated Total Cost:</span>
                                <strong className="text-green-700 font-bold">~{estimatedCostRwf.toLocaleString()} RWF</strong>
                            </div>
                        </div>

                        <div className="bg-gray-50 p-3 rounded-xl border border-gray-200 text-xs text-gray-600">
                            <strong>Note:</strong> Messages will be dispatched in background batches of 10 with 1s throttling intervals via Intouch SMS.
                        </div>

                        <div className="flex gap-3 pt-2">
                            <button
                                onClick={() => setShowConfirmModal(false)}
                                className="flex-1 py-3 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmSendBatch}
                                disabled={isSubmitting}
                                className="flex-1 py-3 text-sm font-semibold text-white bg-primary hover:bg-primary/90 rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
                            >
                                {isSubmitting ? 'Dispatching...' : 'Confirm & Send'}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default SMSBroadcastManager;
