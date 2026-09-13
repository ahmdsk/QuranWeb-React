import { Moon, Sun, Laptop, ChevronDown, BookOpen, User, LogOut } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { useTheme } from '../../context/ThemeContext'
import SearchDialog from '../SearchDialog'
import { supabase } from '../../lib/supabaseClient'
import { Link, useNavigate } from 'react-router-dom'
import { useState, useRef, useEffect } from 'react'

const HeaderHome = () => {
    const navigate = useNavigate()
    const { currentUser } = useApp()
    const { theme, setTheme, resolvedTheme } = useTheme()
    const [openThemeDropdown, setOpenThemeDropdown] = useState(false)
    const [openUserDropdown, setOpenUserDropdown] = useState(false)
    const themeRef = useRef<HTMLDivElement>(null)
    const userRef = useRef<HTMLDivElement>(null)

    const handleLogout = async () => {
        await supabase.auth.signOut()
        setOpenUserDropdown(false)
    }

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (themeRef.current && !themeRef.current.contains(e.target as Node)) {
                setOpenThemeDropdown(false)
            }
            if (userRef.current && !userRef.current.contains(e.target as Node)) {
                setOpenUserDropdown(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    return (
        <header className="sticky top-0 z-50 bg-white/80 dark:bg-[#070c18]/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800/80 transition-colors">
            <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-8">
                <div className="flex items-center gap-3">
                    <Link to="/" className="flex items-center space-x-2.5">
                        <div className="w-8 h-8 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold shadow-md">
                            <BookOpen className="h-4 w-4" />
                        </div>
                        <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white font-heading">
                            Qu<span className="text-emerald-600 dark:text-emerald-400">read</span>
                        </span>
                    </Link>
                </div>

                <div className="flex items-center gap-3">
                    <SearchDialog />

                    {/* Auth User Button */}
                    <div className="relative" ref={userRef}>
                        <button
                            onClick={() => {
                                if (currentUser) {
                                    setOpenUserDropdown(!openUserDropdown)
                                } else {
                                    navigate('/auth')
                                }
                            }}
                            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5 text-xs font-semibold"
                            title={currentUser ? `Akun: ${currentUser.email}` : 'Masuk / Daftar Akun'}
                        >
                            <User className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                            <span className="hidden sm:inline">
                                {currentUser ? currentUser.email?.split('@')[0] : 'Masuk'}
                            </span>
                        </button>

                        {openUserDropdown && currentUser && (
                            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl z-50 p-2 space-y-2">
                                <div className="px-2 py-1 border-b border-slate-100 dark:border-slate-800">
                                    <p className="text-[10px] text-slate-400">Terhubung sebagai</p>
                                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{currentUser.email}</p>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                                >
                                    <LogOut className="w-3.5 h-3.5" />
                                    <span>Keluar Akun</span>
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Theme Switcher */}
                    <div className="relative" ref={themeRef}>
                        <button
                            type="button"
                            onClick={() => setOpenThemeDropdown(!openThemeDropdown)}
                            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5 text-xs font-semibold"
                            title="Pilih Mode Tema"
                        >
                            {resolvedTheme === 'dark' ? (
                                <Moon className="w-4 h-4 text-emerald-400" />
                            ) : (
                                <Sun className="w-4 h-4 text-amber-500" />
                            )}
                            <span className="capitalize hidden sm:inline">{theme}</span>
                            <ChevronDown className="w-3 h-3 text-slate-400" />
                        </button>

                        {openThemeDropdown && (
                            <div className="absolute right-0 mt-2 w-36 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl z-50 p-1.5 space-y-1">
                                <button
                                    onClick={() => { setTheme('light'); setOpenThemeDropdown(false) }}
                                    className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-left ${theme === 'light' ? 'bg-emerald-50 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 font-bold' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                                >
                                    <Sun className="w-3.5 h-3.5 text-amber-500" /> Light Mode
                                </button>
                                <button
                                    onClick={() => { setTheme('dark'); setOpenThemeDropdown(false) }}
                                    className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-left ${theme === 'dark' ? 'bg-emerald-50 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 font-bold' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                                >
                                    <Moon className="w-3.5 h-3.5 text-emerald-400" /> Dark Mode
                                </button>
                                <button
                                    onClick={() => { setTheme('system'); setOpenThemeDropdown(false) }}
                                    className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-left ${theme === 'system' ? 'bg-emerald-50 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 font-bold' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                                >
                                    <Laptop className="w-3.5 h-3.5 text-slate-500" /> System Default
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    )
}

export default HeaderHome