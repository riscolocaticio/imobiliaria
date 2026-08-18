import Link from 'next/link'
import { ROUTES } from '@/shared/enums/routes.enum'

export function AppFooter() {
    return (
        <footer className="shrink-0 border-t border-border py-3 text-center text-[11px] leading-4 text-muted-foreground">
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-1">
                <Link
                    href={ROUTES.TERMOS_USO}
                    target="_blank"
                    className="transition-colors hover:text-foreground hover:underline"
                >
                    Termos de Uso
                </Link>
                <Link
                    href={ROUTES.POLITICA_PRIVACIDADE}
                    target="_blank"
                    className="transition-colors hover:text-foreground hover:underline"
                >
                    Política de Privacidade
                </Link>
                <a
                    href="mailto:contato@safeloc.com.br"
                    className="transition-colors hover:text-foreground hover:underline"
                >
                    Contato
                </a>
                <span>© {new Date().getFullYear()} Safeloc</span>
            </div>
        </footer>
    )
}
