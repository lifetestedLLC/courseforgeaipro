'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function GetStartedButton() {
  const [isHovered, setIsHovered] = useState(false)
  const router = useRouter()

  const handleClick = () => {
    router.push('/dashboard')
  }

  return (
    <button
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        backgroundColor: 'white',
        color: '#667eea',
        border: 'none',
        padding: '1rem 2.5rem',
        fontSize: '1.2rem',
        fontWeight: 'bold',
        borderRadius: '8px',
        cursor: 'pointer',
        boxShadow: '0 4px 6px rgba(0,0,0,0.2)',
        transition: 'transform 0.2s, box-shadow 0.2s',
        transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
      }}
    >
      Get Started
    </button>
  )
}
