import { useApp } from '../../context/AppContext'
import { useNavigate } from 'react-router-dom'
import { BookOpen } from 'lucide-react'

const BannerHome = () => {
  const { lastRead } = useApp()
  const navigate = useNavigate()

  return (
    <div className="relative overflow-hidden rounded-2xl bg-emerald-600 dark:bg-emerald-950/80 border border-emerald-500/20 dark:border-emerald-800/60 p-6 sm:p-8 text-white shadow-lg shadow-emerald-600/10">
      <div className="relative z-10">
        <div className="mb-4 flex items-center gap-2 text-emerald-100 dark:text-emerald-300">
          <BookOpen className="h-5 w-5" />
          <h2 className="text-sm font-semibold uppercase tracking-wider">Terakhir Dibaca</h2>
        </div>
        {lastRead ? (
          <div className="space-y-2">
            <h3 className="text-2xl font-bold md:text-3xl font-heading">{lastRead.name}</h3>
            <p className="text-sm text-emerald-100 dark:text-emerald-200">
              Surah {lastRead.arabicName} • {lastRead.translation}
            </p>
            <button
              onClick={() => navigate(`/surah/${lastRead.id}`)}
              className="mt-4 inline-flex items-center justify-center rounded-xl bg-white text-emerald-700 hover:bg-slate-100 px-5 py-2.5 text-xs font-bold transition-all shadow-md"
            >
              Lanjutkan Membaca
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <h3 className="text-2xl font-bold md:text-3xl font-heading">Mulai Membaca Al-Qur'an</h3>
            <p className="text-sm text-emerald-100 dark:text-emerald-200">Mulai perjalanan ibadah digitalmu hari ini</p>
            <button
              onClick={() => navigate('/surah/1')}
              className="mt-4 inline-flex items-center justify-center rounded-xl bg-white text-emerald-700 hover:bg-slate-100 px-5 py-2.5 text-xs font-bold transition-all shadow-md"
            >
              Mulai Surah Al-Fatihah
            </button>
          </div>
        )}
      </div>
      <div className="absolute -right-6 -top-6 h-40 w-40 rounded-full bg-white/10 dark:bg-white/5 pointer-events-none" />
      <div className="absolute -bottom-6 -left-6 h-40 w-40 rounded-full bg-white/10 dark:bg-white/5 pointer-events-none" />
    </div>
  )
}

export default BannerHome