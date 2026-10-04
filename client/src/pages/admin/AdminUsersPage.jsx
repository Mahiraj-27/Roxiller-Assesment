import React, { useState, useEffect, useCallback } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import {
  fetchAdminUsers,
  fetchAdminUserById,
  registerUserByAdmin,
} from '../../services/adminService';
import toast from 'react-hot-toast';
import {
  FiUsers,
  FiSearch,
  FiFilter,
  FiPlus,
  FiEye,
  FiX,
  FiChevronLeft,
  FiChevronRight,
  FiShield,
  FiShoppingBag,
  FiUser,
  FiCheck,
} from 'react-icons/fi';

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Modals state
  const [selectedUser, setSelectedUser] = useState(null);
  const [viewModalLoading, setViewModalLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  // Add User Form State
  const [addFormData, setAddFormData] = useState({
    name: '',
    email: '',
    address: '',
    password: '',
    role: 'user',
  });
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState('');

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchAdminUsers({
        search: search.trim() || undefined,
        role: roleFilter !== 'all' ? roleFilter : undefined,
        sortBy,
        sortOrder,
        page,
        limit: 10,
      });

      const { users: fetchedUsers, totalPages: pages, total } = res.data.data;
      setUsers(fetchedUsers || []);
      setTotalPages(pages || 1);
      setTotalCount(total || 0);
    } catch (err) {
      toast.error('Failed to load user directory: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  }, [search, roleFilter, sortBy, sortOrder, page]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
    setPage(1);
  };

  const handleViewUser = async (userId) => {
    setViewModalLoading(true);
    try {
      const res = await fetchAdminUserById(userId);
      setSelectedUser(res.data.data);
    } catch (err) {
      toast.error('Failed to fetch user details');
    } finally {
      setViewModalLoading(false);
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setAddError('');

    if (addFormData.name.length < 20 || addFormData.name.length > 60) {
      setAddError('Full name must be between 20 and 60 characters.');
      return;
    }

    if (addFormData.address.length > 400) {
      setAddError('Address cannot exceed 400 characters.');
      return;
    }

    const hasUpper = /[A-Z]/.test(addFormData.password);
    const hasSpecial = /[^A-Za-z0-9]/.test(addFormData.password);
    const hasLength = addFormData.password.length >= 8 && addFormData.password.length <= 16;
    if (!hasUpper || !hasSpecial || !hasLength) {
      setAddError('Password must be 8–16 chars with at least 1 uppercase and 1 special char.');
      return;
    }

    setAddLoading(true);
    try {
      await registerUserByAdmin(addFormData);
      toast.success('User account registered successfully');
      setShowAddModal(false);
      setAddFormData({ name: '', email: '', address: '', password: '', role: 'user' });
      loadUsers();
    } catch (err) {
      setAddError(err.response?.data?.message || 'Failed to create user');
    } finally {
      setAddLoading(false);
    }
  };

  const rolePill = (role) => {
    switch (role) {
      case 'admin':
        return <span className="rs-role-pill badge-admin"><FiShield /> Admin</span>;
      case 'store_owner':
        return <span className="rs-role-pill badge-owner"><FiShoppingBag /> Owner</span>;
      default:
        return <span className="rs-role-pill badge-user"><FiUser /> Consumer</span>;
    }
  };

  return (
    <div className="rs-page-wrapper">
      <Navbar />

      <main className="rs-dashboard-main">
        <div className="rs-page-header">
          <div className="rs-page-title-wrap">
            <span className="rs-section-badge">
              <FiUsers /> Governance
            </span>
            <h1 className="rs-page-heading">User Management Directory</h1>
            <p className="rs-page-subheading">
              Manage all system administrators, store merchants, and registered consumers
            </p>
          </div>

          <div className="rs-header-actions">
            <button
              type="button"
              className="rs-btn rs-btn-primary"
              onClick={() => setShowAddModal(true)}
            >
              <FiPlus /> Add New User
            </button>
          </div>
        </div>

        {/* Filter Controls Toolbar */}
        <div className="rs-toolbar-card">
          <div className="rs-search-input-wrap">
            <FiSearch className="rs-search-icon" />
            <input
              type="text"
              className="rs-search-input"
              placeholder="Search by name, email, or address..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>

          <div className="rs-filter-wrap">
            <FiFilter className="rs-filter-icon" />
            <select
              className="rs-select"
              value={roleFilter}
              onChange={(e) => {
                setRoleFilter(e.target.value);
                setPage(1);
              }}
            >
              <option value="all">All Roles</option>
              <option value="admin">System Admin</option>
              <option value="store_owner">Store Owner</option>
              <option value="user">Normal Consumer</option>
            </select>
          </div>
        </div>

        {/* Data Table */}
        <div className="rs-table-container">
          <table className="rs-table">
            <thead>
              <tr>
                <th onClick={() => handleSort('name')} className="sortable">
                  Full Name {sortBy === 'name' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
                </th>
                <th onClick={() => handleSort('email')} className="sortable">
                  Email Address {sortBy === 'email' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
                </th>
                <th onClick={() => handleSort('address')} className="sortable">
                  Physical Address {sortBy === 'address' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
                </th>
                <th onClick={() => handleSort('role')} className="sortable">
                  Assigned Role {sortBy === 'role' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="rs-table-loading">
                    Loading user records...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan="5" className="rs-table-empty">
                    No matching users found.
                  </td>
                </tr>
              ) : (
                users.map((item) => (
                  <tr key={item.id}>
                    <td className="rs-cell-bold">{item.name}</td>
                    <td>{item.email}</td>
                    <td className="rs-cell-address">{item.address || '—'}</td>
                    <td>{rolePill(item.role)}</td>
                    <td>
                      <button
                        type="button"
                        className="rs-btn-sm rs-btn-secondary"
                        onClick={() => handleViewUser(item.id)}
                      >
                        <FiEye /> View Profile
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="rs-pagination-bar">
            <span className="rs-pagination-count">
              Showing {users.length} of {totalCount} users
            </span>
            <div className="rs-pagination-controls">
              <button
                type="button"
                className="rs-btn-icon"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
              >
                <FiChevronLeft />
              </button>
              <span className="rs-page-indicator">
                Page {page} of {totalPages}
              </span>
              <button
                type="button"
                className="rs-btn-icon"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              >
                <FiChevronRight />
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* User Details Modal */}
      {selectedUser && (
        <div className="rs-modal-overlay">
          <div className="rs-modal-container">
            <div className="rs-modal-header">
              <h3>User Profile Details</h3>
              <button
                type="button"
                className="rs-modal-close"
                onClick={() => setSelectedUser(null)}
              >
                <FiX />
              </button>
            </div>

            <div className="rs-modal-body">
              <div className="rs-profile-grid">
                <div className="rs-profile-field">
                  <label>Full Name</label>
                  <p>{selectedUser.name}</p>
                </div>
                <div className="rs-profile-field">
                  <label>Email Address</label>
                  <p>{selectedUser.email}</p>
                </div>
                <div className="rs-profile-field">
                  <label>Account Role</label>
                  <div>{rolePill(selectedUser.role)}</div>
                </div>
                <div className="rs-profile-field">
                  <label>Physical Address</label>
                  <p>{selectedUser.address || 'Not specified'}</p>
                </div>

                {/* If user is Store Owner, show assigned store information */}
                {selectedUser.role === 'store_owner' && (
                  <div className="rs-store-owner-details-box">
                    <span className="rs-store-box-title">
                      <FiShoppingBag /> Assigned Merchant Store
                    </span>
                    {selectedUser.store_name ? (
                      <div className="rs-store-box-content">
                        <div>
                          <strong>Store Name:</strong> {selectedUser.store_name}
                        </div>
                        <div>
                          <strong>Store Average Rating:</strong>{' '}
                          <span className="rs-rating-badge">
                            ★ {parseFloat(selectedUser.store_rating || 0).toFixed(1)} / 5.0
                          </span>
                        </div>
                      </div>
                    ) : (
                      <p className="rs-text-muted">No physical store currently assigned to this owner.</p>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="rs-modal-footer">
              <button
                type="button"
                className="rs-btn rs-btn-secondary"
                onClick={() => setSelectedUser(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add New User Modal */}
      {showAddModal && (
        <div className="rs-modal-overlay">
          <div className="rs-modal-container rs-modal-lg">
            <div className="rs-modal-header">
              <h3>Register New User Account</h3>
              <button
                type="button"
                className="rs-modal-close"
                onClick={() => setShowAddModal(false)}
              >
                <FiX />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="rs-modal-form">
              {addError && <div className="rs-alert rs-alert-error">{addError}</div>}

              <div className="rs-form-group">
                <div className="rs-label-row">
                  <label className="rs-form-label">Full Name (min 20, max 60)</label>
                  <span className="rs-char-counter">
                    {addFormData.name.length}/60
                  </span>
                </div>
                <input
                  type="text"
                  className="rs-form-input"
                  value={addFormData.name}
                  onChange={(e) => setAddFormData({ ...addFormData, name: e.target.value })}
                  placeholder="e.g. Alexander Jonathan Montgomery"
                  required
                />
              </div>

              <div className="rs-form-row">
                <div className="rs-form-group">
                  <label className="rs-form-label">Email Address</label>
                  <input
                    type="email"
                    className="rs-form-input"
                    value={addFormData.email}
                    onChange={(e) => setAddFormData({ ...addFormData, email: e.target.value })}
                    placeholder="user@example.com"
                    required
                  />
                </div>

                <div className="rs-form-group">
                  <label className="rs-form-label">System Role</label>
                  <select
                    className="rs-form-input"
                    value={addFormData.role}
                    onChange={(e) => setAddFormData({ ...addFormData, role: e.target.value })}
                  >
                    <option value="user">Consumer (user)</option>
                    <option value="store_owner">Store Owner (store_owner)</option>
                    <option value="admin">System Admin (admin)</option>
                  </select>
                </div>
              </div>

              <div className="rs-form-group">
                <div className="rs-label-row">
                  <label className="rs-form-label">Physical Address (max 400)</label>
                  <span className="rs-char-counter">{addFormData.address.length}/400</span>
                </div>
                <input
                  type="text"
                  className="rs-form-input"
                  value={addFormData.address}
                  onChange={(e) => setAddFormData({ ...addFormData, address: e.target.value })}
                  placeholder="Street, City, State, Country"
                  required
                />
              </div>

              <div className="rs-form-group">
                <label className="rs-form-label">Temporary Password (8–16 chars, 1 uppercase, 1 special)</label>
                <input
                  type="password"
                  className="rs-form-input"
                  value={addFormData.password}
                  onChange={(e) => setAddFormData({ ...addFormData, password: e.target.value })}
                  placeholder="Create secure password"
                  required
                />
              </div>

              <div className="rs-modal-actions">
                <button
                  type="button"
                  className="rs-btn rs-btn-secondary"
                  onClick={() => setShowAddModal(false)}
                  disabled={addLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rs-btn rs-btn-primary"
                  disabled={addLoading}
                >
                  {addLoading ? 'Registering...' : 'Create User Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default AdminUsersPage;
