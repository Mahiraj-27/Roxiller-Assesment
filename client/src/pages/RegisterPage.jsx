import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../store/authSlice';
import { registerUser } from '../services/authService';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import toast from 'react-hot-toast';
import { FiUser, FiMail, FiMapPin, FiLock, FiCheck, FiArrowRight } from 'react-icons/fi';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { name, email, address, password } = formData;

  // Validation feedback indicators
  const isNameValid = name.length >= 20 && name.length <= 60;
  const isAddressValid = address.length > 0 && address.length <= 400;
  const hasUpper = /[A-Z]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);
  const hasLength = password.length >= 8 && password.length <= 16;
  const isPasswordValid = hasUpper && hasSpecial && hasLength;

  const handleChange = (e) => {
    const { name: fieldName, value } = e.target;
    setFormData((prev) => ({ ...prev, [fieldName]: value }));
    setFieldErrors((prev) => ({ ...prev, [fieldName]: '' }));
    setErrorMsg('');
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setFieldErrors({});

    if (!isNameValid) {
      setErrorMsg('Full Name must be between 20 and 60 characters.');
      return;
    }

    if (!isAddressValid) {
      setErrorMsg('Address cannot exceed 400 characters.');
      return;
    }

    if (!isPasswordValid) {
      setErrorMsg('Password does not satisfy complexity requirements.');
      return;
    }

    setLoading(true);
    try {
      const res = await registerUser(formData);
      const { user, accessToken } = res.data.data;
      dispatch(setCredentials({ user, accessToken }));
      toast.success('Account created! Welcome to RateSphere.');
      navigate('/user', { replace: true });
    } catch (err) {
      const resData = err.response?.data;
      const mainMsg = resData?.message || 'Registration failed.';
      setErrorMsg(mainMsg);

      if (resData?.errors && Array.isArray(resData.errors)) {
        const errorMap = {};
        resData.errors.forEach((errItem) => {
          errorMap[errItem.field] = errItem.message;
        });
        setFieldErrors(errorMap);
      }
      toast.error(mainMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rs-page-wrapper">
      <Navbar />

      <main className="rs-auth-container">
        <div className="rs-auth-card rs-auth-card-wide">
          <div className="rs-auth-header">
            <h1 className="rs-auth-title">Create Account</h1>
            <p className="rs-auth-desc">Register as a consumer to browse and rate local businesses</p>
          </div>

          {errorMsg && <div className="rs-alert rs-alert-error">{errorMsg}</div>}

          <form onSubmit={handleRegister} className="rs-form">
            {/* Full Name */}
            <div className="rs-form-group">
              <div className="rs-label-row">
                <label className="rs-form-label">Full Legal Name</label>
                <span className={`rs-char-counter ${name.length > 0 && !isNameValid ? 'invalid' : ''}`}>
                  {name.length}/60 chars (min 20)
                </span>
              </div>
              <div className="rs-input-icon-wrap">
                <FiUser className="rs-input-icon" />
                <input
                  type="text"
                  name="name"
                  className={`rs-form-input with-icon ${fieldErrors.name ? 'input-invalid' : ''}`}
                  value={name}
                  onChange={handleChange}
                  placeholder="e.g. Jonathan Alexander Doe"
                  required
                />
              </div>
              {fieldErrors.name && <span className="rs-field-error">{fieldErrors.name}</span>}
            </div>

            {/* Email Address */}
            <div className="rs-form-group">
              <label className="rs-form-label">Email Address</label>
              <div className="rs-input-icon-wrap">
                <FiMail className="rs-input-icon" />
                <input
                  type="email"
                  name="email"
                  className={`rs-form-input with-icon ${fieldErrors.email ? 'input-invalid' : ''}`}
                  value={email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  required
                />
              </div>
              {fieldErrors.email && <span className="rs-field-error">{fieldErrors.email}</span>}
            </div>

            {/* Physical Address */}
            <div className="rs-form-group">
              <div className="rs-label-row">
                <label className="rs-form-label">Physical Address</label>
                <span className={`rs-char-counter ${address.length > 400 ? 'invalid' : ''}`}>
                  {address.length}/400 max
                </span>
              </div>
              <div className="rs-input-icon-wrap">
                <FiMapPin className="rs-input-icon" />
                <input
                  type="text"
                  name="address"
                  className={`rs-form-input with-icon ${fieldErrors.address ? 'input-invalid' : ''}`}
                  value={address}
                  onChange={handleChange}
                  placeholder="Street address, city, state, zip"
                  required
                />
              </div>
              {fieldErrors.address && <span className="rs-field-error">{fieldErrors.address}</span>}
            </div>

            {/* Password with live checklists */}
            <div className="rs-form-group">
              <label className="rs-form-label">Password</label>
              <div className="rs-input-icon-wrap">
                <FiLock className="rs-input-icon" />
                <input
                  type="password"
                  name="password"
                  className={`rs-form-input with-icon ${fieldErrors.password ? 'input-invalid' : ''}`}
                  value={password}
                  onChange={handleChange}
                  placeholder="Create secure password"
                  required
                />
              </div>
              {fieldErrors.password && <span className="rs-field-error">{fieldErrors.password}</span>}

              <div className="rs-password-hints">
                <span className={`rs-hint-badge ${hasLength ? 'valid' : ''}`}>
                  <FiCheck /> 8–16 characters
                </span>
                <span className={`rs-hint-badge ${hasUpper ? 'valid' : ''}`}>
                  <FiCheck /> 1 uppercase letter
                </span>
                <span className={`rs-hint-badge ${hasSpecial ? 'valid' : ''}`}>
                  <FiCheck /> 1 special character
                </span>
              </div>
            </div>

            <button
              type="submit"
              className="rs-btn rs-btn-primary rs-btn-full"
              disabled={loading || !isNameValid || !isPasswordValid}
            >
              {loading ? 'Creating Account...' : 'Complete Registration'} <FiArrowRight />
            </button>
          </form>

          <div className="rs-auth-footer">
            <p>
              Already registered?{' '}
              <Link to="/login" className="rs-link">
                Sign In to Existing Account
              </Link>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default RegisterPage;
