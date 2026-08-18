'use client'

import { useEffect, useRef } from 'react'

function mulberry32(seed: number) {
    return function random() {
        seed |= 0
        seed = (seed + 0x6d2b79f5) | 0
        let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296
    }
}

function resolvePrimaryHsl(): string {
    return getComputedStyle(document.documentElement).getPropertyValue('--primary').trim()
}

function desenharMalha(canvas: HTMLCanvasElement) {
    const rect = canvas.getBoundingClientRect()
    if (rect.width === 0 || rect.height === 0) return

    const dpr = window.devicePixelRatio || 1
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

    const w = rect.width
    const h = rect.height
    ctx.clearRect(0, 0, w, h)

    const primary = resolvePrimaryHsl()
    const rand = mulberry32(11)

    const quantidadePontos = Math.round(Math.min(60, Math.max(24, (w * h) / 14000)))
    const pontos = Array.from({ length: quantidadePontos }, () => ({ x: rand() * w, y: rand() * h }))

    for (let f = 0; f < 5; f++) {
        const cx = rand() * w
        const cy = rand() * h
        const tamanho = w * (0.14 + rand() * 0.1)

        ctx.beginPath()
        ctx.moveTo(cx, cy)
        ctx.lineTo(cx + tamanho * (rand() - 0.5) * 1.6, cy + tamanho * rand())
        ctx.lineTo(cx + tamanho * rand(), cy + tamanho * (rand() - 0.5) * 1.6)
        ctx.closePath()
        ctx.fillStyle = `hsl(${primary} / 0.05)`
        ctx.fill()
    }

    const distanciaMaxima = Math.min(w, h) * 0.22
    ctx.lineWidth = 1

    for (let i = 0; i < pontos.length; i++) {
        for (let j = i + 1; j < pontos.length; j++) {
            const dx = pontos[i].x - pontos[j].x
            const dy = pontos[i].y - pontos[j].y
            const distancia = Math.sqrt(dx * dx + dy * dy)

            if (distancia < distanciaMaxima) {
                ctx.strokeStyle = `hsl(${primary} / ${(1 - distancia / distanciaMaxima) * 0.3})`
                ctx.beginPath()
                ctx.moveTo(pontos[i].x, pontos[i].y)
                ctx.lineTo(pontos[j].x, pontos[j].y)
                ctx.stroke()
            }
        }
    }

    pontos.forEach((ponto, indice) => {
        ctx.fillStyle = `hsl(${primary} / 0.5)`
        ctx.beginPath()
        ctx.arc(ponto.x, ponto.y, 1.1 + (indice % 3) * 0.5, 0, Math.PI * 2)
        ctx.fill()
    })
}

export function LoginBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const redesenhar = () => desenharMalha(canvas)
        redesenhar()

        window.addEventListener('resize', redesenhar)

        const observer = new MutationObserver(redesenhar)
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })

        return () => {
            window.removeEventListener('resize', redesenhar)
            observer.disconnect()
        }
    }, [])

    return <canvas ref={canvasRef} aria-hidden className="pointer-events-none absolute inset-0 h-full w-full" />
}
