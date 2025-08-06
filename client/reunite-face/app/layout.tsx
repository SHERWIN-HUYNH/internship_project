import { Roboto } from 'next/font/google'
import '@/styles/globals.css'
import { Providers } from './provider'
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
        <Providers >
          {children}
        </Providers>
      </body>
    </html>
  )
}