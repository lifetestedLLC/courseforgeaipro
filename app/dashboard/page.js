import Link from 'next/link'

export default function Dashboard() {
  return (
    <main style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '2rem',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      color: 'white'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem'
        }}>
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: 'bold',
            textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
          }}>
            Dashboard
          </h1>
          <Link href="/" style={{
            color: 'white',
            textDecoration: 'none',
            padding: '0.5rem 1rem',
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '6px',
            transition: 'background-color 0.2s'
          }}>
            ← Back to Home
          </Link>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            borderRadius: '12px',
            padding: '2rem',
            boxShadow: '0 4px 6px rgba(0,0,0,0.2)'
          }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
              📚 My Courses
            </h2>
            <p style={{ opacity: 0.9, marginBottom: '1rem' }}>
              View and manage your courses
            </p>
            <Link href="/courses" style={{
              display: 'inline-block',
              color: '#667eea',
              backgroundColor: 'white',
              padding: '0.75rem 1.5rem',
              borderRadius: '6px',
              textDecoration: 'none',
              fontWeight: 'bold',
              transition: 'transform 0.2s'
            }}>
              View Courses
            </Link>
          </div>

          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            borderRadius: '12px',
            padding: '2rem',
            boxShadow: '0 4px 6px rgba(0,0,0,0.2)'
          }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
              ✨ Create New Course
            </h2>
            <p style={{ opacity: 0.9, marginBottom: '1rem' }}>
              Use AI to generate a new course
            </p>
            <Link href="/create-course" style={{
              display: 'inline-block',
              color: '#667eea',
              backgroundColor: 'white',
              padding: '0.75rem 1.5rem',
              borderRadius: '6px',
              textDecoration: 'none',
              fontWeight: 'bold',
              transition: 'transform 0.2s'
            }}>
              Create Course
            </Link>
          </div>

          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            borderRadius: '12px',
            padding: '2rem',
            boxShadow: '0 4px 6px rgba(0,0,0,0.2)'
          }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
              📊 Analytics
            </h2>
            <p style={{ opacity: 0.9, marginBottom: '1rem' }}>
              Track your learning progress
            </p>
            <Link href="/analytics" style={{
              display: 'inline-block',
              color: '#667eea',
              backgroundColor: 'white',
              padding: '0.75rem 1.5rem',
              borderRadius: '6px',
              textDecoration: 'none',
              fontWeight: 'bold',
              transition: 'transform 0.2s'
            }}>
              View Analytics
            </Link>
          </div>
        </div>

        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          borderRadius: '12px',
          padding: '2rem',
          boxShadow: '0 4px 6px rgba(0,0,0,0.2)'
        }}>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>
            Quick Stats
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '1rem'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>0</div>
              <div style={{ opacity: 0.8, fontSize: '0.9rem' }}>Courses Created</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>0</div>
              <div style={{ opacity: 0.8, fontSize: '0.9rem' }}>Lessons Completed</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>0%</div>
              <div style={{ opacity: 0.8, fontSize: '0.9rem' }}>Progress</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>0h</div>
              <div style={{ opacity: 0.8, fontSize: '0.9rem' }}>Learning Time</div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
