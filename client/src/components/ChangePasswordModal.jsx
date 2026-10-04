import React, { useState } from 'react';
import { updateUserPassword } from '../services/authService';
import toast from 'react-hot-toast';
import { FiX, FiLock, FiCheck } from 'react-icons/fi';

const ChangePasswordModal = ({ onClose }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const hasUpper = /[A-Z]/.test(newPassword);
  const hasSpecial = /[^A-Za-z0-9]/.test(newPassword);
  const hasLength = newPassword.length >= 8 && newPassword.length <= 16;
  const isMatch = newPassword.length > 0 && newPassword === confirmPassword;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!hasLength || !hasUpper || !hasSpecial) {
      setErrorMsg('New password does not satisfy complexity requirements.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg('New passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      await updateUserPassword({ currentPassword, newPassword });
      toast.success('Password updated successfully');
      onClose();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update password';
      setErrorMsg(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rs-modal-overlay">
      <div className="rs-modal-container">
        <div className="rs-modal-header">
          <div className="rs-modal-title-wrap">
            <FiLock className="rs-modal-icon" />
            <h3>Update Password</h3>
          </div>
          <button type="button" className="rs-modal-close" onClick={onClose}>
            <FiX />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="rs-modal-form">
          {errorMsg && <div className="rs-alert rs-alert-error">{errorMsg}</div>}

          <div className="rs-form-group">
            <label className="rs-form-label">Current Password</label>
            <input
              type="password"
              className="rs-form-input"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter your existing password"
              required
            />
          </div>

          <div className="rs-form-group">
            <label className="rs-form-label">New Password</label>
            <input
              type="password"
              className="rs-form-input"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new strong password"
              required
            />
          </div>

          <div className="rs-password-hints">
            <span className={`rs-hint-badge ${hasLength ? 'valid' : ''}`}>
              <FiCheck /> 8–16 characters
            </span>
            <span className={`rs-hint-badge ${hasUpper ? 'valid' : ''}`}>
              <FiCheck /> 1 uppercase
            </span>
            <span className={`rs-hint-badge ${hasSpecial ? 'valid' : ''}`}>
              <FiCheck /> 1 special character
            </span>
          </div>

          <div className="rs-form-group">
            <label className="rs-form-label">Confirm New Password</label>
            <input
              type="password"
              className={`rs-form-input ${confirmPassword ? (isMatch ? 'input-valid' : 'input-invalid') : ''}`}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter new password"
              required
            />
          </div>

          <div className="rs-modal-actions">
            <button
              type="button"
              className="rs-btn rs-btn-secondary"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rs-btn rs-btn-primary"
              disabled={loading || !hasLength || !hasUpper || !hasSpecial || !isMatch}
            >
              {loading ? 'Saving...' : 'Update Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordModal;
