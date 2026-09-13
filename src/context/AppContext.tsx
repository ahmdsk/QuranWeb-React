import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { AppContextType, Surah, LastRead } from '../types'
import { useTheme, ThemeMode } from './ThemeContext'
import { supabase } from '../lib/supabaseClient'
import { User as SupabaseUser } from '@supabase/supabase-js'

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
    const { theme: globalTheme, setTheme: setGlobalTheme, resolvedTheme } = useTheme()
    const [surahs, setSurahs] = useState<Surah[]>([])
    const [lastRead, setLastRead] = useState<LastRead | null>(null)
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const [selectedQari, setSelectedQari] = useState<string>('01')
    const [currentUser, setCurrentUser] = useState<SupabaseUser | null>(null)
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)

    useEffect(() => {
        // Load initial user state
        supabase.auth.getUser().then(({ data: { user } }) => {
            setCurrentUser(user)
            if (user) {
                loadUserBookmark(user.id)
            } else {
                // Fallback to local storage if user is not logged in
                const savedLastRead = localStorage.getItem('lastRead')
                if (savedLastRead) {
                    setLastRead(JSON.parse(savedLastRead))
                }
            }
        })

        // Listen for auth state changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            const user = session?.user ?? null
            setCurrentUser(user)
            if (user) {
                loadUserBookmark(user.id)
            } else {
                setLastRead(null)
            }
        })

        return () => subscription.unsubscribe()
    }, [])

    const loadUserBookmark = async (userId: string) => {
        try {
            const { data, error } = await supabase
                .from('bookmarks')
                .select('*')
                .eq('user_id', userId)
                .single()

            if (data && !error) {
                setLastRead({
                    id: data.surah_id,
                    name: data.surah_name,
                    arabicName: data.arabic_name,
                    translation: data.translation,
                    verseCount: data.verse_count,
                    verseNumber: data.verse_number,
                    lastRead: data.updated_at
                })
            }
        } catch (err) {
            console.error('Error fetching bookmark from Supabase:', err)
        }
    }

    const updateLastRead = async (newLastRead: LastRead): Promise<boolean> => {
        if (!currentUser) {
            // Require authentication to bookmark
            setIsAuthModalOpen(true)
            return false
        }

        setLastRead(newLastRead)
        localStorage.setItem('lastRead', JSON.stringify(newLastRead))

        // Sync with Supabase Database
        try {
            await supabase
                .from('bookmarks')
                .upsert({
                    user_id: currentUser.id,
                    surah_id: newLastRead.id,
                    surah_name: newLastRead.name,
                    arabic_name: newLastRead.arabicName,
                    translation: newLastRead.translation,
                    verse_count: newLastRead.verseCount,
                    verse_number: newLastRead.verseNumber || 1,
                    updated_at: new Date().toISOString()
                }, { onConflict: 'user_id' })
        } catch (err) {
            console.error('Error saving bookmark to Supabase database:', err)
        }
        return true
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
        theme: resolvedTheme,
        setTheme: (newTheme: 'light' | 'dark') => setGlobalTheme(newTheme as ThemeMode),
        globalTheme,
        setGlobalTheme,
        selectedQari,
        handleQariChange,
        currentUser,
        isAuthModalOpen,
        setIsAuthModalOpen
    }

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>
} 