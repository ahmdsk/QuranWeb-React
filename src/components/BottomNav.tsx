import { useLocation, useNavigate } from 'react-router-dom'
import { LogIn, Home, BookOpen, Clock, Search, LogOut, Bookmark } from 'lucide-react'
import { useApp } from '@/context/AppContext'
import { useState } from 'react'
import SearchDialog from './SearchDialog'
import { supabase } from '@/lib/supabaseClient'

export const BottomNav = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { currentUser, lastRead } = useApp()
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)

  const isActive = (path: string) => location.pathname === path

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setIsProfileMenuOpen(false)
  }

  const handlePrayerClick = () => {
    if (location.pathname !== '/') {
      navigate('/#shalat')
      setTimeout(() => {
        const el = document.getElementById('shalat')
        if (el) el.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    } else {
      const el = document.getElementById('shalat')
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <>
      {/* Mobile Profile Dropdown Popup if User Logged In */}
      {isProfileMenuOpen && currentUser && (
        <div className="md:hidden fixed bottom-20 right-4 z-50 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-2xl space-y-3 min-w-[220px] animate-in fade-in slide-in-from-bottom-2">
          <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 font-bold flex items-center justify-center text-sm">
              {currentUser.email?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{currentUser.email}</p>
              <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">Akun Terverifikasi</p>
            </div>
          </div>

          {lastRead && (
            <button
              onClick={() => {
                setIsProfileMenuOpen(false)
                navigate(`/surah/${lastRead.id}`)
              }}
              className="w-full flex items-center gap-2.5 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors"
            >
              <Bookmark className="w-4 h-4 text-amber-500 fill-amber-500" />
              <div className="text-left">
                <p className="text-[10px] text-slate-400">Terakhir Baca:</p>
                <p className="text-xs font-bold truncate max-w-[150px]">{lastRead.name}</p>
              </div>
            </button>
          )}

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 text-xs font-bold hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Keluar Akun</span>
          </button>
        </div>
      )}

      {/* Bottom Navbar Container */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-t border-slate-200/80 dark:border-slate-800/80 shadow-2xl">
        <div className="max-w-md mx-auto grid grid-cols-5 h-16 items-stretch relative">
          
          {/* Menu 1 (Paling Ujung Kiri): Beranda */}
          <button
            onClick={() => navigate('/')}
            className={`flex flex-col items-center justify-center py-1 transition-colors ${
              isActive('/')
                ? 'text-emerald-600 dark:text-emerald-400 font-bold'
                : 'text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400'
            }`}
          >
            <Home className="w-5 h-5" />
            <span className="text-[10px] font-semibold tracking-tight mt-1">Beranda</span>
          </button>

          {/* Menu 2: Jadwal Shalat */}
          <button
            onClick={handlePrayerClick}
            className="flex flex-col items-center justify-center py-1 text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
          >
            <Clock className="w-5 h-5" />
            <span className="text-[10px] font-semibold tracking-tight mt-1">Shalat</span>
          </button>

          {/* Menu 3 (Tengah - Fitur Unggulan: Baca Qur'an) */}
          <div className="flex flex-col items-center justify-start -mt-5 z-10">
            <button
              onClick={() => navigate('/home')}
              className={`w-12 h-12 rounded-full bg-emerald-600 hover:bg-emerald-500 dark:bg-emerald-500 dark:hover:bg-emerald-400 text-white flex items-center justify-center shadow-lg shadow-emerald-600/40 dark:shadow-emerald-500/30 border-4 border-slate-50 dark:border-slate-950 active:scale-95 transition-all ${
                isActive('/home') || location.pathname.startsWith('/surah')
                  ? 'ring-2 ring-emerald-400 ring-offset-2 dark:ring-offset-slate-950'
                  : ''
              }`}
              title="Fitur Unggulan: Baca Qur'an"
            >
              <BookOpen className="w-5 h-5 fill-white/20" />
            </button>
            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 tracking-tight mt-0.5">
              Qur'an
            </span>
          </div>

          {/* Menu 4: Cari */}
          <SearchDialog
            trigger={
              <button
                className="flex flex-col items-center justify-center py-1 text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
              >
                <Search className="w-5 h-5" />
                <span className="text-[10px] font-semibold tracking-tight mt-1">Cari</span>
              </button>
            }
          />

          {/* Menu 5 (Paling Ujung Kanan): Akun / Profil / Masuk */}
          <button
            onClick={() => {
              if (currentUser) {
                navigate('/profile')
              } else {
                navigate('/auth')
              }
            }}
            className={`flex flex-col items-center justify-center py-1 transition-colors ${
              isActive('/profile') || isActive('/auth')
                ? 'text-emerald-600 dark:text-emerald-400 font-bold'
                : 'text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400'
            }`}
          >
            {currentUser ? (
              <div className="relative">
                <div className="w-6 h-6 rounded-full bg-emerald-600 text-white font-black text-[10px] flex items-center justify-center shadow-xs">
                  {currentUser.email?.charAt(0).toUpperCase()}
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-emerald-400 border border-white dark:border-slate-900 rounded-full"></span>
              </div>
            ) : (
              <LogIn className="w-5 h-5" />
            )}
            <span className="text-[10px] font-semibold tracking-tight mt-1 truncate max-w-[55px]">
              {currentUser ? 'Akun' : 'Masuk'}
            </span>
          </button>

        </div>
      </nav>
    </>
  )
}
