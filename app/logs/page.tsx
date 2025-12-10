'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import styles from '../page.module.css'

interface ApiResponse {
  success: boolean
  data?: any
  error?: string
}

export default function LogsPage() {
  const router = useRouter()
  const [logs, setLogs] = useState<Record<string, ApiResponse>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // localStorage에서 로그 데이터 가져오기
    const storedLogs = localStorage.getItem('instagram_api_logs')
    if (storedLogs) {
      try {
        setLogs(JSON.parse(storedLogs))
      } catch (e) {
        console.error('Failed to parse logs:', e)
      }
    }
    setLoading(false)
  }, [])

  const clearLogs = () => {
    localStorage.removeItem('instagram_api_logs')
    setLogs({})
  }

  if (loading) {
    return (
      <main className={styles.main}>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p style={{ color: '#666666' }}>Loading...</p>
        </div>
      </main>
    )
  }

  return (
    <main className={styles.main}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 className={styles.title} style={{ marginBottom: 0 }}>API Logs</h1>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={() => router.push('/')}
            className={styles.buttonSecondary}
          >
            ← Back to Main
          </button>
          <button
            onClick={clearLogs}
            className={styles.buttonSecondary}
            style={{ borderColor: '#ff4444', color: '#ff4444' }}
          >
            Clear Logs
          </button>
        </div>
      </div>

      {Object.keys(logs).length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '3rem',
          background: 'linear-gradient(135deg, #f8f8f8 0%, #ffffff 100%)',
          borderRadius: '12px',
          border: '1px solid rgba(0, 0, 0, 0.08)'
        }}>
          <p style={{ color: '#666666', fontSize: '1.1rem' }}>
            No logs saved.
          </p>
          <p style={{ color: '#999999', fontSize: '0.9rem', marginTop: '0.5rem' }}>
            Logs will appear here when you test APIs on the main page.
          </p>
        </div>
      ) : (
        <div className={styles.grid}>
          {Object.entries(logs).map(([platform, log]) => (
            <div key={platform} className={styles.card}>
              <div className={styles.cardHeader}>
                <h2 style={{ color: '#1a1a1a' }}>{platform.toUpperCase()}</h2>
                <span
                  className={`${styles.status} ${
                    log.success ? styles.success : styles.error
                  }`}
                >
                  {log.success ? '✓ Success' : '✗ Failed'}
                </span>
              </div>

              <div className={styles.result}>
                <pre className={styles.code}>
                  {JSON.stringify(log, null, 2)}
                </pre>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}

