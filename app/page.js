import Link from 'next/link'
import GetStartedButton from './components/GetStartedButton'

export default function Home() {
  return (
    <main style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white'
    }}>
      <div style={{
        position: 'absolute',
        top: '2rem',
        right: '2rem',
        display: 'flex',
        gap: '1rem'
      }}>
        <Link href="/login" style={{
          color: 'white',
          textDecoration: 'none',
          padding: '0.5rem 1.5rem',
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
          borderRadius: '6px',
          fontWeight: '500',
          transition: 'background-color 0.2s'
        }}>
          Login
        </Link>
        <Link href="/signup" style={{
          color: '#667eea',
          backgroundColor: 'white',
          textDecoration: 'none',
          padding: '0.5rem 1.5rem',
          borderRadius: '6px',
          fontWeight: 'bold',
          transition: 'transform 0.2s'
        }}>
          Sign Up
        </Link>
      </div>

      <div style={{
        maxWidth: '800px',
        textAlign: 'center'
      }}>
        <h1 style={{
          fontSize: '3.5rem',
          fontWeight: 'bold',
          marginBottom: '1rem',
          textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
        }}>
          CourseForge AI Pro
        </h1>
        
        <p style={{
          fontSize: '1.5rem',
          marginBottom: '2rem',
          opacity: 0.9
        }}>
          AI-Powered Course Creation Platform
        </p>
        
        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          borderRadius: '12px',
          padding: '2rem',
          marginBottom: '2rem'
        }}>
          <h2 style={{
            fontSize: '1.8rem',
            marginBottom: '1rem'
          }}>
            Features
          </h2>
          
          <ul style={{
            listStyle: 'none',
            padding: 0,
            textAlign: 'left'
          }}>
            <li style={{ marginBottom: '0.8rem', fontSize: '1.1rem' }}>
              ✨ AI-Powered Course Generation
            </li>
            <li style={{ marginBottom: '0.8rem', fontSize: '1.1rem' }}>
              📚 Comprehensive Content Management
            </li>
            <li style={{ marginBottom: '0.8rem', fontSize: '1.1rem' }}>
              🎯 Smart Learning Paths
            </li>
            <li style={{ marginBottom: '0.8rem', fontSize: '1.1rem' }}>
              📊 Progress Tracking & Analytics
            </li>
          </ul>
        </div>
        
        <GetStartedButton />
        
        <div style={{
          marginTop: '3rem',
          fontSize: '0.9rem',
          opacity: 0.7
        }}>
          <p>Built with Next.js and React</p>
          <p>Version 1.0.0</p>
        </div>
      </div>
    </main>
  )
}
