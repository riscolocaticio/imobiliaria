import type { Metadata } from 'next'
import './globals.css'
import { ReactQueryProvider } from './providers/react-query-provider'
import { UserProvider } from './providers/user-provider'
import { Analytics } from '@vercel/analytics/next'

export const metadata: Metadata = {
    title: 'Plataforma de Risco Locatício',
    description: 'Consulta, inserção e exclusão de ocorrências locatícias'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="pt-BR">
            <body className="min-h-screen antialiased">
                <script
                    dangerouslySetInnerHTML={{
                        __html: `(function(){try{var t=localStorage.getItem('theme');var d=t?t==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;if(d)document.documentElement.classList.add('dark');}catch(e){}})();`
                    }}
                />
                <ReactQueryProvider>
                    <UserProvider>{children}</UserProvider>
                </ReactQueryProvider>
                <Analytics />
            </body>
        </html>
    )
}
