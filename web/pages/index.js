import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      router.push('/dashboard');
    }
  }, [router]);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '20px',
        padding: '60px 80px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        textAlign: 'center',
        maxWidth: '500px'
      }}>
        <div style={{
          fontSize: '48px',
          marginBottom: '10px'
        }}>🚀</div>
        <h1 style={{
          fontSize: '42px',
          margin: '0 0 10px 0',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontWeight: 'bold'
        }}>Xeno Platform</h1>
        <p style={{
          fontSize: '18px',
          color: '#666',
          margin: '0 0 40px 0'
        }}>Multi-tenant data ingestion and insights for Shopify stores</p>
        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
          <button onClick={() => router.push('/login')} style={{
            padding: '15px 40px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '30px',
            fontWeight: 'bold',
            fontSize: '16px',
            cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
            transition: 'transform 0.2s',
          }} onMouseOver={e => e.target.style.transform = 'translateY(-2px)'}
             onMouseOut={e => e.target.style.transform = 'translateY(0)'}>Login</button>
          <button onClick={() => router.push('/register')} style={{
            padding: '15px 40px',
            background: 'white',
            color: '#667eea',
            border: '2px solid #667eea',
            borderRadius: '30px',
            fontWeight: 'bold',
            fontSize: '16px',
            cursor: 'pointer',
            transition: 'transform 0.2s',
          }} onMouseOver={e => e.target.style.transform = 'translateY(-2px)'}
             onMouseOut={e => e.target.style.transform = 'translateY(0)'}>Get Started</button>
        </div>
      </div>
    </div>
  )
}
