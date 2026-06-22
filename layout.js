import './globals.css'

export const metadata = {
  title: 'حذف پس‌زمینه | BgRemover',
  description: 'حذف پس‌زمینه تصاویر با هوش مصنوعی',
}

export default function RootLayout({ children }) {
  return (
    <html lang="fa" dir="rtl">
      <body>{children}</body>
    </html>
  )
}
