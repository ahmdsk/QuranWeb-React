import { useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import { BookOpen } from 'lucide-react'

const BannerHome = () => {
  const navigate = useNavigate()
  const { lastRead } = useApp()

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 via-primary/10 to-background p-6">
      <div className="relative z-10">
        <h2 className="text-2xl font-bold">Assalamualaikum</h2>
        <p className="mt-1 text-muted-foreground">
          Mari kita baca Al-Quran hari ini
        </p>

        {lastRead ? (
          <div className="mt-4">
            <p className="text-sm text-muted-foreground">Terakhir dibaca</p>
            <button
              onClick={() => navigate(`/surah/${lastRead.id}`)}
              className="mt-2 flex w-full items-center justify-between rounded-lg border bg-background/50 p-4 backdrop-blur"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <BookOpen className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">{lastRead.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {lastRead.arabicName} • {lastRead.verseCount} Ayat
                  </p>
                </div>
              </div>
              <div className="text-sm text-muted-foreground">
                {new Date(lastRead.lastRead).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </div>
            </button>
          </div>
        ) : (
          <button
            onClick={() => navigate('/surah/1')}
            className="mt-4 rounded-lg bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
          >
            Mulai Membaca
          </button>
        )}
      </div>

      <div className="absolute -right-4 -top-4 h-32 w-32 rounded-full bg-primary/20 blur-2xl"></div>
      <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-primary/20 blur-2xl"></div>
    </div>
  )
}

export default BannerHome