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
    const [bookmarks, setBookmarks] = useState<LastRead[]>([])
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const [selectedQari, setSelectedQari] = useState<string>('01')
    const [currentUser, setCurrentUser] = useState<SupabaseUser | null>(null)
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)

    useEffect(() => {
        // Load initial user state
        supabase.auth.getUser().then(({ data: { user } }) => {
            setCurrentUser(user)
            if (user) {
                loadUserBookmarks(user.id)
            } else {
                const savedLastRead = localStorage.getItem('lastRead')
                if (savedLastRead) {
                    const parsed = JSON.parse(savedLastRead)
                    setLastRead(parsed)
                    setBookmarks([parsed])
                }
            }
        })

        // Listen for auth state changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            const user = session?.user ?? null
            setCurrentUser(user)
            if (user) {
                loadUserBookmarks(user.id)
            } else {
                setLastRead(null)
                setBookmarks([])
            }
        })

        return () => subscription.unsubscribe()
    }, [])

    const loadUserBookmarks = async (userId: string) => {
        try {
            const { data, error } = await supabase
                .from('bookmarks')
                .select('*')
                .eq('user_id', userId)
                .order('updated_at', { ascending: false })

            if (error) {
                console.warn('Supabase bookmarks query warning:', error.message)
                return
            }

            if (data && data.length > 0) {
                const mapped: LastRead[] = data.map((item) => ({
                    id: item.surah_id,
                    name: item.surah_name,
                    arabicName: item.arabic_name,
                    translation: item.translation,
                    verseCount: item.verse_count,
                    verseNumber: item.verse_number,
                    lastRead: item.updated_at
                }))

                setBookmarks(mapped)
                setLastRead(mapped[0])
            } else {
                setBookmarks([])
                setLastRead(null)
            }
        } catch (err) {
            console.error('Error fetching bookmarks from Supabase:', err)
        }
    }

    const updateLastRead = async (newLastRead: LastRead): Promise<boolean> => {
        if (!currentUser) return false
        setLastRead(newLastRead)
        localStorage.setItem('lastRead', JSON.stringify(newLastRead))
        return true
    }

    const toggleBookmark = async (item: LastRead): Promise<{ success: boolean; isBookmarked: boolean }> => {
        if (!currentUser) {
            return { success: false, isBookmarked: false }
        }

        const verseNum = item.verseNumber || 1
        const existing = bookmarks.find(
            (b) => b.id === item.id && (b.verseNumber || 1) === verseNum
        )

        if (existing) {
            // Delete bookmark
            try {
                const { error } = await supabase
                    .from('bookmarks')
                    .delete()
                    .eq('user_id', currentUser.id)
                    .eq('surah_id', item.id)
                    .eq('verse_number', verseNum)

                if (error) throw error

                const updated = bookmarks.filter(
                    (b) => !(b.id === item.id && (b.verseNumber || 1) === verseNum)
                )
                setBookmarks(updated)
                if (updated.length > 0) {
                    setLastRead(updated[0])
                } else {
                    setLastRead(null)
                }
                return { success: true, isBookmarked: false }
            } catch (err) {
                console.error('Error removing bookmark:', err)
                return { success: false, isBookmarked: true }
            }
        } else {
            // Insert bookmark
            try {
                const { error } = await supabase
                    .from('bookmarks')
                    .upsert({
                        user_id: currentUser.id,
                        surah_id: item.id,
                        surah_name: item.name,
                        arabic_name: item.arabicName,
                        translation: item.translation,
                        verse_count: item.verseCount,
                        verse_number: verseNum,
                        updated_at: new Date().toISOString()
                    }, { onConflict: 'user_id,surah_id,verse_number' })

                if (error) throw error

                const updated = [item, ...bookmarks.filter(b => !(b.id === item.id && (b.verseNumber || 1) === verseNum))]
                setBookmarks(updated)
                setLastRead(item)
                return { success: true, isBookmarked: true }
            } catch (err) {
                console.error('Error adding bookmark:', err)
                return { success: false, isBookmarked: false }
            }
        }
    }

    const removeBookmark = async (surahId: number, verseNumber: number = 1): Promise<boolean> => {
        if (!currentUser) return false
        try {
            const { error } = await supabase
                .from('bookmarks')
                .delete()
                .eq('user_id', currentUser.id)
                .eq('surah_id', surahId)
                .eq('verse_number', verseNumber)

            if (error) throw error

            const updated = bookmarks.filter(
                (b) => !(b.id === surahId && (b.verseNumber || 1) === verseNumber)
            )
            setBookmarks(updated)
            if (updated.length > 0) {
                setLastRead(updated[0])
            } else {
                setLastRead(null)
            }
            return true
        } catch (err) {
            console.error('Error deleting bookmark:', err)
            return false
        }
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
        bookmarks,
        updateLastRead,
        toggleBookmark,
        removeBookmark,
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