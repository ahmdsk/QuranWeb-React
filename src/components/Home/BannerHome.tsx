import { useApp } from '../../context/AppContext'
import { useNavigate } from 'react-router-dom'
import { BookOpen } from 'lucide-react'

const BannerHome = () => {
  const { lastRead } = useApp()
  const navigate = useNavigate()

  return (
    <div className="relative overflow-hidden rounded-lg bg-gradient-to-r from-primary/90 to-primary p-6 text-primary-foreground shadow-lg">
      <div className="relative z-10">
        <div className="mb-4 flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          <h2 className="text-lg font-semibold">Terakhir Dibaca</h2>
        </div>
        {lastRead ? (
          <div className="space-y-2">
            <h3 className="text-2xl font-bold md:text-3xl">{lastRead.name}</h3>
            <p className="text-sm opacity-90">
              Ayat {lastRead.arabicName} • {lastRead.translation}
            </p>
            <button
              onClick={() => navigate(`/surah/${lastRead.id}`)}
              className="mt-4 inline-flex items-center justify-center rounded-md bg-primary-foreground px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary-foreground/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              Lanjutkan Membaca
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <h3 className="text-2xl font-bold md:text-3xl">Mulai Membaca</h3>
            <p className="text-sm opacity-90">Mulai perjalananmu dengan Al-Quran</p>
            <button
              onClick={() => navigate('/surah/1')}
              className="mt-4 inline-flex items-center justify-center rounded-md bg-primary-foreground px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary-foreground/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              Mulai Membaca
            </button>
          </div>
        )}
      </div>
      <div className="absolute -right-4 -top-4 h-32 w-32 rounded-full bg-primary-foreground/10" />
      <div className="absolute -bottom-4 -left-4 h-32 w-32 rounded-full bg-primary-foreground/10" />
    </div>
  )
}

export default BannerHome