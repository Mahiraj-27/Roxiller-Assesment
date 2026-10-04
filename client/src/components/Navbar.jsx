import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { clearCredentials } from '../store/authSlice';
import { signOutUser } from '../services/authService';
import ChangePasswordModal from './ChangePasswordModal';
import toast from 'react-hot-toast';
import { FiLogOut, FiKey, FiShield, FiUser, FiShoppingBag, FiGrid, FiUsers } from 'react-icons/fi';

const Navbar = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const handleLogout = async () => {
    try {
      await signOutUser();
    } catch {
      // Ignore network errors on logout
    } finally {
      dispatch(clearCredentials());
      toast.success('Signed out successfully');
      navigate('/login');
    }
  };

  const roleLabels = {
    admin: { label: 'Administrator', badgeClass: 'badge-admin', icon: <FiShield /> },
    store_owner: { label: 'Store Owner', badgeClass: 'badge-owner', icon: <FiShoppingBag /> },
    user: { label: 'Consumer', badgeClass: 'badge-user', icon: <FiUser /> },
  };

  const currentRoleInfo = user?.role ? roleLabels[user.role] : null;

  return (
    <>
      <header className="rs-navbar">
        <div className="rs-navbar-container">
          <Link to="/" className="rs-brand">
            <span className="rs-brand-icon">
              <span className="rs-brand-dot"></span>
            </span>
            <div className="rs-brand-text">
              <span className="rs-brand-title">RateSphere</span>
              <span className="rs-brand-tag">Store Intelligence</span>
            </div>
          </Link>

          {isAuthenticated && user && (
            <nav className="rs-nav-links">
              {user.role === 'admin' && (
                <>
                  <Link
                    to="/admin"
                    className={`rs-nav-link ${location.pathname === '/admin' ? 'active' : ''}`}
                  >
                    <FiGrid /> Metrics
                  </Link>
                  <Link
                    to="/admin/users"
                    className={`rs-nav-link ${location.pathname === '/admin/users' ? 'active' : ''}`}
                  >
                    <FiUsers /> Users
                  </Link>
                  <Link
                    to="/admin/stores"
                    className={`rs-nav-link ${location.pathname === '/admin/stores' ? 'active' : ''}`}
                  >
                    <FiShoppingBag /> Stores
                  </Link>
                </>
              )}

              {user.role === 'store_owner' && (
                <Link
                  to="/owner"
                  className={`rs-nav-link ${location.pathname === '/owner' ? 'active' : ''}`}
                >
                  <FiShoppingBag /> Store Overview
                </Link>
              )}

              {user.role === 'user' && (
                <Link
                  to="/user"
                  className={`rs-nav-link ${location.pathname === '/user' ? 'active' : ''}`}
                >
                  <FiGrid /> Explore Stores
                </Link>
              )}
            </nav>
          )}

          <div className="rs-nav-actions">
            {isAuthenticated && user ? (
              <div className="rs-user-profile">
                <span className={`rs-role-pill ${currentRoleInfo?.badgeClass}`}>
                  {currentRoleInfo?.icon}
                  {currentRoleInfo?.label}
                </span>

                <div className="rs-user-meta">
                  <span className="rs-user-name" title={user.name}>{user.name}</span>
                  <span className="rs-user-email" title={user.email}>{user.email}</span>
                </div>

                <button
                  type="button"
                  className="rs-btn-icon"
                  title="Update Password"
                  onClick={() => setShowPasswordModal(true)}
                >
                  <FiKey />
                </button>

                <button
                  type="button"
                  className="rs-btn-icon rs-btn-danger-icon"
                  title="Sign Out"
                  onClick={handleLogout}
                >
                  <FiLogOut />
                </button>
              </div>
            ) : (
              <div className="rs-auth-buttons">
                <Link to="/login" className="rs-btn rs-btn-secondary">
                  Sign In
                </Link>
                <Link to="/signup" className="rs-btn rs-btn-primary">
                  Create Account
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {showPasswordModal && (
        <ChangePasswordModal onClose={() => setShowPasswordModal(false)} />
      )}
    </>
  );
};

export default Navbar;
