import { useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

export default function Login() {
  const [apiKey, setApiKey] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  async function handleLogin(e) {
    e.preventDefault();
    setError('');
    try {
      const backend = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';
      const res = await axios.post(`${backend}/api/auth/login`, { email, password, apiKey });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('tenantApiKey', res.data.apiKey);
      router.push('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '20px',
        padding: '40px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        width: '100%',
        maxWidth: '450px'
      }}>
        <h1 style={{
          fontSize: '32px',
          margin: '0 0 10px 0',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontWeight: 'bold'
        }}>Login</h1>
        <p style={{ color: '#666', marginBottom: '30px', fontSize: '14px' }}>Welcome back! Please login to your account</p>
        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333', fontSize: '14px' }}>Tenant API Key</label>
            <input style={{
              width: '100%',
              padding: '12px 16px',
              border: '2px solid #e1e8ed',
              borderRadius: '10px',
              fontSize: '14px',
              transition: 'border 0.3s',
              boxSizing: 'border-box'
            }} value={apiKey} onChange={e => setApiKey(e.target.value)} required
            onFocus={e => e.target.style.borderColor = '#667eea'}
            onBlur={e => e.target.style.borderColor = '#e1e8ed'} />
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333', fontSize: '14px' }}>Email</label>
            <input type="email" style={{
              width: '100%',
              padding: '12px 16px',
              border: '2px solid #e1e8ed',
              borderRadius: '10px',
              fontSize: '14px',
              transition: 'border 0.3s',
              boxSizing: 'border-box'
            }} value={email} onChange={e => setEmail(e.target.value)} required
            onFocus={e => e.target.style.borderColor = '#667eea'}
            onBlur={e => e.target.style.borderColor = '#e1e8ed'} />
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333', fontSize: '14px' }}>Password</label>
            <input type="password" style={{
              width: '100%',
              padding: '12px 16px',
              border: '2px solid #e1e8ed',
              borderRadius: '10px',
              fontSize: '14px',
              transition: 'border 0.3s',
              boxSizing: 'border-box'
            }} value={password} onChange={e => setPassword(e.target.value)} required
            onFocus={e => e.target.style.borderColor = '#667eea'}
            onBlur={e => e.target.style.borderColor = '#e1e8ed'} />
          </div>
          {error && <div style={{
            color: '#e53e3e',
            background: '#fff5f5',
            padding: '12px 16px',
            borderRadius: '10px',
            marginBottom: '20px',
            fontSize: '14px',
            border: '1px solid #feb2b2'
          }}>{error}</div>}
          <button type="submit" style={{
            width: '100%',
            padding: '14px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
            transition: 'transform 0.2s'
          }} onMouseOver={e => e.target.style.transform = 'translateY(-2px)'}
             onMouseOut={e => e.target.style.transform = 'translateY(0)'}>Login</button>
          <div style={{ marginTop: 20, textAlign: 'center', fontSize: '14px' }}>
            <a href="/register" style={{ color: '#667eea', textDecoration: 'none', fontWeight: '600' }}>Don't have an account? Register</a>
          </div>
        </form>
      </div>
    </div>
  );
}
