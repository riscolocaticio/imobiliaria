import Image from 'next/image'

export function AppLoading() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-5 bg-background">
            <div className="relative flex h-20 w-20 items-center justify-center">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-2xl bg-primary/20" />
                <span className="absolute inline-flex h-full w-full rounded-2xl bg-primary/5" />
                <Image
                    src="/logo.png"
                    alt="Safeloc"
                    width={64}
                    height={64}
                    priority
                    className="relative h-16 w-16 rounded-2xl shadow-lg shadow-primary/25"
                />
            </div>

            <p className="text-xl font-bold tracking-tight">
                Safe<span className="text-primary">loc</span>
            </p>

            <div className="flex items-center gap-1.5" role="status" aria-live="polite">
                <span className="sr-only">Carregando</span>
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary [animation-delay:-0.3s]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary [animation-delay:-0.15s]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary" />
            </div>
        </div>
    )
}
