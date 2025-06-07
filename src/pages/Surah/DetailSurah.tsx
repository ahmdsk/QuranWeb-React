import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react'
import { useApp } from '@/context/AppContext'
import type { Surah, Verse } from '@/types'
import { quranService } from '@/services/quranService'
import Loading from '@/components/Loading'
import AudioPlayer from 'react-h5-audio-player'
import 'react-h5-audio-player/lib/styles.css'

const DetailSurah = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { updateLastRead } = useApp()
  const [surah, setSurah] = useState<Surah | null>(null)
  const [verses, setVerses] = useState<Verse[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedQari, setSelectedQari] = useState<string>('01')
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null)
  const [playingVerse, setPlayingVerse] = useState<number | null>(null)

  useEffect(() => {
    const fetchSurah = async () => {
      try {
        setLoading(true)
        const data = await quranService.getSurah(Number(id))
        setSurah(data)
        setVerses(data.ayat)
        updateLastRead({
          id: data.nomor,
          name: data.namaLatin,
          arabicName: data.nama,
          translation: data.arti,
          verseCount: data.jumlahAyat,
          lastRead: new Date().toISOString()
        })
      } catch (error) {
        console.error('Error fetching surah:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchSurah()
  }, [id])

  const handlePlayAudio = (verseNumber: number, audioUrl: string) => {
    if (currentAudio) {
      currentAudio.pause()
      currentAudio.currentTime = 0
    }

    if (playingVerse === verseNumber) {
      setPlayingVerse(null)
      setCurrentAudio(null)
      return
    }

    const audio = new Audio(audioUrl)
    audio.play()
    setCurrentAudio(audio)
    setPlayingVerse(verseNumber)

    audio.onended = () => {
      setPlayingVerse(null)
      setCurrentAudio(null)
    }
  }

  if (loading) {
    return <Loading />
  }

  if (!surah) {
    return (
      <div className="min-h-screen bg-background">
        <div className="flex h-screen items-center justify-center">
          <p className="text-lg text-muted-foreground">Surah tidak ditemukan</p>
        </div>
      </div>
    )
  }

  return (<div className="min-h-screen bg-background">
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex items-center justify-between py-5">
        <button
          onClick={() => navigate(-1)}
          className="mr-2 rounded-full p-2 hover:bg-accent flex items-center gap-2"
        >
          <ChevronLeft className="h-5 w-5" />
          <span>Kembali</span>
        </button>
        <div className="flex items-center gap-2">
          <select
            value={selectedQari}
            onChange={(e) => setSelectedQari(e.target.value)}
            className="rounded-md border bg-background px-3 py-1 text-sm"
          >
            <option value="01">Abdullah Al-Juhany</option>
            <option value="02">Abdul-Muhsin Al-Qasim</option>
            <option value="03">Abdurrahman as-Sudais</option>
            <option value="04">Ibrahim Al-Dossari</option>
            <option value="05">Misyari Rasyid Al-Afasi</option>
          </select>
        </div>
      </div>
    </header>

    <main className="container py-8">
      {/* Surah Info */}
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-3xl font-bold md:text-4xl">{surah.namaLatin}</h1>
        <p className="font-arabic text-2xl md:text-3xl">{surah.nama}</p>
        <p className="mt-2 text-sm text-muted-foreground">
          {surah.tempatTurun} • {surah.jumlahAyat} Ayat
        </p>
      </div>

      {/* Audio Player */}
      <div className="mb-8">
        <div className="mb-4 flex flex-col items-start justify-between gap-y-2">
          <h3 className="text-lg font-semibold">Audio Surah Lengkap</h3>
          <AudioPlayer
            src={surah.audioFull[selectedQari]}
            showJumpControls={false}
          />
        </div>
      </div>

      <div className="space-y-6">
        {verses.map((verse) => (
          <div
            key={verse.nomorAyat}
            className="rounded-lg border bg-card p-4 text-card-foreground shadow-sm"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
              {verse.nomorAyat}
            </div>
            <div className="flex items-start justify-between">
              <div className="flex-1 space-y-2">
                <p className="text-right text-2xl leading-loose">{verse.teksArab}</p>
                <p className="text-muted-foreground">{verse.teksLatin}</p>
                <p className="text-sm">{verse.teksIndonesia}</p>
              </div>
              <div className="ml-4 mt-2 flex flex-col items-center gap-2">
                <button
                  onClick={() => handlePlayAudio(verse.nomorAyat, verse.audio[selectedQari])}
                  className="rounded-full p-2 hover:bg-accent"
                >
                  {playingVerse === verse.nomorAyat ? (
                    <Pause className="h-4 w-4" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-between">
        <button
          onClick={() => navigate(`/surah/${Number(id) - 1}`)}
          disabled={Number(id) === 1}
          className="flex items-center gap-2 rounded-lg border px-4 py-2 hover:bg-accent disabled:opacity-50"
        >
          <ChevronLeft className="h-4 w-4" />
          Surah Sebelumnya
        </button>
        <button
          onClick={() => navigate(`/surah/${Number(id) + 1}`)}
          disabled={Number(id) === 114}
          className="flex items-center gap-2 rounded-lg border px-4 py-2 hover:bg-accent disabled:opacity-50"
        >
          Surah Selanjutnya
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </main>
  </div>
  )
}

export default DetailSurah 