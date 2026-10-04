import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { fetchAdminDashboardMetrics } from '../../services/adminService';
import toast from 'react-hot-toast';
import { FiUsers, FiShoppingBag, FiStar, FiArrowRight, FiPlusCircle, FiActivity } from 'react-icons/fi';

const AdminDashboard = () => {
  const [metrics, setMetrics] = useState({
    total_users: 0,
    total_stores: 0,
    total_ratings: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMetrics = async () => {
      try {
        const res = await fetchAdminDashboardMetrics();
        setMetrics(res.data.data);
      } catch (err) {
        toast.error('Failed to load administrative metrics: ' + (err.response?.data?.message || err.message));
      } finally {
        setLoading(false);
      }
    };

    loadMetrics();
  }, []);

  return (
    <div className="rs-page-wrapper">
      <Navbar />

      <main className="rs-dashboard-main">
        <div className="rs-page-header">
          <div className="rs-page-title-wrap">
            <span className="rs-section-badge">
              <FiActivity /> System Management
            </span>
            <h1 className="rs-page-heading">Administrator Overview</h1>
            <p className="rs-page-subheading">
              Platform-wide performance indices and centralized operations
            </p>
          </div>

          <div className="rs-header-actions">
            <Link to="/admin/users" className="rs-btn rs-btn-secondary">
              <FiPlusCircle /> Add User
            </Link>
            <Link to="/admin/stores" className="rs-btn rs-btn-primary">
              <FiPlusCircle /> Register Store
            </Link>
          </div>
        </div>

        {/* Aggregate KPI Statistics */}
        <section className="rs-metrics-grid">
          <div className="rs-metric-card">
            <div className="rs-metric-header">
              <span className="rs-metric-label">Total Registered Users</span>
              <div className="rs-metric-icon rs-icon-users">
                <FiUsers />
              </div>
            </div>
            <div className="rs-metric-body">
              <span className="rs-metric-value">
                {loading ? '...' : metrics.total_users}
              </span>
              <span className="rs-metric-hint">Admins, Owners & Consumers</span>
            </div>
            <Link to="/admin/users" className="rs-metric-footer">
              Manage Users <FiArrowRight />
            </Link>
          </div>

          <div className="rs-metric-card">
            <div className="rs-metric-header">
              <span className="rs-metric-label">Total Registered Stores</span>
              <div className="rs-metric-icon rs-icon-stores">
                <FiShoppingBag />
              </div>
            </div>
            <div className="rs-metric-body">
              <span className="rs-metric-value">
                {loading ? '...' : metrics.total_stores}
              </span>
              <span className="rs-metric-hint">Active merchant entities</span>
            </div>
            <Link to="/admin/stores" className="rs-metric-footer">
              Manage Stores <FiArrowRight />
            </Link>
          </div>

          <div className="rs-metric-card">
            <div className="rs-metric-header">
              <span className="rs-metric-label">Total Ratings Submitted</span>
              <div className="rs-metric-icon rs-icon-ratings">
                <FiStar />
              </div>
            </div>
            <div className="rs-metric-body">
              <span className="rs-metric-value">
                {loading ? '...' : metrics.total_ratings}
              </span>
              <span className="rs-metric-hint">Verified consumer reviews</span>
            </div>
            <Link to="/admin/stores" className="rs-metric-footer">
              View Catalog <FiArrowRight />
            </Link>
          </div>
        </section>

        {/* Operational Shortcuts */}
        <section className="rs-quick-actions-section">
          <div className="rs-card">
            <h3 className="rs-card-title">Administrative Actions</h3>
            <p className="rs-card-subtitle">Direct shortcuts to manage user accounts and merchant store records</p>
            <div className="rs-quick-links-grid">
              <Link to="/admin/users" className="rs-quick-link-box">
                <div className="rs-quick-link-icon"><FiUsers /></div>
                <div className="rs-quick-link-content">
                  <h4>User Management Directory</h4>
                  <p>Search, filter by role, inspect assigned stores, or register new administrative & merchant accounts.</p>
                </div>
                <FiArrowRight className="rs-quick-link-arrow" />
              </Link>

              <Link to="/admin/stores" className="rs-quick-link-box">
                <div className="rs-quick-link-icon"><FiShoppingBag /></div>
                <div className="rs-quick-link-content">
                  <h4>Store Catalog Directory</h4>
                  <p>Register new physical store listings, assign verified store owners, and audit store satisfaction.</p>
                </div>
                <FiArrowRight className="rs-quick-link-arrow" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default AdminDashboard;
