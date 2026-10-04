import React from 'react';
import { Link } from 'react-router-dom';

const UnauthorizedPage = () => {
  return (
    <div style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '2rem' }}>
      <h1 style={{ fontSize: '4rem', fontWeight: 800, color: '#e11d48', margin: '0 0 1rem' }}>403</h1>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#334155', margin: '0 0 1rem' }}>Access Denied</h2>
      <p style={{ color: '#64748b', maxWidth: '420px', marginBottom: '2rem' }}>
        You do not have the required permissions to view this section.
      </p>
      <Link to="/" style={{ padding: '0.75rem 1.5rem', background: '#0f172a', color: '#ffffff', borderRadius: '8px', textDecoration: 'none', fontWeight: 600 }}>
        Return to Safety
      </Link>
    </div>
  );
};

export default UnauthorizedPage;
