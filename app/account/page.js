import Link from 'next/link'

export default function Account() {
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
            My Account
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
          display: 'grid',
          gap: '1.5rem'
        }}>
          {/* Profile Information */}
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            borderRadius: '12px',
            padding: '2rem',
            boxShadow: '0 4px 6px rgba(0,0,0,0.2)'
          }}>
            <h2 style={{ fontSize: '1.8rem', marginBottom: '1.5rem' }}>
              Profile Information
            </h2>
            
            <div style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '2rem'
            }}>
              <div style={{
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2.5rem',
                marginRight: '1.5rem'
              }}>
                👤
              </div>
              <div>
                <button style={{
                  backgroundColor: 'white',
                  color: '#667eea',
                  border: 'none',
                  padding: '0.5rem 1rem',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  marginRight: '0.5rem'
                }}>
                  Change Photo
                </button>
                <button style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  border: 'none',
                  padding: '0.5rem 1rem',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}>
                  Remove
                </button>
              </div>
            </div>

            <div style={{ display: 'grid', gap: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                  Full Name
                </label>
                <input
                  type="text"
                  defaultValue="John Doe"
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

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                  Email Address
                </label>
                <input
                  type="email"
                  defaultValue="john.doe@example.com"
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

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                  Bio
                </label>
                <textarea
                  rows="3"
                  placeholder="Tell us about yourself..."
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
            </div>

            <button style={{
              marginTop: '1.5rem',
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
              Save Changes
            </button>
          </div>

          {/* Account Settings */}
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            borderRadius: '12px',
            padding: '2rem',
            boxShadow: '0 4px 6px rgba(0,0,0,0.2)'
          }}>
            <h2 style={{ fontSize: '1.8rem', marginBottom: '1.5rem' }}>
              Account Settings
            </h2>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingBottom: '1rem',
              borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
              marginBottom: '1rem'
            }}>
              <div>
                <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>
                  Change Password
                </div>
                <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>
                  Update your password regularly for security
                </div>
              </div>
              <Link href="/settings" style={{
                color: 'white',
                textDecoration: 'none',
                padding: '0.5rem 1rem',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '6px',
                fontWeight: '500'
              }}>
                Update
              </Link>
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingBottom: '1rem',
              borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
              marginBottom: '1rem'
            }}>
              <div>
                <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>
                  Subscription Plan
                </div>
                <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>
                  Free Plan - Upgrade for more features
                </div>
              </div>
              <Link href="/subscription" style={{
                color: '#667eea',
                backgroundColor: 'white',
                textDecoration: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '6px',
                fontWeight: 'bold'
              }}>
                Upgrade
              </Link>
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>
                  Delete Account
                </div>
                <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>
                  Permanently delete your account and data
                </div>
              </div>
              <button style={{
                color: 'white',
                backgroundColor: 'rgba(220, 38, 38, 0.8)',
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '500'
              }}>
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
