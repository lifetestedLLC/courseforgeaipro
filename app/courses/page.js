import Link from 'next/link'

export default function Courses() {
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
            My Courses
          </h1>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Link href="/create-course" style={{
              color: 'white',
              textDecoration: 'none',
              padding: '0.5rem 1rem',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '6px'
            }}>
              + Create New
            </Link>
            <Link href="/dashboard" style={{
              color: 'white',
              textDecoration: 'none',
              padding: '0.5rem 1rem',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '6px'
            }}>
              ← Dashboard
            </Link>
          </div>
        </div>

        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          borderRadius: '12px',
          padding: '3rem',
          boxShadow: '0 4px 6px rgba(0,0,0,0.2)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📚</div>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>
            No Courses Yet
          </h2>
          <p style={{ opacity: 0.9, marginBottom: '2rem', fontSize: '1.1rem' }}>
            Start by creating your first AI-powered course
          </p>
          <Link href="/create-course" style={{
            display: 'inline-block',
            color: '#667eea',
            backgroundColor: 'white',
            padding: '1rem 2rem',
            borderRadius: '8px',
            textDecoration: 'none',
            fontWeight: 'bold',
            fontSize: '1.1rem',
            transition: 'transform 0.2s',
            boxShadow: '0 4px 6px rgba(0,0,0,0.2)'
          }}>
            Create Your First Course
          </Link>
        </div>

        <div style={{
          marginTop: '2rem',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          borderRadius: '12px',
          padding: '2rem',
          boxShadow: '0 4px 6px rgba(0,0,0,0.2)'
        }}>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
            What you can do with courses:
          </h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={{ marginBottom: '0.8rem', fontSize: '1.1rem' }}>
              ✨ Generate courses using AI
            </li>
            <li style={{ marginBottom: '0.8rem', fontSize: '1.1rem' }}>
              📝 Edit and customize content
            </li>
            <li style={{ marginBottom: '0.8rem', fontSize: '1.1rem' }}>
              📊 Track student progress
            </li>
            <li style={{ marginBottom: '0.8rem', fontSize: '1.1rem' }}>
              🎯 Create learning paths
            </li>
            <li style={{ marginBottom: '0.8rem', fontSize: '1.1rem' }}>
              🔄 Share with others
            </li>
          </ul>
        </div>
      </div>
    </main>
  )
}
