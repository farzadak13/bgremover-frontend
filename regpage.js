'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'
import styles from '../login/auth.module.css'

export default function Register() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleRegister = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } }
    })

    if (error) {
      setError(error.message === 'User already registered' ? 'این ایمیل قبلاً ثبت شده' : 'خطا در ثبت‌نام')
      setLoading(false)
    } else {
      setSuccess(true)
      setTimeout(() => router.push('/dashboard'), 2000)
    }
  }

  if (success) {
    return (
      <div className={styles.container}>
        <div className={styles.card} style={{textAlign:'center'}}>
          <div style={{fontSize:'3rem',marginBottom:'1rem'}}>✅</div>
          <h2>ثبت‌نام موفق!</h2>
          <p style={{color:'var(--muted)',marginTop:'.5rem'}}>در حال انتقال به داشبورد...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <a href="/" className={styles.logo}>✂️ BgRemover</a>
        <h1 className={styles.title}>ثبت‌نام رایگان</h1>
        <p className={styles.sub}>۱۰ عکس رایگان هدیه می‌گیری 🎁</p>

        <form onSubmit={handleRegister} className={styles.form}>
          <div className={styles.field}>
            <label>نام</label>
            <input
              type="text"
              placeholder="نام شما"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
          </div>
          <div className={styles.field}>
            <label>ایمیل</label>
            <input
              type="email"
              placeholder="example@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div className={styles.field}>
            <label>رمز عبور</label>
            <input
              type="password"
              placeholder="حداقل ۶ کاراکتر"
              value={password}
              onChange={e => setPassword(e.target.value)}
              minLength={6}
              required
            />
          </div>

          {error && <div className={styles.error}>{error}</div>}

          <button type="submit" className={styles.btn} disabled={loading}>
            {loading ? 'در حال ثبت‌نام...' : 'ثبت‌نام ←'}
          </button>
        </form>

        <p className={styles.switch}>
          حساب داری؟ <a href="/login">وارد شو</a>
        </p>
      </div>
    </div>
  )
}
