import Link from 'next/link'

export default function CreateCourse() {
  return (
    <main style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '2rem',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      color: 'white'
    }}>
      <div style={{
        maxWidth: '800px',
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
            Create New Course
          </h1>
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

        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          borderRadius: '12px',
          padding: '2rem',
          boxShadow: '0 4px 6px rgba(0,0,0,0.2)',
          marginBottom: '2rem'
        }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>
            AI Course Generator
          </h2>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '0.5rem',
              fontSize: '1.1rem',
              fontWeight: 'bold'
            }}>
              Course Title
            </label>
            <input 
              type="text"
              placeholder="e.g., Introduction to Web Development"
              style={{
                width: '100%',
                padding: '0.75rem',
                fontSize: '1rem',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                color: '#333'
              }}
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '0.5rem',
              fontSize: '1.1rem',
              fontWeight: 'bold'
            }}>
              Course Description
            </label>
            <textarea 
              placeholder="Describe what this course will teach..."
              rows="4"
              style={{
                width: '100%',
                padding: '0.75rem',
                fontSize: '1rem',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                color: '#333',
                resize: 'vertical'
              }}
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '0.5rem',
              fontSize: '1.1rem',
              fontWeight: 'bold'
            }}>
              Difficulty Level
            </label>
            <select style={{
              width: '100%',
              padding: '0.75rem',
              fontSize: '1rem',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              color: '#333'
            }}>
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
            </select>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '0.5rem',
              fontSize: '1.1rem',
              fontWeight: 'bold'
            }}>
              Number of Lessons
            </label>
            <input 
              type="number"
              placeholder="10"
              min="1"
              max="50"
              defaultValue="10"
              style={{
                width: '100%',
                padding: '0.75rem',
                fontSize: '1rem',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                color: '#333'
              }}
            />
          </div>

          <button style={{
            width: '100%',
            backgroundColor: 'white',
            color: '#667eea',
            border: 'none',
            padding: '1rem',
            fontSize: '1.2rem',
            fontWeight: 'bold',
            borderRadius: '8px',
            cursor: 'pointer',
            boxShadow: '0 4px 6px rgba(0,0,0,0.2)',
            transition: 'transform 0.2s'
          }}>
            ✨ Generate Course with AI
          </button>
        </div>

        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          borderRadius: '12px',
          padding: '1.5rem',
          boxShadow: '0 4px 6px rgba(0,0,0,0.2)',
          fontSize: '0.95rem',
          opacity: 0.9
        }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '0.75rem' }}>
            ℹ️ How it works:
          </h3>
          <p style={{ marginBottom: '0.5rem' }}>
            Our AI will analyze your requirements and generate a complete course structure with:
          </p>
          <ul style={{ marginLeft: '1.5rem', marginTop: '0.5rem' }}>
            <li>Organized lesson plans</li>
            <li>Learning objectives</li>
            <li>Practice exercises</li>
            <li>Assessment materials</li>
          </ul>
        </div>
      </div>
    </main>
  )
}
