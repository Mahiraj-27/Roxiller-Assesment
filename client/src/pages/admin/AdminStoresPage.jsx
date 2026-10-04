import React, { useState, useEffect, useCallback } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import {
  fetchAdminStores,
  fetchAdminUsers,
  registerStoreByAdmin,
} from '../../services/adminService';
import toast from 'react-hot-toast';
import {
  FiShoppingBag,
  FiSearch,
  FiPlus,
  FiX,
  FiChevronLeft,
  FiChevronRight,
  FiStar,
} from 'react-icons/fi';

const AdminStoresPage = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Store creation modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [ownersList, setOwnersList] = useState([]);
  const [addFormData, setAddFormData] = useState({
    name: '',
    email: '',
    address: '',
    ownerId: '',
  });
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState('');

  const loadStores = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchAdminStores({
        search: search.trim() || undefined,
        sortBy,
        sortOrder,
        page,
        limit: 10,
      });

      const { stores: fetchedStores, totalPages: pages, total } = res.data.data;
      setStores(fetchedStores || []);
      setTotalPages(pages || 1);
      setTotalCount(total || 0);
    } catch (err) {
      toast.error('Failed to load store catalog: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  }, [search, sortBy, sortOrder, page]);

  useEffect(() => {
    loadStores();
  }, [loadStores]);

  // Load available store owners for the store registration dropdown
  const loadOwners = async () => {
    try {
      const res = await fetchAdminUsers({ role: 'store_owner', limit: 100 });
      setOwnersList(res.data.data?.users || []);
    } catch {
      // Non-fatal
    }
  };

  const handleOpenAddModal = () => {
    setShowAddModal(true);
    loadOwners();
  };

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
    setPage(1);
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setAddError('');

    if (addFormData.name.length < 20 || addFormData.name.length > 60) {
      setAddError('Store name must be between 20 and 60 characters.');
      return;
    }

    if (addFormData.address.length > 400) {
      setAddError('Address cannot exceed 400 characters.');
      return;
    }

    setAddLoading(true);
    try {
      const payload = {
        name: addFormData.name,
        email: addFormData.email,
        address: addFormData.address,
        ownerId: addFormData.ownerId ? parseInt(addFormData.ownerId, 10) : null,
      };

      await registerStoreByAdmin(payload);
      toast.success('Store registered successfully');
      setShowAddModal(false);
      setAddFormData({ name: '', email: '', address: '', ownerId: '' });
      loadStores();
    } catch (err) {
      setAddError(err.response?.data?.message || 'Failed to register store');
    } finally {
      setAddLoading(false);
    }
  };

  return (
    <div className="rs-page-wrapper">
      <Navbar />

      <main className="rs-dashboard-main">
        <div className="rs-page-header">
          <div className="rs-page-title-wrap">
            <span className="rs-section-badge">
              <FiShoppingBag /> Merchant Directory
            </span>
            <h1 className="rs-page-heading">Store Catalog Directory</h1>
            <p className="rs-page-subheading">
              Manage retail store listings, owner allocations, and overall consumer ratings
            </p>
          </div>

          <div className="rs-header-actions">
            <button
              type="button"
              className="rs-btn rs-btn-primary"
              onClick={handleOpenAddModal}
            >
              <FiPlus /> Register New Store
            </button>
          </div>
        </div>

        {/* Search Toolbar */}
        <div className="rs-toolbar-card">
          <div className="rs-search-input-wrap">
            <FiSearch className="rs-search-icon" />
            <input
              type="text"
              className="rs-search-input"
              placeholder="Search store name or address..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>
        </div>

        {/* Stores Table */}
        <div className="rs-table-container">
          <table className="rs-table">
            <thead>
              <tr>
                <th onClick={() => handleSort('name')} className="sortable">
                  Store Name {sortBy === 'name' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
                </th>
                <th onClick={() => handleSort('email')} className="sortable">
                  Contact Email {sortBy === 'email' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
                </th>
                <th onClick={() => handleSort('address')} className="sortable">
                  Physical Address {sortBy === 'address' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
                </th>
                <th onClick={() => handleSort('average_rating')} className="sortable">
                  Rating Average {sortBy === 'average_rating' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
                </th>
                <th>Total Reviews</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="rs-table-loading">
                    Loading store catalog...
                  </td>
                </tr>
              ) : stores.length === 0 ? (
                <tr>
                  <td colSpan="5" className="rs-table-empty">
                    No matching stores found.
                  </td>
                </tr>
              ) : (
                stores.map((store) => (
                  <tr key={store.id}>
                    <td className="rs-cell-bold">{store.name}</td>
                    <td>{store.email}</td>
                    <td className="rs-cell-address">{store.address}</td>
                    <td>
                      <div className="rs-rating-chip">
                        <FiStar className="rs-star-icon" />
                        <span>{parseFloat(store.average_rating || 0).toFixed(1)} / 5.0</span>
                      </div>
                    </td>
                    <td>
                      <span className="rs-badge-count">{store.total_ratings || 0} reviews</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="rs-pagination-bar">
            <span className="rs-pagination-count">
              Showing {stores.length} of {totalCount} stores
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

      {/* Add New Store Modal */}
      {showAddModal && (
        <div className="rs-modal-overlay">
          <div className="rs-modal-container rs-modal-lg">
            <div className="rs-modal-header">
              <h3>Register New Merchant Store</h3>
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
                  <label className="rs-form-label">Store Brand Name (min 20, max 60)</label>
                  <span className="rs-char-counter">{addFormData.name.length}/60</span>
                </div>
                <input
                  type="text"
                  className="rs-form-input"
                  value={addFormData.name}
                  onChange={(e) => setAddFormData({ ...addFormData, name: e.target.value })}
                  placeholder="e.g. Grand Central Electronics & Gadgets"
                  required
                />
              </div>

              <div className="rs-form-row">
                <div className="rs-form-group">
                  <label className="rs-form-label">Store Contact Email</label>
                  <input
                    type="email"
                    className="rs-form-input"
                    value={addFormData.email}
                    onChange={(e) => setAddFormData({ ...addFormData, email: e.target.value })}
                    placeholder="contact@storename.com"
                    required
                  />
                </div>

                <div className="rs-form-group">
                  <label className="rs-form-label">Assigned Store Owner</label>
                  <select
                    className="rs-form-input"
                    value={addFormData.ownerId}
                    onChange={(e) => setAddFormData({ ...addFormData, ownerId: e.target.value })}
                  >
                    <option value="">— Unassigned (Optional) —</option>
                    {ownersList.map((owner) => (
                      <option key={owner.id} value={owner.id}>
                        {owner.name} ({owner.email})
                      </option>
                    ))}
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
                  placeholder="Full street address, city, state, postal code"
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
                  {addLoading ? 'Saving...' : 'Register Store'}
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

export default AdminStoresPage;
