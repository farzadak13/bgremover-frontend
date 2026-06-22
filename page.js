'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../lib/supabase'
import styles from './page.module.css'

export default function Home() {
  const router = useRouter()
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) router.push('/dashboard')
      else setChecking(false)
    })
  }, [])

  if (checking) return null

  return (
    <main className={styles.main}>
      {/* Navbar */}
      <nav className={styles.nav}>
        <div className={styles.logo}>✂️ BgRemover</div>
        <div className={styles.navLinks}>
          <a href="/login" className={styles.loginBtn}>ورود</a>
          <a href="/register" className={styles.registerBtn}>ثبت‌نام رایگان</a>
        </div>
      </nav>

      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.badge}>🤖 هوش مصنوعی پیشرفته</div>
        <h1 className={styles.heroTitle}>
          پس‌زمینه عکس‌هات رو<br />
          <span className={styles.gradient}>در ثانیه حذف کن</span>
        </h1>
        <p className={styles.heroSub}>
          بدون نیاز به فتوشاپ — فقط آپلود کن و نتیجه بگیر
        </p>
        <div className={styles.heroCta}>
          <a href="/register" className={styles.ctaPrimary}>شروع رایگان ←</a>
          <a href="#pricing" className={styles.ctaSecondary}>مشاهده قیمت‌ها</a>
        </div>

        {/* Demo visual */}
        <div className={styles.demoBox}>
          <div className={styles.demoCard}>
            <div className={styles.demoLabel}>قبل</div>
            <div className={styles.demoImg} style={{background: 'linear-gradient(135deg, #1e1e2e, #2a2a3d)'}}>
              <span style={{fontSize: '4rem'}}>🖼️</span>
            </div>
          </div>
          <div className={styles.demoArrow}>→</div>
          <div className={styles.demoCard}>
            <div className={styles.demoLabel}>بعد</div>
            <div className={styles.demoImg} style={{background: 'repeating-conic-gradient(#1c1c28 0% 25%, #13131a 0% 50%) 0 0 / 20px 20px'}}>
              <span style={{fontSize: '4rem'}}>✨</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className={styles.features}>
        <h2 className={styles.sectionTitle}>چرا BgRemover؟</h2>
        <div className={styles.featureGrid}>
          {[
            { icon: '⚡', title: 'سریع', desc: 'پردازش در کمتر از ۵ ثانیه' },
            { icon: '🎯', title: 'دقیق', desc: 'هوش مصنوعی با دقت بالا' },
            { icon: '🇮🇷', title: 'ایرانی', desc: 'پرداخت ریالی، پشتیبانی فارسی' },
            { icon: '📦', title: 'Bulk', desc: 'پردازش چندین عکس همزمان' },
          ].map(f => (
            <div key={f.title} className={styles.featureCard}>
              <div className={styles.featureIcon}>{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className={styles.pricing} id="pricing">
        <h2 className={styles.sectionTitle}>قیمت‌گذاری ساده</h2>
        <div className={styles.pricingGrid}>
          <div className={styles.pricingCard}>
            <div className={styles.pricingName}>رایگان</div>
            <div className={styles.pricingPrice}>۰ تومان</div>
            <ul className={styles.pricingFeatures}>
              <li>✅ ۱۰ عکس رایگان</li>
              <li>✅ کیفیت استاندارد</li>
              <li>✅ PNG شفاف</li>
            </ul>
            <a href="/register" className={styles.pricingBtn}>شروع کن</a>
          </div>
          <div className={`${styles.pricingCard} ${styles.pricingFeatured}`}>
            <div className={styles.pricingBadge}>پرطرفدار</div>
            <div className={styles.pricingName}>پایه</div>
            <div className={styles.pricingPrice}>۲۹۰,۰۰۰ <span>تومان/ماه</span></div>
            <ul className={styles.pricingFeatures}>
              <li>✅ ۲۰۰ عکس در ماه</li>
              <li>✅ کیفیت بالا</li>
              <li>✅ پس‌زمینه سفارشی</li>
              <li>✅ پردازش Bulk</li>
            </ul>
            <a href="/register" className={styles.pricingBtnFeatured}>خرید اشتراک</a>
          </div>
          <div className={styles.pricingCard}>
            <div className={styles.pricingName}>حرفه‌ای</div>
            <div className={styles.pricingPrice}>۷۹۰,۰۰۰ <span>تومان/ماه</span></div>
            <ul className={styles.pricingFeatures}>
              <li>✅ ۱۰۰۰ عکس در ماه</li>
              <li>✅ API اختصاصی</li>
              <li>✅ همه مدل‌های AI</li>
              <li>✅ پشتیبانی اولویت‌دار</li>
            </ul>
            <a href="/register" className={styles.pricingBtn}>خرید اشتراک</a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <p>ساخته شده با ❤️ در ایران | BgRemover 2024</p>
      </footer>
    </main>
  )
}
