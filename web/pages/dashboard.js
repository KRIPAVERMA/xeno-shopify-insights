import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

export default function Dashboard() {
  const [metrics, setMetrics] = useState(null);
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const apiKey = localStorage.getItem('tenantApiKey');
    if (!token || !apiKey) {
      router.push('/login');
      return;
    }

    const backend = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';
    
    axios.get(`${backend}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(r => setUser(r.data)).catch(e => {
      console.error(e);
      setError('Session expired');
      localStorage.clear();
      router.push('/login');
    });

    axios.get(`${backend}/api/metrics`, {
      headers: { 'x-tenant-apikey': apiKey }
    }).then(r => setMetrics(r.data)).catch(e => {
      console.error(e);
      setError('Failed to load metrics');
    });
  }, [router]);

  function logout() {
    localStorage.clear();
    router.push('/');
  }

  if (error) return <div style={{padding:20, color:'red'}}>{error}</div>
  if (!metrics || !user) return (
    <div style={{
      minHeight: '100vh',
      background: '#f7fafc',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '48px', marginBottom: '20px' }}>⏳</div>
        <div style={{ fontSize: '18px', color: '#666' }}>Loading...</div>
      </div>
    </div>
  )

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f7fafc',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '20px 40px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <h1 style={{ margin: 0, color: 'white', fontSize: '28px', fontWeight: 'bold' }}>📊 Dashboard</h1>
          <p style={{ margin: '5px 0 0 0', color: 'rgba(255,255,255,0.9)', fontSize: '14px' }}>Welcome back, {user.name || user.email}!</p>
        </div>
        <button onClick={logout} style={{
          padding: '10px 24px',
          background: 'rgba(255,255,255,0.2)',
          color: 'white',
          border: '2px solid white',
          borderRadius: '20px',
          fontSize: '14px',
          fontWeight: 'bold',
          cursor: 'pointer',
          transition: 'background 0.2s'
        }} onMouseOver={e => e.target.style.background = 'rgba(255,255,255,0.3)'}
           onMouseOut={e => e.target.style.background = 'rgba(255,255,255,0.2)'}>Logout</button>
      </div>

      <div style={{ padding: '40px' }}>
        {/* Stats Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '40px' }}>
          <div style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: '30px',
            borderRadius: '15px',
            boxShadow: '0 4px 20px rgba(102, 126, 234, 0.3)',
            color: 'white'
          }}>
            <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '8px', fontWeight: '600' }}>👥 Total Customers</div>
            <div style={{ fontSize: '42px', fontWeight: 'bold' }}>{metrics.totalCustomers}</div>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            padding: '30px',
            borderRadius: '15px',
            boxShadow: '0 4px 20px rgba(240, 147, 251, 0.3)',
            color: 'white'
          }}>
            <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '8px', fontWeight: '600' }}>🛍️ Total Orders</div>
            <div style={{ fontSize: '42px', fontWeight: 'bold' }}>{metrics.totalOrders}</div>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            padding: '30px',
            borderRadius: '15px',
            boxShadow: '0 4px 20px rgba(79, 172, 254, 0.3)',
            color: 'white'
          }}>
            <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '8px', fontWeight: '600' }}>💰 Total Revenue</div>
            <div style={{ fontSize: '42px', fontWeight: 'bold' }}>${metrics.revenue.toFixed(2)}</div>
          </div>
        </div>

        {/* Top Customers Table */}
        <div style={{
          background: 'white',
          borderRadius: '15px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
          overflow: 'hidden'
        }}>
          <div style={{
            padding: '25px 30px',
            borderBottom: '1px solid #e2e8f0',
            background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)'
          }}>
            <h3 style={{ margin: 0, fontSize: '20px', color: '#333', fontWeight: 'bold' }}>🏆 Top 5 Customers by Spend</h3>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f7fafc', borderBottom: '2px solid #e2e8f0' }}>
                <th style={{ padding: '15px 30px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#718096' }}>Email</th>
                <th style={{ padding: '15px 30px', textAlign: 'right', fontSize: '14px', fontWeight: '600', color: '#718096' }}>Total Spend</th>
              </tr>
            </thead>
            <tbody>
              {metrics.topCustomers && metrics.topCustomers.length > 0 ? (
                metrics.topCustomers.map((c, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #e2e8f0', transition: 'background 0.2s' }}
                      onMouseOver={e => e.currentTarget.style.background = '#f7fafc'}
                      onMouseOut={e => e.currentTarget.style.background = 'white'}>
                    <td style={{ padding: '18px 30px', fontSize: '15px', color: '#333' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontWeight: 'bold',
                          fontSize: '14px'
                        }}>{i + 1}</div>
                        {c.email || 'Unknown'}
                      </div>
                    </td>
                    <td style={{ padding: '18px 30px', textAlign: 'right', fontSize: '18px', fontWeight: 'bold', color: '#667eea' }}>
                      ${c.totalSpend ? c.totalSpend.toFixed(2) : '0.00'}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="2" style={{ padding: '40px', textAlign: 'center', color: '#a0aec0', fontSize: '16px' }}>
                    No customer data available yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
