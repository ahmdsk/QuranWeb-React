import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from './ui/dialog'
import { User, Lock, Mail, Loader2, LogOut, CheckCircle2, AlertCircle } from 'lucide-react'
import { User as SupabaseUser } from '@supabase/supabase-js'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  currentUser: SupabaseUser | null
  onLogout: () => void
}

export const AuthModal = ({ isOpen, onClose, currentUser, onLogout }: AuthModalProps) => {
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    try {
      if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (error) throw error
        setMessage({ type: 'success', text: 'Berhasil login! Selamat datang kembali.' })
        setTimeout(() => {
          onClose()
          setMessage(null)
        }, 1200)
      } else if (mode === 'register') {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        })
        if (error) throw error
        setMessage({ type: 'success', text: 'Pendaftaran berhasil! Cek email Anda untuk konfirmasi.' })
      } else if (mode === 'forgot') {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: window.location.origin,
        })
        if (error) throw error
        setMessage({ type: 'success', text: 'Link reset password telah dikirim ke email Anda.' })
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Terjadi kesalahan' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold font-heading text-slate-900 dark:text-white text-center">
            {currentUser
              ? 'Akun Pengguna'
              : mode === 'login'
              ? 'Masuk ke Quread'
              : mode === 'register'
              ? 'Daftar Akun Baru'
              : 'Reset Password'}
          </DialogTitle>
        </DialogHeader>

        {currentUser ? (
          <div className="space-y-5 text-center py-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto text-xl font-bold">
              {currentUser.email?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-xs text-slate-400">Login Sebagai:</p>
              <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{currentUser.email}</p>
            </div>

            <button
              onClick={() => {
                onLogout()
                onClose()
              }}
              className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-md"
            >
              <LogOut className="w-4 h-4" />
              Keluar Akun (Logout)
            </button>
          </div>
        ) : (
          <form onSubmit={handleAuth} className="space-y-4 pt-2">
            {message && (
              <div
                className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                  message.type === 'success'
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300'
                    : 'bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300'
                }`}
              >
                {message.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                )}
                <span>{message.text}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block">Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  placeholder="nama@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 text-xs rounded-xl pl-9 pr-3 py-2.5 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {mode !== 'forgot' && (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 text-xs rounded-xl pl-9 pr-3 py-2.5 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all shadow-md flex items-center justify-center gap-2"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin text-white" />
              ) : mode === 'login' ? (
                'Masuk Sekarang'
              ) : mode === 'register' ? (
                'Daftar Akun'
              ) : (
                'Kirim Link Reset Password'
              )}
            </button>

            <div className="pt-2 text-center text-xs text-slate-500 space-y-1">
              {mode === 'login' && (
                <>
                  <p>
                    Belum punya akun?{' '}
                    <button
                      type="button"
                      onClick={() => { setMode('register'); setMessage(null) }}
                      className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline"
                    >
                      Daftar di sini
                    </button>
                  </p>
                  <p>
                    Lupa password?{' '}
                    <button
                      type="button"
                      onClick={() => { setMode('forgot'); setMessage(null) }}
                      className="text-amber-600 dark:text-amber-400 font-bold hover:underline"
                    >
                      Reset Password
                    </button>
                  </p>
                </>
              )}

              {mode === 'register' && (
                <p>
                  Sudah punya akun?{' '}
                  <button
                    type="button"
                    onClick={() => { setMode('login'); setMessage(null) }}
                    className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline"
                  >
                    Masuk di sini
                  </button>
                </p>
              )}

              {mode === 'forgot' && (
                <p>
                  Kembali ke{' '}
                  <button
                    type="button"
                    onClick={() => { setMode('login'); setMessage(null) }}
                    className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline"
                  >
                    Halaman Login
                  </button>
                </p>
              )}
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
