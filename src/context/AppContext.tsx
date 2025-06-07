import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { AppContextType, Surah, LastRead } from '../types'

const AppContext = createContext<AppContextType | undefined>(undefined)

export const useApp = () => {
    const context = useContext(AppContext)
    if (!context) {
        throw new Error('useApp must be used within an AppProvider')
    }
    return context
}

interface AppProviderProps {
    children: ReactNode
}

export const AppProvider = ({ children }: AppProviderProps) => {
    const [surahs, setSurahs] = useState<Surah[]>([])
    const [lastRead, setLastRead] = useState<LastRead | null>(null)
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const [theme, setTheme] = useState<'light' | 'dark'>('light')

    const [selectedQari, setSelectedQari] = useState<string>('01')

    useEffect(() => {
        // Load last read from localStorage
        const savedLastRead = localStorage.getItem('lastRead')
        if (savedLastRead) {
            setLastRead(JSON.parse(savedLastRead))
        }

        // Load theme from localStorage
        const savedTheme = localStorage.getItem('theme')
        if (savedTheme) {
            setTheme(savedTheme as 'light' | 'dark')
        }
    }, [])

    useEffect(() => {
        // Save theme to localStorage
        localStorage.setItem('theme', theme)
        document.documentElement.classList.toggle('dark', theme === 'dark')
    }, [theme])

    const updateLastRead = (lastRead: LastRead) => {
        setLastRead(lastRead)
        localStorage.setItem('lastRead', JSON.stringify(lastRead))
    }

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen)
    }

    const handleQariChange = (qari: string) => {
        setSelectedQari(qari)
    }

    const value = {
        surahs,
        setSurahs,
        lastRead,
        updateLastRead,
        isSidebarOpen,
        toggleSidebar,
        theme,
        setTheme,
        selectedQari,
        handleQariChange
    }

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>
} 