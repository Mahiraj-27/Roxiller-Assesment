import React, { useState, useEffect, useCallback } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import RatingStars from '../../components/RatingStars';
import {
  fetchOwnerDashboard,
  fetchOwnerCustomerRatings,
} from '../../services/ownerService';
import toast from 'react-hot-toast';
import {
  FiShoppingBag,
  FiStar,
  FiUsers,
  FiChevronLeft,
  FiChevronRight,
  FiCalendar,
} from 'react-icons/fi';

const OwnerDashboard = () => {
  const [storeInfo, setStoreInfo] = useState(null);
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ratingsLoading, setRatingsLoading] = useState(true);

  // Sorting & pagination
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Load store overview metrics
  useEffect(() => {
    const loadOverview = async () => {
      try {
        const res = await fetchOwnerDashboard();
        setStoreInfo(res.data.data?.store || null);
      } catch (err) {
        toast.error('Failed to load store overview: ' + (err.response?.data?.message || err.message));
      } finally {
        setLoading(false);
      }
    };

    loadOverview();
  }, []);

  // Load customer reviews table
  const loadRatings = useCallback(async () => {
    setRatingsLoading(true);
    try {
      const res = await fetchOwnerCustomerRatings({
        sortBy,
        sortOrder,
        page,
        limit: 10,
      });

      const { ratings: fetchedRatings, totalPages: pages, total } = res.data.data;
      setRatings(fetchedRatings || []);
      setTotalPages(pages || 1);
      setTotalCount(total || 0);
    } catch (err) {
      toast.error('Failed to load customer reviews: ' + (err.response?.data?.message || err.message));
    } finally {
      setRatingsLoading(false);
    }
  }, [sortBy, sortOrder, page]);

  useEffect(() => {
    loadRatings();
  }, [loadRatings]);

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(column);
      setSortOrder(column === 'created_at' ? 'desc' : 'asc');
    }
    setPage(1);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '—';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="rs-page-wrapper">
      <Navbar />

      <main className="rs-dashboard-main">
        <div className="rs-page-header">
          <div className="rs-page-title-wrap">
            <span className="rs-section-badge">
              <FiShoppingBag /> Merchant Management
            </span>
            <h1 className="rs-page-heading">Store Owner Portal</h1>
            <p className="rs-page-subheading">
              Monitor your store's customer satisfaction scores and inspect submitted customer reviews
            </p>
          </div>
        </div>

        {/* Store Summary Hero Card */}
        {loading ? (
          <div className="rs-loading-state">
            <p>Loading store performance...</p>
          </div>
        ) : !storeInfo ? (
          <div className="rs-empty-state">
            <h3>No store assigned</h3>
            <p>Your account has not been assigned to a physical store yet. Please contact an administrator.</p>
          </div>
        ) : (
          <div className="rs-owner-hero-card">
            <div className="rs-owner-hero-left">
              <span className="rs-owner-store-label">Assigned Retail Store</span>
              <h2 className="rs-owner-store-name">{storeInfo.name}</h2>
              <span className="rs-owner-store-id">Store Entity ID: #{storeInfo.id}</span>
            </div>

            <div className="rs-owner-hero-stats">
              <div className="rs-owner-stat-box">
                <span className="rs-owner-stat-title">Average Rating</span>
                <div className="rs-owner-score-row">
                  <FiStar className="rs-owner-star-large" />
                  <span className="rs-owner-score-big">
                    {parseFloat(storeInfo.averageRating || 0).toFixed(1)}
                  </span>
                  <span className="rs-owner-score-max">/ 5.0</span>
                </div>
                <RatingStars value={storeInfo.averageRating || 0} readOnly size={18} />
              </div>

              <div className="rs-owner-stat-box">
                <span className="rs-owner-stat-title">Customer Feedback</span>
                <div className="rs-owner-score-row">
                  <FiUsers className="rs-owner-users-icon" />
                  <span className="rs-owner-score-big">{storeInfo.totalRatings || 0}</span>
                </div>
                <span className="rs-owner-stat-hint">Total Verified Ratings</span>
              </div>
            </div>
          </div>
        )}

        {/* Customer Reviews & Raters Table */}
        <div className="rs-section-card">
          <div className="rs-section-header-row">
            <div>
              <h3>Customer Ratings Log</h3>
              <p>Detailed list of individual consumers who submitted ratings for your store</p>
            </div>
          </div>

          <div className="rs-table-container">
            <table className="rs-table">
              <thead>
                <tr>
                  <th onClick={() => handleSort('name')} className="sortable">
                    Reviewer Name {sortBy === 'name' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
                  </th>
                  <th>Contact Email</th>
                  <th onClick={() => handleSort('rating')} className="sortable">
                    Rating Score {sortBy === 'rating' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
                  </th>
                  <th onClick={() => handleSort('created_at')} className="sortable">
                    Submitted Date {sortBy === 'created_at' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
                  </th>
                </tr>
              </thead>
              <tbody>
                {ratingsLoading ? (
                  <tr>
                    <td colSpan="4" className="rs-table-loading">
                      Loading customer ratings...
                    </td>
                  </tr>
                ) : ratings.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="rs-table-empty">
                      No customer ratings submitted for this store yet.
                    </td>
                  </tr>
                ) : (
                  ratings.map((r) => (
                    <tr key={r.id}>
                      <td className="rs-cell-bold">{r.user_name}</td>
                      <td>{r.user_email}</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <RatingStars value={r.rating} readOnly size={16} />
                          <span className="rs-rating-score-num">({r.rating}/5)</span>
                        </div>
                      </td>
                      <td className="rs-cell-date">
                        <FiCalendar className="rs-icon-sm" /> {formatDate(r.created_at)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {/* Pagination Bar */}
            <div className="rs-pagination-bar">
              <span className="rs-pagination-count">
                Showing {ratings.length} of {totalCount} reviews
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
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default OwnerDashboard;
