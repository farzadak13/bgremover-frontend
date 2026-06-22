'use client'
import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'
import styles from './dashboard.module.css'

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [files, setFiles] = useState([])
  const [results, setResults] = useState([])
  const [processing, setProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [model, setModel] = useState('u2net')
  const [bgColor, setBgColor] = useState('transparent')
  const [customColor, setCustomColor] = useState('#ffffff')
  const [dragging, setDragging] = useState(false)
  const fileRef = useRef()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) { router.push('/login'); return }
      setUser(session.user)
      fetchProfile(session.user.id)
    })
  }, [])

  const fetchProfile = async (uid) => {
    const { data } = await supabase.from('profiles').select('*').eq('id', uid).single()
    setProfile(data)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const handleFiles = (newFiles) => {
    const valid = Array.from(newFiles).filter(f =>
      ['image/png','image/jpeg','image/webp'].includes(f.type)
    )
    setFiles(prev => [...prev, ...valid])
    setResults([])
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    handleFiles(e.dataTransfer.files)
  }

  const removeFile = (i) => setFiles(prev => prev.filter((_, idx) => idx !== i))

  const processImages = async () => {
    if (!files.length) return
    setProcessing(true)
    setResults([])
    setProgress(0)

    const { data: { session } } = await supabase.auth.getSession()
    const token = session.access_token
    const newResults = []

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const formData = new FormData()
      formData.append('file', file)

      const color = bgColor === 'custom' ? customColor : bgColor

      try {
        const res = await fetch(`${BACKEND}/remove-bg?model=${model}&bg_color=${color}`, {
          method: 'POST',
          headers: { authorization: `Bearer ${token}` },
          body: formData,
        })

        if (res.status === 402) {
          alert('اعتبار شما تمام شده است. لطفاً اشتراک تهیه کنید.')
          break
        }

        if (!res.ok) throw new Error('خطا در پردازش')

        const blob = await res.blob()
        const url = URL.createObjectURL(blob)
        newResults.push({ name: file.name.replace(/\.[^.]+$/, '_nobg.png'), url, blob })

      } catch (err) {
        newResults.push({ name: file.name, error: true })
      }

      setProgress(Math.round(((i + 1) / files.length) * 100))
    }

    setResults(newResults)
    setProcessing(false)
    fetchProfile(user.id)
  }

  const downloadAll = () => {
    results.filter(r => !r.error).forEach(r => {
      const a = document.createElement('a')
      a.href = r.url
      a.download = r.name
      a.click()
    })
  }

  const models = [
    { value: 'u2net', label: 'عمومی (u2net)' },
    { value: 'u2netp', label: 'سریع (u2netp)' },
    { value: 'u2net_human_seg', label: 'پرتره انسانی' },
    { value: 'birefnet-general', label: 'BiRefNet (دقیق‌ترین)' },
    { value: 'birefnet-portrait', label: 'BiRefNet پرتره' },
    { value: 'isnet-anime', label: 'انیمه' },
  ]

  return (
    <div className={styles.page}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarLogo}>✂️ BgRemover</div>
        <nav className={styles.sidebarNav}>
          <a className={`${styles.navItem} ${styles.navActive}`}>🖼️ حذف پس‌زمینه</a>
          <a className={styles.navItem}>📋 تاریخچه</a>
          <a className={styles.navItem}>💳 اشتراک</a>
        </nav>
        <div className={styles.sidebarBottom}>
          {profile && (
            <div className={styles.creditsBox}>
              <div className={styles.creditsNum}>{profile.credits}</div>
              <div className={styles.creditsLabel}>اعتبار باقی‌مانده</div>
              <div className={styles.creditsBar}>
                <div className={styles.creditsBarFill} style={{width: `${Math.min(100, (profile.credits/10)*100)}%`}} />
              </div>
            </div>
          )}
          <button onClick={handleLogout} className={styles.logoutBtn}>خروج</button>
        </div>
      </aside>

      {/* Main */}
      <main className={styles.main}>
        <div className={styles.topBar}>
          <h1 className={styles.pageTitle}>حذف پس‌زمینه</h1>
          <div className={styles.userInfo}>
            <span className={styles.userEmail}>{user?.email}</span>
          </div>
        </div>

        <div className={styles.content}>
          {/* Upload + Settings */}
          <div className={styles.leftPanel}>
            {/* Upload Zone */}
            <div
              className={`${styles.uploadZone} ${dragging ? styles.dragging : ''}`}
              onDragOver={e => { e.preventDefault(); setDragging(true) }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileRef.current.click()}
            >
              <input
                ref={fileRef}
                type="file"
                multiple
                accept="image/*"
                style={{display:'none'}}
                onChange={e => handleFiles(e.target.files)}
              />
              <div className={styles.uploadIcon}>📁</div>
              <div className={styles.uploadText}>
                {dragging ? 'رها کن!' : 'کلیک کن یا عکس‌ها رو اینجا بکش'}
              </div>
              <div className={styles.uploadSub}>PNG، JPG، WebP پشتیبانی می‌شوند</div>
            </div>

            {/* File list */}
            {files.length > 0 && (
              <div className={styles.fileList}>
                {files.map((f, i) => (
                  <div key={i} className={styles.fileItem}>
                    <span className={styles.fileName}>{f.name}</span>
                    <button onClick={() => removeFile(i)} className={styles.removeFile}>✕</button>
                  </div>
                ))}
              </div>
            )}

            {/* Settings */}
            <div className={styles.settingsBox}>
              <div className={styles.settingRow}>
                <label>مدل هوش مصنوعی</label>
                <select value={model} onChange={e => setModel(e.target.value)} className={styles.select}>
                  {models.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                </select>
              </div>
              <div className={styles.settingRow}>
                <label>پس‌زمینه خروجی</label>
                <select value={bgColor} onChange={e => setBgColor(e.target.value)} className={styles.select}>
                  <option value="transparent">شفاف (PNG)</option>
                  <option value="white">سفید</option>
                  <option value="custom">رنگ دلخواه</option>
                </select>
              </div>
              {bgColor === 'custom' && (
                <div className={styles.settingRow}>
                  <label>انتخاب رنگ</label>
                  <input type="color" value={customColor} onChange={e => setCustomColor(e.target.value)} className={styles.colorPicker} />
                </div>
              )}
            </div>

            {/* Process button */}
            <button
              onClick={processImages}
              disabled={!files.length || processing}
              className={styles.processBtn}
            >
              {processing ? `در حال پردازش... ${progress}%` : `✂️ حذف پس‌زمینه (${files.length} عکس)`}
            </button>

            {processing && (
              <div className={styles.progressBar}>
                <div className={styles.progressFill} style={{width: `${progress}%`}} />
              </div>
            )}
          </div>

          {/* Results */}
          <div className={styles.rightPanel}>
            <div className={styles.resultsHeader}>
              <h2 className={styles.resultsTitle}>نتایج</h2>
              {results.filter(r => !r.error).length > 1 && (
                <button onClick={downloadAll} className={styles.downloadAllBtn}>
                  ⬇️ دانلود همه
                </button>
              )}
            </div>

            {results.length === 0 && !processing && (
              <div className={styles.emptyResult}>
                <div style={{fontSize:'3rem'}}>🖼️</div>
                <p>نتایج اینجا نمایش داده می‌شوند</p>
              </div>
            )}

            <div className={styles.resultGrid}>
              {results.map((r, i) => (
                <div key={i} className={styles.resultCard}>
                  {r.error ? (
                    <div className={styles.resultError}>❌ خطا در پردازش</div>
                  ) : (
                    <>
                      <div className={styles.resultImgWrap}>
                        <img src={r.url} alt={r.name} className={styles.resultImg} />
                      </div>
                      <div className={styles.resultName}>{r.name}</div>
                      <a href={r.url} download={r.name} className={styles.downloadBtn}>
                        ⬇️ دانلود
                      </a>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
