import type { Metadata } from 'next'
import './globals.css'
import { ReactQueryProvider } from './providers/react-query-provider'
import { UserProvider } from './providers/user-provider'

export const metadata: Metadata = {
    title: 'Plataforma de Risco Locatício',
    description: 'Consulta, inserção e exclusão de ocorrências locatícias'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="pt-BR">
            <body className="min-h-screen antialiased">
                <ReactQueryProvider>
                    <UserProvider>{children}</UserProvider>
                </ReactQueryProvider>
            </body>
        </html>
    )
}
