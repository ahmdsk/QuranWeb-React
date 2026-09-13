import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowLeft, BookOpen, Mail, Lock, User, CheckCircle2, AlertCircle, ShieldCheck } from 'lucide-react'
import { supabase } from '@/lib/supabaseClient'
import { useApp } from '@/context/AppContext'

export const AuthPage = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const redirectPath = searchParams.get('redirect') || '/home'
  const initialMode = searchParams.get('mode') as 'login' | 'register' | 'reset' | 'update_password' || 'login'
  const { currentUser } = useApp()

  const [mode, setMode] = useState<'login' | 'register' | 'reset' | 'update_password'>(initialMode)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  useEffect(() => {
    // Detect password recovery token in hash/URL
    const handleAuthState = async () => {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event) => {
        if (event === 'PASSWORD_RECOVERY') {
          setMode('update_password')
        }
      })
      return () => subscription.unsubscribe()
    }
    handleAuthState()
  }, [])

  // Redirect if already logged in (except when updating password)
  if (currentUser && mode !== 'update_password') {
    navigate(redirectPath)
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg(null)
    setSuccessMsg(null)

    try {
      if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password
        })
        if (error) throw error
        setSuccessMsg('Berhasil masuk! Mengalihkan...')
        setTimeout(() => navigate(redirectPath), 1000)
      } else if (mode === 'register') {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName
            },
            emailRedirectTo: `${window.location.origin}/auth?mode=login`
          }
        })
        if (error) throw error
        setSuccessMsg('Pendaftaran berhasil! Silakan periksa inbox email Anda untuk verifikasi akun.')
      } else if (mode === 'reset') {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/auth?mode=update_password`
        })
        if (error) throw error
        setSuccessMsg('Instruksi pemulihan kata sandi telah dikirim ke email Anda.')
      } else if (mode === 'update_password') {
        const { error } = await supabase.auth.updateUser({
          password
        })
        if (error) throw error
        setSuccessMsg('Kata sandi baru berhasil diperbarui! Mengalihkan ke halaman utama...')
        setTimeout(() => navigate('/home'), 1500)
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Terjadi kesalahan. Silakan coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#070c18] text-slate-800 dark:text-slate-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden transition-colors">
      
      {/* Background Decorative Gradient Blobs */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Top Header Back Button */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4 mb-6">
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shadow-xs"
        >
          <ArrowLeft className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>Kembali ke Beranda</span>
        </button>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4">
        {/* Brand Header */}
        <div className="text-center space-y-2 mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-600 text-white shadow-lg shadow-emerald-600/30">
            <BookOpen className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-black tracking-tight font-heading text-slate-900 dark:text-white">
            {mode === 'login' && 'Masuk ke Quread'}
            {mode === 'register' && 'Buat Akun Baru'}
            {mode === 'reset' && 'Reset Kata Sandi'}
            {mode === 'update_password' && 'Buat Kata Sandi Baru'}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
            {mode === 'login' && 'Masuk untuk menyimpan penanda terakhir baca dan akses fitur favorit.'}
            {mode === 'register' && 'Daftar gratis untuk menyinkronkan bacaan Qur\'an Anda di semua perangkat.'}
            {mode === 'reset' && 'Masukkan email Anda untuk menerima tautan pemulihan kata sandi.'}
            {mode === 'update_password' && 'Masukkan kata sandi baru Anda di bawah ini.'}
          </p>
        </div>

        {/* Card Container */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 py-8 px-6 sm:px-8 shadow-xl rounded-3xl space-y-6">
          
          {/* Alerts */}
          {errorMsg && (
            <div className="p-3.5 rounded-2xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800/80 text-red-700 dark:text-red-300 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <span className="font-medium">{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/80 text-emerald-700 dark:text-emerald-300 text-xs flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span className="font-medium">{successMsg}</span>
            </div>
          )}

          {/* Auth Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Nama Lengkap</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Ahmad Hidayat"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold focus:outline-none focus:border-emerald-500 dark:focus:border-emerald-500 transition-colors"
                  />
                </div>
              </div>
            )}

            {mode !== 'update_password' && (
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Alamat Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@email.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold focus:outline-none focus:border-emerald-500 dark:focus:border-emerald-500 transition-colors"
                  />
                </div>
              </div>
            )}

            {(mode === 'login' || mode === 'register' || mode === 'update_password') && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    {mode === 'update_password' ? 'Kata Sandi Baru' : 'Kata Sandi'}
                  </label>
                  {mode === 'login' && (
                    <button
                      type="button"
                      onClick={() => setMode('reset')}
                      className="text-[11px] font-bold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400"
                    >
                      Lupa Kata Sandi?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold focus:outline-none focus:border-emerald-500 dark:focus:border-emerald-500 transition-colors"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition-all disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : mode === 'login' ? (
                <span>Masuk Sekarang</span>
              ) : mode === 'register' ? (
                <span>Daftar Akun</span>
              ) : mode === 'reset' ? (
                <span>Kirim Link Reset</span>
              ) : (
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" /> Simpan Kata Sandi Baru
                </span>
              )}
            </button>
          </form>

          {/* Mode Switching Navigation */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-center text-xs">
            {mode === 'login' && (
              <p className="text-slate-500 dark:text-slate-400">
                Belum punya akun?{' '}
                <button
                  onClick={() => setMode('register')}
                  className="font-bold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 underline underline-offset-2 ml-1"
                >
                  Daftar Sekarang
                </button>
              </p>
            )}

            {mode === 'register' && (
              <p className="text-slate-500 dark:text-slate-400">
                Sudah punya akun?{' '}
                <button
                  onClick={() => setMode('login')}
                  className="font-bold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 underline underline-offset-2 ml-1"
                >
                  Masuk di sini
                </button>
              </p>
            )}

            {(mode === 'reset' || mode === 'update_password') && (
              <p className="text-slate-500 dark:text-slate-400">
                Kembali ke{' '}
                <button
                  onClick={() => setMode('login')}
                  className="font-bold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 underline underline-offset-2 ml-1"
                >
                  Halaman Masuk
                </button>
              </p>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}

export default AuthPage
