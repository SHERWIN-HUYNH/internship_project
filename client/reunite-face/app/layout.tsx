import { Roboto } from 'next/font/google'
import '@/styles/globals.css'
import { Providers } from './provider'
import { AuthProvider } from '@/context/authContext'
import { Toaster } from 'sonner'
const geist = Roboto({
  weight: ['100', '300', '400', '500', '700', '900'],
  subsets: ['latin'],
})
 
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={geist.className}>
      <head>
        <title>Reunite Face</title>
      </head>
        <body>
        <AuthProvider>
          <Toaster richColors position="top-right" closeButton duration={5000} />
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}