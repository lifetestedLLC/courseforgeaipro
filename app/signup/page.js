import Link from 'next/link'

export default function SignUp() {
  return (
    <main style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '2rem',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      color: 'white'
    }}>
      <div style={{
        maxWidth: '450px',
        width: '100%'
      }}>
        <div style={{
          textAlign: 'center',
          marginBottom: '2rem'
        }}>
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: 'bold',
            marginBottom: '0.5rem',
            textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
          }}>
            Create Account
          </h1>
          <p style={{ fontSize: '1.1rem', opacity: 0.9 }}>
            Start your learning journey today
          </p>
        </div>

        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          borderRadius: '12px',
          padding: '2rem',
          boxShadow: '0 4px 6px rgba(0,0,0,0.2)'
        }}>
          <form>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontSize: '1rem',
                fontWeight: '500'
              }}>
                Full Name
              </label>
              <input
                type="text"
                placeholder="John Doe"
                required
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
                fontSize: '1rem',
                fontWeight: '500'
              }}>
                Email Address
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                required
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
                fontSize: '1rem',
                fontWeight: '500'
              }}>
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                required
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
                fontSize: '1rem',
                fontWeight: '500'
              }}>
                Confirm Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                required
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
              <label style={{ display: 'flex', alignItems: 'flex-start', cursor: 'pointer', fontSize: '0.9rem' }}>
                <input type="checkbox" required style={{ marginRight: '0.5rem', marginTop: '0.2rem' }} />
                <span>
                  I agree to the{' '}
                  <Link href="#" style={{ color: 'white', textDecoration: 'underline' }}>
                    Terms of Service
                  </Link>
                  {' '}and{' '}
                  <Link href="#" style={{ color: 'white', textDecoration: 'underline' }}>
                    Privacy Policy
                  </Link>
                </span>
              </label>
            </div>

            <button
              type="submit"
              style={{
                width: '100%',
                backgroundColor: 'white',
                color: '#667eea',
                border: 'none',
                padding: '0.875rem',
                fontSize: '1.1rem',
                fontWeight: 'bold',
                borderRadius: '8px',
                cursor: 'pointer',
                boxShadow: '0 4px 6px rgba(0,0,0,0.2)',
                transition: 'transform 0.2s'
              }}
            >
              Create Account
            </button>
          </form>

          <div style={{
            marginTop: '1.5rem',
            textAlign: 'center',
            fontSize: '0.95rem'
          }}>
            <p>
              Already have an account?{' '}
              <Link href="/login" style={{ color: 'white', fontWeight: 'bold', textDecoration: 'underline' }}>
                Sign in
              </Link>
            </p>
          </div>
        </div>

        <div style={{
          textAlign: 'center',
          marginTop: '1.5rem'
        }}>
          <Link href="/" style={{
            color: 'white',
            textDecoration: 'none',
            fontSize: '0.95rem',
            opacity: 0.8
          }}>
            ← Back to Home
          </Link>
        </div>
      </div>
    </main>
  )
}
