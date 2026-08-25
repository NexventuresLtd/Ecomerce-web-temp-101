import { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Mail,
  Phone,
  Calendar,
  CheckCircle,
  XCircle,
  Eye,
  RefreshCw,
  // Download,
  MessageSquare,
  ArrowUpDown,
  X
} from 'lucide-react';
import mainAxios from '../../Instance/mainAxios';
import { notifyApi } from '../../app/notify';
import { getAdminErrorMessage } from '../../app/utils/getAdminErrorMessage';
import { resolveImageUrl } from '../../app/utils/resolveImageUrl';


// Define types based on your backend response
interface User {
  id: number;
  fname: string;
  lname: string;
  email: string;
  phone: string;
  profile_pic?: string;
  role: string;
  provider: string;
  is_active: boolean;
  is_verified: boolean;
  is_super_admin: boolean;
  created_at: string;
  updated_at: string;
}

interface UsersResponse {
  users: User[];
  total_users: number;
  pagination: {
    skip: number;
    limit: number;
    returned: number;
  };
}

const UsersManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalUsers, setTotalUsers] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [verificationFilter, setVerificationFilter] = useState<'all' | 'verified' | 'unverified'>('all');
  const [roleFilter, setRoleFilter] = useState<'all' | string>('all');
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortField, setSortField] = useState<keyof User>('created_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [updatingUser, setUpdatingUser] = useState<number | null>(null);

  // Bulk SMS — select multiple users, compose one message, send to all their phones
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [showBulkSmsModal, setShowBulkSmsModal] = useState(false);
  const [bulkSmsMessage, setBulkSmsMessage] = useState('');
  const [sendingBulkSms, setSendingBulkSms] = useState(false);
  const [bulkSmsResult, setBulkSmsResult] = useState<{ sent: string[]; failed: string[] } | null>(null);

  // Individual message — one user, choice of email or SMS
  const [messageTarget, setMessageTarget] = useState<User | null>(null);
  const [messageChannel, setMessageChannel] = useState<'email' | 'sms'>('email');
  const [messageSubject, setMessageSubject] = useState('');
  const [messageBody, setMessageBody] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);
  const [messageResult, setMessageResult] = useState<{ ok: boolean; text: string } | null>(null);

  // Fetch users from backend — search/status/verification/role/sort all run
  // as a database query, not a client-side filter over whatever page happened
  // to be loaded.
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await mainAxios.get<UsersResponse>('/auth/users', {
        params: {
          skip: currentPage * itemsPerPage,
          limit: itemsPerPage,
          search: searchTerm.trim(),
          status_filter: statusFilter,
          verified_filter: verificationFilter,
          role_filter: roleFilter,
          sort_by: sortField,
          sort_dir: sortDirection,
        }
      });

      setUsers(response.data.users);
      setTotalUsers(response.data.total_users);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError(getAdminErrorMessage(err, 'Failed to load users data'));
    } finally {
      setLoading(false);
    }
  };

  // Search/status/verification/role/sort/page all live in the query string —
  // the backend does the filtering. Debounce the free-text search so we
  // don't hit the DB on every keystroke; other filters refetch immediately.
  useEffect(() => {
    const t = setTimeout(() => {
      setCurrentPage(0);
      fetchUsers();
    }, searchTerm ? 350 : 0);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, statusFilter, verificationFilter, roleFilter, sortField, sortDirection, itemsPerPage]);

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  // The backend already returns exactly the filtered/sorted/paginated page.
  const filteredUsers = users;

  // Handle sort
  const handleSort = (field: keyof User) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  // Update user status
  const updateUserStatus = async (userId: number, isActive: boolean) => {
    try {
      setUpdatingUser(userId);
      await mainAxios.put(`/auth/users/${userId}`, {
        is_active: isActive
      });
      
      // Update local state
      setUsers(users.map(user => 
        user.id === userId ? { ...user, is_active: isActive } : user
      ));
    } catch (err) {
      console.error('Error updating user status:', err);
      setError('Failed to update user status');
    } finally {
      setUpdatingUser(null);
    }
  };

  // Update user role
  const updateUserRole = async (userId: number, newRole: string) => {
    try {
      setUpdatingUser(userId);
      await mainAxios.put(`/auth/users/${userId}`, {
        role: newRole
      });
      
      // Update local state
      setUsers(users.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      ));
    } catch (err) {
      console.error('Error updating user role:', err);
      setError('Failed to update user role');
    } finally {
      setUpdatingUser(null);
    }
  };

  // Promote/demote an admin to/from super admin (super admin only, enforced server-side)
  const updateUserSuperAdmin = async (userId: number, makeSuperAdmin: boolean) => {
    try {
      setUpdatingUser(userId);
      await mainAxios.put(`/auth/users/${userId}`, {
        is_super_admin: makeSuperAdmin
      });

      setUsers(users.map(user =>
        user.id === userId ? { ...user, is_super_admin: makeSuperAdmin } : user
      ));
      if (selectedUser?.id === userId) {
        setSelectedUser({ ...selectedUser, is_super_admin: makeSuperAdmin });
      }
    } catch (err) {
      console.error('Error updating super admin status:', err);
      setError(getAdminErrorMessage(err, 'Failed to update super admin status'));
    } finally {
      setUpdatingUser(null);
    }
  };

  const toggleSelected = (userId: number) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      next.has(userId) ? next.delete(userId) : next.add(userId);
      return next;
    });
  };

  const toggleSelectAll = () => {
    setSelectedIds(prev =>
      prev.size === filteredUsers.length ? new Set() : new Set(filteredUsers.map(u => u.id))
    );
  };

  const selectedPhones = users
    .filter(u => selectedIds.has(u.id) && u.phone)
    .map(u => u.phone);

  const handleSendBulkSms = async () => {
    if (!bulkSmsMessage.trim() || selectedPhones.length === 0) return;
    setSendingBulkSms(true);
    setBulkSmsResult(null);
    try {
      const result = await notifyApi.sendBulkSms(selectedPhones, bulkSmsMessage.trim());
      setBulkSmsResult({ sent: result.sent, failed: result.failed });
    } catch (err) {
      console.error('Error sending bulk SMS:', err);
      setError('Failed to send bulk SMS');
    } finally {
      setSendingBulkSms(false);
    }
  };

  const closeBulkSmsModal = () => {
    setShowBulkSmsModal(false);
    setBulkSmsMessage('');
    setBulkSmsResult(null);
  };

  const openMessageModal = (user: User) => {
    setMessageTarget(user);
    setMessageChannel(user.email ? 'email' : 'sms');
    setMessageSubject('');
    setMessageBody('');
    setMessageResult(null);
  };

  const closeMessageModal = () => {
    setMessageTarget(null);
    setMessageSubject('');
    setMessageBody('');
    setMessageResult(null);
  };

  const handleSendIndividualMessage = async () => {
    if (!messageTarget || !messageBody.trim()) return;
    setSendingMessage(true);
    setMessageResult(null);
    try {
      if (messageChannel === 'email') {
        await notifyApi.sendEmail(messageTarget.email, messageSubject.trim() || 'Umukamezi', messageBody.trim(), messageTarget.fname);
      } else {
        await notifyApi.sendSms(messageTarget.phone, messageBody.trim());
      }
      setMessageResult({ ok: true, text: `Sent via ${messageChannel === 'email' ? 'email' : 'SMS'} successfully.` });
    } catch (err) {
      setMessageResult({ ok: false, text: getAdminErrorMessage(err, 'Failed to send message') });
    } finally {
      setSendingMessage(false);
    }
  };

  // Get unique roles for filter
  const uniqueRoles = Array.from(new Set(users.map(user => user.role)));

  // Calculate pagination
  const totalPages = Math.ceil(totalUsers / itemsPerPage);
  const startItem = currentPage * itemsPerPage + 1;
  const endItem = Math.min((currentPage + 1) * itemsPerPage, totalUsers);



  // Get status color
  const getStatusColor = (isActive: boolean) => {
    return isActive ? 'text-green-600 bg-green-50 border-green-200' : 'text-red-600 bg-red-50 border-red-200';
  };

  // Get verification color
  const getVerificationColor = (isVerified: boolean) => {
    return isVerified ? 'text-blue-600 bg-blue-50 border-blue-200' : 'text-orange-600 bg-orange-50 border-orange-200';
  };

  // Get role color
  const getRoleColor = (role: string) => {
    const colorMap: { [key: string]: string } = {
      ADMIN: 'text-purple-600 bg-purple-50 border-purple-200',
      BUYER: 'text-green-600 bg-green-50 border-green-200',
      SELLER: 'text-blue-600 bg-blue-50 border-blue-200',
      MODERATOR: 'text-orange-600 bg-orange-50 border-orange-200'
    };
    return colorMap[role] || 'text-gray-600 bg-gray-50 border-gray-200';
  };

  if (loading && users.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading users data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-full mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Users Management</h1>
              <p className="text-gray-600 mt-1">Manage and monitor all system users</p>
              <p className="text-sm text-gray-500 mt-1">
                Total Users: {totalUsers.toLocaleString()} • Showing {startItem}-{endItem} of {totalUsers}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              {selectedIds.size > 0 && (
                <button
                  onClick={() => setShowBulkSmsModal(true)}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors w-full sm:w-auto"
                >
                  <MessageSquare size={16} />
                  Send SMS to Selected ({selectedIds.size})
                </button>
              )}
   
              <button
                onClick={fetchUsers}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors w-full sm:w-auto"
              >
                <RefreshCw size={16} />
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Users
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  placeholder="Search by name, email, or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            {/* Verification Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Verification
              </label>
              <select
                value={verificationFilter}
                onChange={(e) => setVerificationFilter(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All</option>
                <option value="verified">Verified</option>
                <option value="unverified">Unverified</option>
              </select>
            </div>

            {/* Role Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Role
              </label>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Roles</option>
                {uniqueRoles.map(role => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {/* Table Header */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={filteredUsers.length > 0 && selectedIds.size === filteredUsers.length}
                      onChange={toggleSelectAll}
                      className="rounded border-gray-300 cursor-pointer"
                    />
                  </th>
                  <th
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('fname')}
                  >
                    <div className="flex items-center gap-1">
                      User
                      <ArrowUpDown size={14} />
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th 
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('is_active')}
                  >
                    <div className="flex items-center gap-1">
                      Status
                      <ArrowUpDown size={14} />
                    </div>
                  </th>
                  <th 
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('created_at')}
                  >
                    <div className="flex items-center gap-1">
                      Joined
                      <ArrowUpDown size={14} />
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-4">
                      <input
                        type="checkbox"
                        checked={selectedIds.has(user.id)}
                        onChange={() => toggleSelected(user.id)}
                        className="rounded border-gray-300 cursor-pointer"
                      />
                    </td>
                    {/* User Info */}
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0">
                          {user.profile_pic ? (
                            <img
                              src={resolveImageUrl(user.profile_pic)}
                              alt={`${user.fname} ${user.lname}`}
                              className="h-10 w-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                              <Users className="text-blue-600" size={16} />
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {user.fname} {user.lname}
                          </div>
                          <div className={`text-xs px-2 py-1 rounded-full border ${getVerificationColor(user.is_verified)}`}>
                            {user.is_verified ? 'Verified' : 'Unverified'}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Contact Info */}
                    <td className="px-4 py-4">
                      <div className="text-sm text-gray-900 flex items-center gap-1 mb-1">
                        <Mail size={14} className="text-gray-400" />
                        {user.email}
                      </div>
                      {user.phone && (
                        <div className="text-sm text-gray-500 flex items-center gap-1">
                          <Phone size={14} className="text-gray-400" />
                          {user.phone}
                        </div>
                      )}
                    </td>

                    {/* Role */}
                    <td className="px-4 py-4">
                      <select
                        value={user.role}
                        onChange={(e) => updateUserRole(user.id, e.target.value)}
                        disabled={updatingUser === user.id || !user.email }
                        className={`text-xs px-2 py-1 rounded-full border ${getRoleColor(user.role)} focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer`}
                      >
                        <option value="buyer">BUYER</option>
                        <option value="seller">SELLER</option>
                        <option value="admin">ADMIN</option>
                        <option value="agent">AGENT</option>
                      </select>
                      {updatingUser === user.id && (
                        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600 ml-1 inline-block"></div>
                      )}
                      {user.role === 'admin' && (
                        <button
                          onClick={() => updateUserSuperAdmin(user.id, !user.is_super_admin)}
                          disabled={updatingUser === user.id}
                          className={`block mt-1 text-xs px-2 py-0.5 rounded-full border transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                            user.is_super_admin
                              ? 'text-amber-700 bg-amber-50 border-amber-200 hover:bg-amber-100'
                              : 'text-gray-500 bg-white border-gray-200 hover:bg-gray-50'
                          }`}
                          title={user.is_super_admin ? 'Click to remove super admin' : 'Click to make super admin'}
                        >
                          {user.is_super_admin ? '★ Super Admin' : '+ Make Super Admin'}
                        </button>
                      )}
                    </td>

                    {/* Status */}
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateUserStatus(user.id, !user.is_active)}
                          disabled={updatingUser === user.id}
                          className={`text-xs px-2 py-1 rounded-full border transition-colors ${
                            getStatusColor(user.is_active)
                          } hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                          {user.is_active ? 'Active' : 'Inactive'}
                          {updatingUser === user.id && (
                            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-current ml-1 inline-block"></div>
                          )}
                        </button>
                        {user.is_active ? (
                          <CheckCircle size={16} className="text-green-500" />
                        ) : (
                          <XCircle size={16} className="text-red-500" />
                        )}
                      </div>
                    </td>

                    {/* Join Date */}
                    <td className="px-4 py-4">
                      <div className="text-sm text-gray-900">
                        {new Date(user.created_at).toLocaleDateString()}
                      </div>
                      <div className="text-xs text-gray-500 flex items-center gap-1">
                        <Calendar size={12} />
                        {new Date(user.created_at).toLocaleTimeString()}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedUser(user);
                            setShowUserModal(true);
                          }}
                          className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => openMessageModal(user)}
                          disabled={!user.email && !user.phone}
                          className="p-1 text-gray-400 hover:text-indigo-600 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                          title="Send message"
                        >
                          <MessageSquare size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <Users className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No users found</h3>
              <p className="mt-1 text-sm text-gray-500">
                Try adjusting your search or filter criteria.
              </p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-700">
                  Show
                </span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(0);
                  }}
                  className="border border-gray-300 rounded px-2 py-1 text-sm"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
                <span className="text-sm text-gray-700">
                  per page
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                  disabled={currentPage === 0}
                  className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Previous
                </button>
                
                <span className="text-sm text-gray-700">
                  Page {currentPage + 1} of {totalPages}
                </span>
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                  disabled={currentPage >= totalPages - 1}
                  className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <div className="flex items-center gap-2 text-red-800">
              <XCircle size={16} />
              <span>{error}</span>
              <button
                onClick={() => setError(null)}
                className="ml-auto text-red-600 hover:text-red-800"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* User Detail Modal */}
      {showUserModal && selectedUser && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">User Details</h3>
                <button
                  onClick={() => setShowUserModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  {selectedUser.profile_pic ? (
                    <img
                      src={resolveImageUrl(selectedUser.profile_pic)}
                      alt={`${selectedUser.fname} ${selectedUser.lname}`}
                      className="h-16 w-16 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">
                      <Users className="text-blue-600" size={24} />
                    </div>
                  )}
                  <div>
                    <h4 className="text-lg font-medium text-gray-900">
                      {selectedUser.fname} {selectedUser.lname}
                    </h4>
                    <p className="text-gray-500">{selectedUser.email}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Role:</span>
                    <span className={`ml-2 px-2 py-1 rounded-full border ${getRoleColor(selectedUser.role)}`}>
                      {selectedUser.role}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Status:</span>
                    <span className={`ml-2 px-2 py-1 rounded-full border ${getStatusColor(selectedUser.is_active)}`}>
                      {selectedUser.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Verified:</span>
                    <span className={`ml-2 px-2 py-1 rounded-full border ${getVerificationColor(selectedUser.is_verified)}`}>
                      {selectedUser.is_verified ? 'Yes' : 'No'}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Provider:</span>
                    <span className="ml-2 text-gray-900">{selectedUser.provider}</span>
                  </div>
                </div>

                {selectedUser.role === 'admin' && (
                  <div>
                    <span className="font-medium text-gray-700">Super Admin:</span>
                    <button
                      onClick={() => updateUserSuperAdmin(selectedUser.id, !selectedUser.is_super_admin)}
                      disabled={updatingUser === selectedUser.id}
                      className={`ml-2 px-3 py-1 rounded-full border text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                        selectedUser.is_super_admin
                          ? 'text-amber-700 bg-amber-50 border-amber-200 hover:bg-amber-100'
                          : 'text-gray-600 bg-white border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {updatingUser === selectedUser.id
                        ? 'Updating...'
                        : selectedUser.is_super_admin
                          ? '★ Yes — click to remove'
                          : 'No — click to promote'}
                    </button>
                  </div>
                )}

                {selectedUser.phone && (
                  <div>
                    <span className="font-medium text-gray-700">Phone:</span>
                    <span className="ml-2 text-gray-900">{selectedUser.phone}</span>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Joined:</span>
                    <div className="text-gray-900">
                      {new Date(selectedUser.created_at).toLocaleDateString()}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(selectedUser.created_at).toLocaleTimeString()}
                    </div>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Last Updated:</span>
                    <div className="text-gray-900">
                      {new Date(selectedUser.updated_at).toLocaleDateString()}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(selectedUser.updated_at).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6 pt-4 border-t border-gray-200">
                <button
                  onClick={() => updateUserStatus(selectedUser.id, !selectedUser.is_active)}
                  disabled={updatingUser === selectedUser.id}
                  className={`flex-1 px-4 py-2 rounded-lg border transition-colors ${
                    selectedUser.is_active 
                      ? 'border-red-200 text-red-700 bg-red-50 hover:bg-red-100' 
                      : 'border-green-200 text-green-700 bg-green-50 hover:bg-green-100'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {updatingUser === selectedUser.id ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                      Updating...
                    </div>
                  ) : (
                    selectedUser.is_active ? 'Deactivate User' : 'Activate User'
                  )}
                </button>
                <button
                  onClick={() => setShowUserModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bulk SMS Modal */}
      {showBulkSmsModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-lg w-full">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-indigo-600" />
                  Send SMS to Selected Users
                </h3>
                <p className="text-sm text-gray-600 mt-0.5">
                  {selectedPhones.length} of {selectedIds.size} selected user{selectedIds.size !== 1 ? 's' : ''} have a phone number on file
                </p>
              </div>
              <button onClick={closeBulkSmsModal} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              {!bulkSmsResult ? (
                <>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                  <textarea
                    value={bulkSmsMessage}
                    onChange={(e) => setBulkSmsMessage(e.target.value)}
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                    placeholder="Type the SMS message to send to all selected users..."
                  />
                  <p className="text-xs text-gray-500 mt-1">{bulkSmsMessage.length} characters</p>
                </>
              ) : (
                <div className="text-sm space-y-2">
                  <p className="text-green-700 font-medium">✓ Sent to {bulkSmsResult.sent.length} recipient{bulkSmsResult.sent.length !== 1 ? 's' : ''}</p>
                  {bulkSmsResult.failed.length > 0 && (
                    <p className="text-red-600">✗ Failed for {bulkSmsResult.failed.length}: {bulkSmsResult.failed.join(', ')}</p>
                  )}
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={closeBulkSmsModal}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
              >
                {bulkSmsResult ? 'Close' : 'Cancel'}
              </button>
              {!bulkSmsResult && (
                <button
                  onClick={handleSendBulkSms}
                  disabled={sendingBulkSms || !bulkSmsMessage.trim() || selectedPhones.length === 0}
                  className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  {sendingBulkSms ? 'Sending...' : `Send to ${selectedPhones.length}`}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Individual Message Modal */}
      {messageTarget && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-lg w-full">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-indigo-600" />
                  Message {messageTarget.fname} {messageTarget.lname}
                </h3>
                <p className="text-sm text-gray-600 mt-0.5">Send directly to this user by email or SMS</p>
              </div>
              <button onClick={closeMessageModal} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {!messageResult ? (
                <>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setMessageChannel('email')}
                      disabled={!messageTarget.email}
                      className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg border text-sm font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${messageChannel === 'email' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
                    >
                      <Mail size={16} /> Email
                    </button>
                    <button
                      type="button"
                      onClick={() => setMessageChannel('sms')}
                      disabled={!messageTarget.phone}
                      className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg border text-sm font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${messageChannel === 'sms' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
                    >
                      <Phone size={16} /> SMS
                    </button>
                  </div>

                  <p className="text-xs text-gray-500">
                    Sending to {messageChannel === 'email' ? messageTarget.email : messageTarget.phone}
                  </p>

                  {messageChannel === 'email' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                      <input
                        type="text"
                        value={messageSubject}
                        onChange={(e) => setMessageSubject(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                        placeholder="Message subject"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                    <textarea
                      value={messageBody}
                      onChange={(e) => setMessageBody(e.target.value)}
                      rows={5}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                      placeholder="Type your message..."
                    />
                    <p className="text-xs text-gray-500 mt-1">{messageBody.length} characters</p>
                  </div>
                </>
              ) : (
                <p className={`text-sm font-medium ${messageResult.ok ? 'text-green-700' : 'text-red-600'}`}>
                  {messageResult.ok ? '✓ ' : '✗ '}{messageResult.text}
                </p>
              )}
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={closeMessageModal}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
              >
                {messageResult ? 'Close' : 'Cancel'}
              </button>
              {!messageResult && (
                <button
                  onClick={handleSendIndividualMessage}
                  disabled={sendingMessage || !messageBody.trim()}
                  className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  {sendingMessage ? 'Sending...' : 'Send'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersManagement;