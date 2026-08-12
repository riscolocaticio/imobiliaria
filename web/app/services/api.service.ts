import axios from 'axios'
import { destroyCookie, parseCookies } from 'nookies'
import { COOKIE_TOKEN } from '@/shared/enums/cookies.enum'
import { ROUTES } from '@/shared/enums/routes.enum'

let isRedirectingToLogin = false

function redirectToLogin() {
    if (typeof window === 'undefined' || isRedirectingToLogin) return
    isRedirectingToLogin = true

    destroyCookie(null, COOKIE_TOKEN.TOKEN, { path: '/' })

    const isOnLogin = window.location.pathname.startsWith(ROUTES.LOGIN)
    const returnTo = encodeURIComponent(
        isOnLogin ? '/' : window.location.pathname + window.location.search
    )
    window.location.href = `${ROUTES.LOGIN}?returnTo=${returnTo}`
}

export function getAPIClient() {
    const api = axios.create({
        baseURL: process.env.HOST
    })

    api.interceptors.request.use((config) => {
        const cookies = parseCookies(null)
        const token = cookies[COOKIE_TOKEN.TOKEN]

        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }

        return config
    })

    api.interceptors.response.use(
        (response) => response,
        (error) => {
            if (error?.response?.status === 401) {
                redirectToLogin()
            }
            return Promise.reject(error)
        }
    )

    return api
}

export const apiClient = getAPIClient()
