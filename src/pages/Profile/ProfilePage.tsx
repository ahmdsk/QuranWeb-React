import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  User,
  Bookmark,
  BookOpen,
  Trash2,
  ExternalLink,
  ShieldCheck,
  LogOut,
  ArrowLeft,
  Moon,
  Sun,
  Laptop,
  Lock,
  Sparkles,
  Calendar
} from 'lucide-react'
import { useApp } from '@/context/AppContext'
import { useTheme } from '@/context/ThemeContext'
import { supabase } from '@/lib/supabaseClient'
import HeaderHome from '@/components/Home/HeaderHome'

export const ProfilePage = () => {
  const navigate = useNavigate()
  const { currentUser, bookmarks, removeBookmark, lastRead } = useApp()
  const { theme, setTheme, resolvedTheme } = useTheme()

  const [activeTab, setActiveTab] = useState<'bookmarks' | 'settings'>('bookmarks')
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3000)
  }

  // Redirect if not logged in
  if (!currentUser) {
    navigate('/auth?redirect=/profile')
    return null
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/')
  }

  const handleDeleteBookmark = async (surahId: number, verseNumber?: number) => {
    const success = await removeBookmark(surahId, verseNumber || 1)
    if (success) {
      showToast('Penanda ayat berhasil dihapus')
    } else {
      showToast('Gagal menghapus penanda ayat')
    }
  }

  const formattedDate = currentUser.created_at
    ? new Date(currentUser.created_at).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })
    : 'Pengguna Setia'

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#070c18] text-slate-800 dark:text-slate-100 transition-colors">
      <HeaderHome />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        
        {/* Navigation Bar */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/home')}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shadow-xs"
          >
            <ArrowLeft className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Kembali ke Daftar Surah</span>
          </button>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 text-xs font-bold border border-emerald-300/40">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Akun Terverifikasi</span>
          </span>
        </div>

        {/* User Hero Banner Profile Header */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-800 text-white p-6 sm:p-8 shadow-xl">
          <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>

          <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
            {/* Avatar Circle */}
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white/20 dark:bg-white/10 backdrop-blur-md border-2 border-white/40 flex items-center justify-center text-3xl sm:text-4xl font-black text-amber-300 shadow-inner shrink-0">
              {currentUser.email?.charAt(0).toUpperCase() || 'U'}
            </div>

            {/* Profile Info */}
            <div className="space-y-2 flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-black font-heading tracking-tight">
                    {currentUser.user_metadata?.full_name || currentUser.email?.split('@')[0]}
                  </h1>
                  <p className="text-xs sm:text-sm text-emerald-100 font-medium">{currentUser.email}</p>
                </div>

                <button
                  onClick={handleLogout}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all border border-white/20 shadow-xs self-center sm:self-auto"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Keluar Akun</span>
                </button>
              </div>

              <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-emerald-100/90 font-medium">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-amber-300" /> Bergabung: {formattedDate}
                </span>
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Penanda Disinkronkan
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 font-bold flex items-center justify-center shrink-0">
              <Bookmark className="w-6 h-6 fill-amber-500/20" />
            </div>
            <div>
              <p className="text-2xl font-black text-slate-900 dark:text-white font-heading">{bookmarks.length}</p>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Ayat Tertandai</p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 font-bold flex items-center justify-center shrink-0">
              <BookOpen className="w-6 h-6" />
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                {lastRead ? lastRead.name : 'Belum Ada'}
              </p>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Bacaan Terakhir</p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400 font-bold flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-black text-slate-900 dark:text-white font-heading">114</p>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Surah Tersedia</p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 dark:border-slate-800">
          <button
            onClick={() => setActiveTab('bookmarks')}
            className={`flex items-center gap-2 pb-3 px-4 text-xs font-bold transition-all border-b-2 ${
              activeTab === 'bookmarks'
                ? 'border-emerald-600 text-emerald-600 dark:border-emerald-400 dark:text-emerald-400 font-black'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Bookmark className="w-4 h-4" />
            <span>Daftar Ayat Tertandai ({bookmarks.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-2 pb-3 px-4 text-xs font-bold transition-all border-b-2 ${
              activeTab === 'settings'
                ? 'border-emerald-600 text-emerald-600 dark:border-emerald-400 dark:text-emerald-400 font-black'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Pengaturan Akun & Keamanan</span>
          </button>
        </div>

        {/* TAB 1: BOOKMARKS LIST */}
        {activeTab === 'bookmarks' && (
          <div className="space-y-4">
            {bookmarks.length === 0 ? (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
                  <Bookmark className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <p className="text-base font-bold text-slate-800 dark:text-slate-200">Belum Ada Ayat yang Ditandai</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                    Tandai ayat favorit Anda saat membaca Al-Qur'an agar dapat diakses kembali dengan mudah di sini.
                  </p>
                </div>
                <button
                  onClick={() => navigate('/home')}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors shadow-md"
                >
                  Mulai Baca Al-Qur'an
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {bookmarks.map((bm) => (
                  <div
                    key={`${bm.id}-${bm.verseNumber}`}
                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-800 rounded-2xl p-5 shadow-xs transition-all flex flex-col justify-between space-y-4 group"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 font-bold text-xs flex items-center justify-center shrink-0">
                            {bm.id}
                          </div>
                          <div>
                            <h3 className="text-sm font-bold text-slate-900 dark:text-white font-heading">
                              {bm.name}
                            </h3>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400">
                              {bm.translation} &bull; Ayat {bm.verseNumber || 1}
                            </p>
                          </div>
                        </div>

                        <p className="font-arabic text-xl text-amber-500 font-bold">{bm.arabicName}</p>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
                      <button
                        onClick={() => navigate(`/surah/${bm.id}`)}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 transition-colors"
                      >
                        <span>Lanjutkan Baca</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleDeleteBookmark(bm.id, bm.verseNumber)}
                        className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                        title="Hapus Penanda Ayat Ini"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: SETTINGS & SECURITY */}
        {activeTab === 'settings' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
            
            <div className="space-y-4">
              <h2 className="text-base font-bold text-slate-900 dark:text-white font-heading">Tema Tampilan Aplikasi</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  onClick={() => setTheme('light')}
                  className={`flex items-center gap-3 p-3.5 rounded-2xl border text-xs font-bold transition-all ${
                    resolvedTheme === 'light'
                      ? 'border-emerald-500 bg-emerald-50/50 dark:bg-slate-800 text-emerald-700 dark:text-emerald-300 ring-2 ring-emerald-500/20'
                      : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <Sun className="w-4 h-4 text-amber-500" />
                  <span>Light Mode</span>
                </button>

                <button
                  onClick={() => setTheme('dark')}
                  className={`flex items-center gap-3 p-3.5 rounded-2xl border text-xs font-bold transition-all ${
                    resolvedTheme === 'dark'
                      ? 'border-emerald-500 bg-slate-800 text-emerald-400 ring-2 ring-emerald-500/20'
                      : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <Moon className="w-4 h-4 text-emerald-400" />
                  <span>Dark Mode</span>
                </button>

                <button
                  onClick={() => setTheme('system')}
                  className={`flex items-center gap-3 p-3.5 rounded-2xl border text-xs font-bold transition-all ${
                    theme === 'system'
                      ? 'border-emerald-500 bg-emerald-50/50 dark:bg-slate-800 text-emerald-700 dark:text-emerald-300 ring-2 ring-emerald-500/20'
                      : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <Laptop className="w-4 h-4 text-slate-500" />
                  <span>System Default</span>
                </button>
              </div>
            </div>

            <hr className="border-slate-100 dark:border-slate-800" />

            <div className="space-y-4">
              <h2 className="text-base font-bold text-slate-900 dark:text-white font-heading">Keamanan Akun</h2>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <div className="space-y-0.5">
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Ubah Kata Sandi Akun</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Perbarui kata sandi Anda secara berkala untuk menjaga keamanan akun.
                  </p>
                </div>
                <button
                  onClick={() => navigate('/auth?mode=update_password')}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0"
                >
                  <Lock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Ubah Kata Sandi</span>
                </button>
              </div>
            </div>

          </div>
        )}

      </main>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 dark:bg-slate-800 text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-700 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 text-xs font-semibold">
          <Bookmark className="w-4 h-4 text-amber-400 fill-amber-400" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  )
}

export default ProfilePage
