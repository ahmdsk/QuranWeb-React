import { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Bookmark, Share2, Play } from 'lucide-react'
import AudioPlayer from 'react-h5-audio-player'
import 'react-h5-audio-player/lib/styles.css'
import { useApp } from '../../context/AppContext'
import { quranService } from '../../services/quranService'

const Surah = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const { updateLastRead } = useApp()
    const [surah, setSurah] = useState(null)
    const [loading, setLoading] = useState(true)
    const [selectedQari, setSelectedQari] = useState('01')
    const hasUpdatedLastRead = useRef(false)

    useEffect(() => {
        const fetchSurah = async () => {
            try {
                const response = await quranService.getSurahDetail(id)
                if (response.code === 200) {
                    setSurah(response.data)
                    // Only update last read once when surah is first loaded
                    if (!hasUpdatedLastRead.current) {
                        updateLastRead({
                            number: response.data.nomor,
                            name: response.data.nama,
                            englishName: response.data.namaLatin,
                            verse: 1 // Default to first verse
                        })
                        hasUpdatedLastRead.current = true
                    }
                }
            } catch (error) {
                console.error('Error fetching surah:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchSurah()
    }, [id])

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            </div>
        )
    }

    if (!surah) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold">Surah not found</h2>
                    <button
                        onClick={() => navigate('/home')}
                        className="mt-4 text-primary hover:underline"
                    >
                        Go back home
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container flex h-16 items-center justify-between px-4 md:px-8">
                    <button
                        onClick={() => navigate('/home')}
                        className="inline-flex items-center gap-2 text-sm font-medium hover:text-primary"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back
                    </button>
                    <div className="flex items-center gap-4">
                        <button className="inline-flex h-9 w-9 items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
                            <Bookmark className="h-5 w-5" />
                            <span className="sr-only">Bookmark</span>
                        </button>
                        <button className="inline-flex h-9 w-9 items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
                            <Share2 className="h-5 w-5" />
                            <span className="sr-only">Share</span>
                        </button>
                    </div>
                </div>
            </header>

            {/* Surah Info */}
            <div className="container px-4 py-8 md:px-8">
                <div className="mb-8 text-center">
                    <h1 className="mb-2 text-3xl font-bold md:text-4xl">{surah.namaLatin}</h1>
                    <p className="font-arabic text-2xl md:text-3xl">{surah.nama}</p>
                    <p className="mt-2 text-sm text-muted-foreground">
                        {surah.tempatTurun} • {surah.jumlahAyat} Ayat
                    </p>
                </div>

                {/* Audio Player */}
                <div className="mb-8">
                    <div className="mb-4 flex items-center justify-between">
                        <h3 className="text-lg font-semibold">Audio Surah</h3>
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
                    <AudioPlayer
                        src={surah.audioFull[selectedQari]}
                        showJumpControls={false}
                        layout="stacked"
                        customProgressBarSection={[
                            'PROGRESS_BAR',
                            'CURRENT_TIME',
                            'DURATION',
                            'VOLUME_CONTROLS',
                        ]}
                        customControlsSection={['MAIN_CONTROLS']}
                        className="rounded-lg border bg-card"
                    />
                </div>

                {/* Verses */}
                <div className="space-y-6">
                    {surah.ayat.map((ayat) => (
                        <div
                            key={ayat.nomorAyat}
                            className="rounded-lg border bg-card p-6"
                        >
                            <div className="mb-4 flex items-center justify-between">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
                                    {ayat.nomorAyat}
                                </div>
                                <button
                                    onClick={() => {
                                        const audio = new Audio(ayat.audio[selectedQari])
                                        audio.play()
                                    }}
                                    className="inline-flex h-9 w-9 items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                >
                                    <Play className="h-5 w-5" />
                                    <span className="sr-only">Play verse</span>
                                </button>
                            </div>
                            <p className="mb-4 font-arabic text-right text-2xl leading-loose">
                                {ayat.teksArab}
                            </p>
                            <p className="mb-2 text-sm text-muted-foreground">
                                {ayat.teksLatin}
                            </p>
                            <p className="text-muted-foreground">
                                {ayat.teksIndonesia}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Navigation */}
                <div className="mt-8 flex items-center justify-between">
                    {surah.suratSebelumnya ? (
                        <button
                            onClick={() => navigate(`/surah/${surah.suratSebelumnya.nomor}`)}
                            className="inline-flex items-center gap-2 text-sm font-medium hover:text-primary"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            {surah.suratSebelumnya.namaLatin}
                        </button>
                    ) : (
                        <div />
                    )}
                    {surah.suratSelanjutnya && (
                        <button
                            onClick={() => navigate(`/surah/${surah.suratSelanjutnya.nomor}`)}
                            className="inline-flex items-center gap-2 text-sm font-medium hover:text-primary"
                        >
                            {surah.suratSelanjutnya.namaLatin}
                            <ArrowLeft className="h-4 w-4 rotate-180" />
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Surah 