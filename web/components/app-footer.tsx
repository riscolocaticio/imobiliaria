import Link from 'next/link'
import { ROUTES } from '@/shared/enums/routes.enum'

export function AppFooter() {
    return (
        <footer className="shrink-0 border-t border-border py-3 text-center text-[11px] text-muted-foreground">
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-1 leading-5">
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
            </div>
            <p className="mt-1 leading-4">© {new Date().getFullYear()} Safeloc</p>
        </footer>
    )
}
