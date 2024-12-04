import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const VerifyAccount = () => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem('user'));
    if (!user || !user.email) {
      navigate('/login');
    } else {
      setUserEmail(user.email);
    }
  }, [navigate]);

  const handleVerify = async (e) => {
    e.preventDefault();
    try {
      const url = new URL('http://localhost:8080/api/users/verify-email');
      url.searchParams.append('email', userEmail);
      url.searchParams.append('code', code);
  
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }
  
      const user = JSON.parse(sessionStorage.getItem('user'));
      user.verified = true;
      sessionStorage.setItem('user', JSON.stringify(user));
  
      navigate('/');
    } catch (error) {
      setError(error.message);
    }
  };
  

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '100vh'}}>
      <div className="border rounded shadow p-4" style={{ width: '100%', maxWidth: '400px' }}>
        <h2 className="text-center mb-4">Verify Your Account</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleVerify}>
          <div className="form-group mb-3">
            <label>Verification Code</label>
            <input
              type="text"
              className="form-control"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100 mb-3">Verify</button>
        </form>
      </div>
    </div>
  );
};

export default VerifyAccount;