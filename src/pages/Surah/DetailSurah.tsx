import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ChevronLeft, Play, Pause, UserCheck, ArrowLeft, ArrowRight, Bookmark } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import type { Surah, Verse } from '../../types'
import { quranService } from '../../services/quranService'
import Loading from '../../components/Loading'
import HeaderHome from '../../components/Home/HeaderHome'

const DetailSurah = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { bookmarks, toggleBookmark, currentUser } = useApp()

  const [surah, setSurah] = useState<Surah | null>(null)
  const [verses, setVerses] = useState<Verse[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedQari, setSelectedQari] = useState<string>('01')
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null)
  const [playingVerse, setPlayingVerse] = useState<number | null>(null)
  const [isPlayingFull, setIsPlayingFull] = useState<boolean>(false)
  const [fullAudioObj, setFullAudioObj] = useState<HTMLAudioElement | null>(null)

  // Toast notification state
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const qariList = [
    { id: '01', name: 'Abdullah Al-Juhany' },
    { id: '02', name: 'Abdul-Muhsin Al-Qasim' },
    { id: '03', name: 'Abdurrahman as-Sudais' },
    { id: '04', name: 'Ibrahim Al-Dossari' },
    { id: '05', name: 'Misyari Rasyid Al-Afasi' }
  ]

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3000)
  }

  useEffect(() => {
    const fetchSurah = async () => {
      try {
        setLoading(true)
        const data = await quranService.getSurah(Number(id))
        setSurah(data)
        setVerses(data.ayat)
      } catch (error) {
        console.error('Error fetching surah:', error)
      } finally {
        setLoading(false)
      }
    }

    // Stop audio on surah change
    if (currentAudio) {
      currentAudio.pause()
      setCurrentAudio(null)
      setPlayingVerse(null)
    }
    if (fullAudioObj) {
      fullAudioObj.pause()
      setFullAudioObj(null)
      setIsPlayingFull(false)
    }

    fetchSurah()
  }, [id])

  const handlePlayVerseAudio = (verseNumber: number, audioUrl: string) => {
    if (fullAudioObj) {
      fullAudioObj.pause()
      setIsPlayingFull(false)
    }

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

  const handleToggleFullAudio = () => {
    if (!surah) return

    if (currentAudio) {
      currentAudio.pause()
      setPlayingVerse(null)
    }

    if (isPlayingFull && fullAudioObj) {
      fullAudioObj.pause()
      setIsPlayingFull(false)
      return
    }

    const fullSrc = surah.audioFull[selectedQari]
    if (!fullSrc) return

    const audio = new Audio(fullSrc)
    audio.play()
    setFullAudioObj(audio)
    setIsPlayingFull(true)

    audio.onended = () => {
      setIsPlayingFull(false)
      setFullAudioObj(null)
    }
  }

  if (loading) {
    return <Loading />
  }

  if (!surah) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#070c18] text-slate-800 dark:text-slate-100 flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-lg font-bold text-slate-600 dark:text-slate-400">Surah tidak ditemukan</p>
          <button
            onClick={() => navigate('/home')}
            className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs"
          >
            Kembali ke Daftar Surah
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#070c18] text-slate-800 dark:text-slate-100 font-sans selection:bg-emerald-500 selection:text-white transition-colors">
      <HeaderHome />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        
        {/* Navigation & Qari Selection Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-xs">
          <button
            onClick={() => navigate('/home')}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <ChevronLeft className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <span>Kembali ke Daftar Surah</span>
          </button>

          <div className="flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Qari:</span>
            <select
              value={selectedQari}
              onChange={(e) => setSelectedQari(e.target.value)}
              className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold focus:outline-none focus:border-emerald-500"
            >
              {qariList.map((q) => (
                <option key={q.id} value={q.id}>
                  {q.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Surah Header Card Banner */}
        <div className="relative overflow-hidden rounded-2xl bg-emerald-600 dark:bg-emerald-950/80 border border-emerald-500/20 dark:border-emerald-800/60 p-6 sm:p-10 text-white text-center shadow-lg">
          <div className="relative z-10 space-y-3">
            <span className="inline-block px-3 py-1 rounded-full bg-white/20 dark:bg-white/10 text-xs font-bold tracking-widest uppercase text-emerald-100">
              Surah Ke-{surah.nomor} &bull; {surah.tempatTurun}
            </span>
            <h1 className="text-3xl sm:text-5xl font-black font-heading tracking-tight">{surah.namaLatin}</h1>
            <p className="font-arabic text-3xl sm:text-4xl text-amber-300 font-bold">{surah.nama}</p>
            <p className="text-xs sm:text-sm text-emerald-100 max-w-lg mx-auto">
              "{surah.arti}" &bull; {surah.jumlahAyat} Ayat
            </p>

            {/* Audio Surah Full Button */}
            <div className="pt-3">
              <button
                onClick={handleToggleFullAudio}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-emerald-800 hover:bg-slate-100 font-bold text-xs shadow-md transition-all"
              >
                {isPlayingFull ? (
                  <>
                    <Pause className="w-4 h-4 text-emerald-700" /> Pause Audio Surah
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 text-emerald-700 fill-emerald-700" /> Putar Audio Surah Full
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Bismillah Banner (Except Surah 1 & 9) */}
        {surah.nomor !== 1 && surah.nomor !== 9 && (
          <div className="text-center py-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs">
            <p className="font-arabic text-2xl sm:text-3xl text-emerald-600 dark:text-emerald-400 font-bold">
              بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ
            </p>
          </div>
        )}

        {/* Verses List */}
        <div className="space-y-4">
          {verses.map((verse) => {
            const isBookmarked = bookmarks.some(
              (b) => b.id === surah.nomor && (b.verseNumber || 1) === verse.nomorAyat
            )

            return (
              <div
                key={verse.nomorAyat}
                className={`bg-white dark:bg-slate-900 border rounded-2xl p-5 sm:p-6 shadow-xs transition-all space-y-4 ${
                  isBookmarked
                    ? 'border-amber-400 dark:border-amber-500/80 ring-2 ring-amber-400/20 bg-amber-50/20 dark:bg-amber-950/10'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                {/* Verse Toolbar */}
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 font-bold text-xs flex items-center justify-center">
                      {verse.nomorAyat}
                    </div>
                    {isBookmarked && (
                      <span className="text-[10px] uppercase font-extrabold px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-700 dark:text-amber-300 border border-amber-400/40">
                        Tertandai
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={async () => {
                        if (!currentUser) {
                          showToast('Silakan login/register terlebih dahulu.')
                          navigate(`/auth?redirect=/surah/${surah.nomor}`)
                          return
                        }

                        const res = await toggleBookmark({
                          id: surah.nomor,
                          name: `${surah.namaLatin} (Ayat ${verse.nomorAyat})`,
                          arabicName: surah.nama,
                          translation: surah.arti,
                          verseCount: surah.jumlahAyat,
                          verseNumber: verse.nomorAyat,
                          lastRead: new Date().toISOString()
                        })

                        if (res.isBookmarked) {
                          showToast(`Ditandai: ${surah.namaLatin} Ayat ${verse.nomorAyat}`)
                        } else {
                          showToast(`Tanda dihapus: ${surah.namaLatin} Ayat ${verse.nomorAyat}`)
                        }
                      }}
                      className={`p-2 rounded-xl transition-colors flex items-center gap-1.5 text-xs font-semibold ${
                        isBookmarked
                          ? 'bg-amber-100 dark:bg-amber-400/20 text-amber-800 dark:text-amber-300 font-bold border border-amber-300 dark:border-amber-400/30'
                          : 'bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400'
                      }`}
                      title={isBookmarked ? 'Hapus Tanda Ayat Ini' : 'Tandai Ayat Ini'}
                    >
                      <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-amber-500 text-amber-500' : 'text-amber-500'}`} />
                      <span className="hidden sm:inline">{isBookmarked ? 'Tertandai' : 'Tandai Ayat'}</span>
                    </button>

                    <button
                      onClick={() => handlePlayVerseAudio(verse.nomorAyat, verse.audio[selectedQari])}
                      className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors flex items-center gap-1.5 text-xs font-semibold"
                      title="Putar Audio Ayat"
                    >
                      {playingVerse === verse.nomorAyat ? (
                        <>
                          <Pause className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                          <span>Stop</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                          <span>Audio</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Arabic Text */}
                <p className="text-right font-arabic text-2xl sm:text-3xl leading-[2.2] text-slate-900 dark:text-slate-100 font-bold pt-2">
                  {verse.teksArab}
                </p>

                {/* Transliteration & Indonesian Translation */}
                <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800/60">
                  <p className="text-xs sm:text-sm font-semibold text-emerald-700 dark:text-emerald-400 italic">
                    {verse.teksLatin}
                  </p>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {verse.teksIndonesia}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Footer Navigation (Previous & Next Surah) */}
        <div className="pt-4 flex items-center justify-between gap-4">
          <button
            onClick={() => navigate(`/surah/${Number(id) - 1}`)}
            disabled={Number(id) === 1}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-xs"
          >
            <ArrowLeft className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <span>Surah Sebelumnya</span>
          </button>

          <button
            onClick={() => navigate(`/surah/${Number(id) + 1}`)}
            disabled={Number(id) === 114}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-xs"
          >
            <span>Surah Selanjutnya</span>
            <ArrowRight className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          </button>
        </div>

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

export default DetailSurah