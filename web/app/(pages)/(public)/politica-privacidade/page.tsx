import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { ROUTES } from '@/shared/enums/routes.enum'

export default function PoliticaPrivacidadePage() {
    return (
        <>
            <div className="flex flex-col items-center gap-3">
                <Image
                    src="/logo.png"
                    alt="Safeloc"
                    width={64}
                    height={64}
                    className="h-16 w-16 rounded-2xl shadow-lg shadow-primary/25"
                />
                <div className="text-center">
                    <p className="text-2xl font-bold tracking-tight">
                        Safe<span className="text-primary">loc</span>
                    </p>
                </div>
            </div>

            <Card className="w-full shadow-xl shadow-black/5">
                <CardHeader>
                    <CardTitle>Política de Privacidade</CardTitle>
                    <CardDescription>Conteúdo em elaboração.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                        A Política de Privacidade completa da plataforma Safeloc será publicada aqui em breve.
                    </p>
                    <Link href={ROUTES.LOGIN} className="mt-4 inline-block text-sm text-primary hover:underline">
                        Voltar para o login
                    </Link>
                </CardContent>
            </Card>
        </>
    )
}
