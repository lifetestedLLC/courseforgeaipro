import Link from 'next/link'

export default function Subscription() {
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
            Subscription Plans
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

        <p style={{
          fontSize: '1.2rem',
          textAlign: 'center',
          marginBottom: '3rem',
          opacity: 0.9
        }}>
          Choose the perfect plan for your learning journey
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2rem',
          marginBottom: '3rem'
        }}>
          {/* Free Plan */}
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            borderRadius: '12px',
            padding: '2rem',
            boxShadow: '0 4px 6px rgba(0,0,0,0.2)',
            border: '2px solid rgba(255, 255, 255, 0.2)'
          }}>
            <h2 style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>
              Free
            </h2>
            <div style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
              $0
              <span style={{ fontSize: '1rem', fontWeight: 'normal', opacity: 0.8 }}>
                /month
              </span>
            </div>
            <p style={{ opacity: 0.9, marginBottom: '1.5rem' }}>
              Get started with basic features
            </p>
            
            <ul style={{ listStyle: 'none', padding: 0, marginBottom: '2rem' }}>
              <li style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'center' }}>
                <span style={{ marginRight: '0.5rem' }}>✓</span>
                3 courses per month
              </li>
              <li style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'center' }}>
                <span style={{ marginRight: '0.5rem' }}>✓</span>
                Basic AI generation
              </li>
              <li style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'center' }}>
                <span style={{ marginRight: '0.5rem' }}>✓</span>
                Community support
              </li>
              <li style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'center', opacity: 0.5 }}>
                <span style={{ marginRight: '0.5rem' }}>✗</span>
                Advanced analytics
              </li>
              <li style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'center', opacity: 0.5 }}>
                <span style={{ marginRight: '0.5rem' }}>✗</span>
                Priority support
              </li>
            </ul>

            <button style={{
              width: '100%',
              backgroundColor: 'rgba(255, 255, 255, 0.3)',
              color: 'white',
              border: 'none',
              padding: '0.875rem',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              borderRadius: '8px',
              cursor: 'pointer'
            }}>
              Current Plan
            </button>
          </div>

          {/* Pro Plan */}
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(10px)',
            borderRadius: '12px',
            padding: '2rem',
            boxShadow: '0 8px 12px rgba(0,0,0,0.3)',
            border: '2px solid white',
            position: 'relative'
          }}>
            <div style={{
              position: 'absolute',
              top: '-12px',
              right: '20px',
              backgroundColor: '#FFD700',
              color: '#333',
              padding: '0.25rem 0.75rem',
              borderRadius: '12px',
              fontSize: '0.85rem',
              fontWeight: 'bold'
            }}>
              POPULAR
            </div>
            
            <h2 style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>
              Pro
            </h2>
            <div style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
              $19
              <span style={{ fontSize: '1rem', fontWeight: 'normal', opacity: 0.8 }}>
                /month
              </span>
            </div>
            <p style={{ opacity: 0.9, marginBottom: '1.5rem' }}>
              Perfect for serious learners
            </p>
            
            <ul style={{ listStyle: 'none', padding: 0, marginBottom: '2rem' }}>
              <li style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'center' }}>
                <span style={{ marginRight: '0.5rem' }}>✓</span>
                Unlimited courses
              </li>
              <li style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'center' }}>
                <span style={{ marginRight: '0.5rem' }}>✓</span>
                Advanced AI generation
              </li>
              <li style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'center' }}>
                <span style={{ marginRight: '0.5rem' }}>✓</span>
                Priority support
              </li>
              <li style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'center' }}>
                <span style={{ marginRight: '0.5rem' }}>✓</span>
                Advanced analytics
              </li>
              <li style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'center' }}>
                <span style={{ marginRight: '0.5rem' }}>✓</span>
                Custom branding
              </li>
            </ul>

            <button style={{
              width: '100%',
              backgroundColor: 'white',
              color: '#667eea',
              border: 'none',
              padding: '0.875rem',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              borderRadius: '8px',
              cursor: 'pointer',
              boxShadow: '0 4px 6px rgba(0,0,0,0.2)'
            }}>
              Upgrade to Pro
            </button>
          </div>

          {/* Enterprise Plan */}
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            borderRadius: '12px',
            padding: '2rem',
            boxShadow: '0 4px 6px rgba(0,0,0,0.2)',
            border: '2px solid rgba(255, 255, 255, 0.2)'
          }}>
            <h2 style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>
              Enterprise
            </h2>
            <div style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
              $99
              <span style={{ fontSize: '1rem', fontWeight: 'normal', opacity: 0.8 }}>
                /month
              </span>
            </div>
            <p style={{ opacity: 0.9, marginBottom: '1.5rem' }}>
              For teams and organizations
            </p>
            
            <ul style={{ listStyle: 'none', padding: 0, marginBottom: '2rem' }}>
              <li style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'center' }}>
                <span style={{ marginRight: '0.5rem' }}>✓</span>
                Everything in Pro
              </li>
              <li style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'center' }}>
                <span style={{ marginRight: '0.5rem' }}>✓</span>
                Team collaboration
              </li>
              <li style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'center' }}>
                <span style={{ marginRight: '0.5rem' }}>✓</span>
                Dedicated support
              </li>
              <li style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'center' }}>
                <span style={{ marginRight: '0.5rem' }}>✓</span>
                API access
              </li>
              <li style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'center' }}>
                <span style={{ marginRight: '0.5rem' }}>✓</span>
                Custom integrations
              </li>
            </ul>

            <button style={{
              width: '100%',
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              color: '#667eea',
              border: 'none',
              padding: '0.875rem',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              borderRadius: '8px',
              cursor: 'pointer'
            }}>
              Contact Sales
            </button>
          </div>
        </div>

        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          borderRadius: '12px',
          padding: '2rem',
          boxShadow: '0 4px 6px rgba(0,0,0,0.2)',
          textAlign: 'center'
        }}>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
            Frequently Asked Questions
          </h3>
          <div style={{ display: 'grid', gap: '1rem', textAlign: 'left', maxWidth: '800px', margin: '0 auto' }}>
            <div>
              <div style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>
                Can I change my plan later?
              </div>
              <div style={{ opacity: 0.9, fontSize: '0.95rem' }}>
                Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.
              </div>
            </div>
            <div>
              <div style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>
                What payment methods do you accept?
              </div>
              <div style={{ opacity: 0.9, fontSize: '0.95rem' }}>
                We accept all major credit cards, PayPal, and bank transfers for Enterprise plans.
              </div>
            </div>
            <div>
              <div style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>
                Is there a refund policy?
              </div>
              <div style={{ opacity: 0.9, fontSize: '0.95rem' }}>
                Yes, we offer a 30-day money-back guarantee on all paid plans.
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
