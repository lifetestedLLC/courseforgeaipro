import Link from 'next/link'

export default function Settings() {
  return (
    <main style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '2rem',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      color: 'white'
    }}>
      <div style={{
        maxWidth: '900px',
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
            Settings
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

        <div style={{ display: 'grid', gap: '1.5rem' }}>
          {/* Security */}
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            borderRadius: '12px',
            padding: '2rem',
            boxShadow: '0 4px 6px rgba(0,0,0,0.2)'
          }}>
            <h2 style={{ fontSize: '1.8rem', marginBottom: '1.5rem' }}>
              🔒 Security
            </h2>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                Current Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
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
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                New Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
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
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                Confirm New Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
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
              backgroundColor: 'white',
              color: '#667eea',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '1rem',
              boxShadow: '0 4px 6px rgba(0,0,0,0.2)'
            }}>
              Update Password
            </button>

            <div style={{
              marginTop: '2rem',
              paddingTop: '1.5rem',
              borderTop: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>
                    Two-Factor Authentication
                  </div>
                  <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>
                    Add an extra layer of security to your account
                  </div>
                </div>
                <button style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  border: 'none',
                  padding: '0.5rem 1rem',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: '500'
                }}>
                  Enable
                </button>
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            borderRadius: '12px',
            padding: '2rem',
            boxShadow: '0 4px 6px rgba(0,0,0,0.2)'
          }}>
            <h2 style={{ fontSize: '1.8rem', marginBottom: '1.5rem' }}>
              🔔 Notifications
            </h2>

            <div style={{ display: 'grid', gap: '1rem' }}>
              <label style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                cursor: 'pointer',
                padding: '1rem',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '8px'
              }}>
                <div>
                  <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>
                    Email Notifications
                  </div>
                  <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>
                    Receive updates via email
                  </div>
                </div>
                <input type="checkbox" defaultChecked style={{ width: '20px', height: '20px' }} />
              </label>

              <label style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                cursor: 'pointer',
                padding: '1rem',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '8px'
              }}>
                <div>
                  <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>
                    Course Updates
                  </div>
                  <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>
                    Get notified about course changes
                  </div>
                </div>
                <input type="checkbox" defaultChecked style={{ width: '20px', height: '20px' }} />
              </label>

              <label style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                cursor: 'pointer',
                padding: '1rem',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '8px'
              }}>
                <div>
                  <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>
                    Marketing Emails
                  </div>
                  <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>
                    Receive tips and promotional content
                  </div>
                </div>
                <input type="checkbox" style={{ width: '20px', height: '20px' }} />
              </label>

              <label style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                cursor: 'pointer',
                padding: '1rem',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '8px'
              }}>
                <div>
                  <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>
                    Weekly Progress Reports
                  </div>
                  <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>
                    Get weekly summaries of your learning
                  </div>
                </div>
                <input type="checkbox" defaultChecked style={{ width: '20px', height: '20px' }} />
              </label>
            </div>
          </div>

          {/* Preferences */}
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            borderRadius: '12px',
            padding: '2rem',
            boxShadow: '0 4px 6px rgba(0,0,0,0.2)'
          }}>
            <h2 style={{ fontSize: '1.8rem', marginBottom: '1.5rem' }}>
              ⚙️ Preferences
            </h2>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                Language
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
                <option>English</option>
                <option>Spanish</option>
                <option>French</option>
                <option>German</option>
                <option>Chinese</option>
              </select>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                Timezone
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
                <option>UTC</option>
                <option>EST (UTC-5)</option>
                <option>PST (UTC-8)</option>
                <option>GMT</option>
                <option>CET (UTC+1)</option>
              </select>
            </div>

            <button style={{
              backgroundColor: 'white',
              color: '#667eea',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '1rem',
              boxShadow: '0 4px 6px rgba(0,0,0,0.2)'
            }}>
              Save Preferences
            </button>
          </div>

          {/* Quick Links */}
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            borderRadius: '12px',
            padding: '2rem',
            boxShadow: '0 4px 6px rgba(0,0,0,0.2)'
          }}>
            <h2 style={{ fontSize: '1.8rem', marginBottom: '1.5rem' }}>
              🔗 Quick Links
            </h2>

            <div style={{ display: 'grid', gap: '0.75rem' }}>
              <Link href="/account" style={{
                color: 'white',
                textDecoration: 'none',
                padding: '1rem',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '8px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span>My Account</span>
                <span>→</span>
              </Link>

              <Link href="/subscription" style={{
                color: 'white',
                textDecoration: 'none',
                padding: '1rem',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '8px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span>Subscription & Billing</span>
                <span>→</span>
              </Link>

              <Link href="#" style={{
                color: 'white',
                textDecoration: 'none',
                padding: '1rem',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '8px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span>Privacy Policy</span>
                <span>→</span>
              </Link>

              <Link href="#" style={{
                color: 'white',
                textDecoration: 'none',
                padding: '1rem',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '8px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span>Terms of Service</span>
                <span>→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
