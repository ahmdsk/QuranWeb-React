import { useState, useMemo, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Search, Bookmark, Copy, Share2, Sparkles, Check, Loader2 } from 'lucide-react'
import { fetchDoaList, DoaItem, FALLBACK_DOA_LIST } from '@/data/doaData'

export const DoaPage = () => {
  const [doaList, setDoaList] = useState<DoaItem[]>(FALLBACK_DOA_LIST)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [bookmarkedDoa, setBookmarkedDoa] = useState<number[]>(() => {
    const saved = localStorage.getItem('quread_doa_bookmarks')
    return saved ? JSON.parse(saved) : []
  })

  const [toastMsg, setToastMsg] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true
    setIsLoading(true)
    fetchDoaList()
      .then((data) => {
        if (isMounted) {
          setDoaList(data)
          setIsLoading(false)
        }
      })
      .catch(() => {
        if (isMounted) setIsLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [])

  const categories = ['Semua', 'Al-Qur\'an', 'Harian', 'Pagi & Petang', 'Shalat & Wudhu', 'Perjalanan', 'Keluarga', 'Lainnya', 'Favorit Saya']

  const showToast = (msg: string) => {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(null), 3000)
  }

  const toggleBookmark = (doaId: number) => {
    let updated: number[] = []
    if (bookmarkedDoa.includes(doaId)) {
      updated = bookmarkedDoa.filter((id) => id !== doaId)
      showToast('Doa dihapus dari favorit')
    } else {
      updated = [...bookmarkedDoa, doaId]
      showToast('Doa disimpan ke favorit!')
    }
    setBookmarkedDoa(updated)
    localStorage.setItem('quread_doa_bookmarks', JSON.stringify(updated))
  }

  const handleCopyDoa = (item: DoaItem) => {
    const text = `[${item.judul}]\n\n${item.arab}\n\n"${item.latin}"\n\nMeaning: "${item.terjemah}"\n\n- Dibaca via Quread Web App`
    navigator.clipboard.writeText(text)
    showToast(`"${item.judul}" disalin ke clipboard!`)
  }

  const handleShareDoa = (item: DoaItem) => {
    const text = `[${item.judul}]\n${item.arab}\n\n"${item.terjemah}"`
    if (navigator.share) {
      navigator.share({ title: item.judul, text, url: window.location.href }).catch(() => {})
    } else {
      navigator.clipboard.writeText(`${text}\n\n${window.location.href}`)
      showToast('Link doa disalin ke clipboard!')
    }
  }

  const filteredDoa = useMemo(() => {
    return doaList.filter((item) => {
      const matchCat =
        selectedCategory === 'Semua'
          ? true
          : selectedCategory === 'Favorit Saya'
          ? bookmarkedDoa.includes(item.id)
          : item.kategori === selectedCategory

      const matchSearch =
        item.judul.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.latin.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.terjemah.toLowerCase().includes(searchQuery.toLowerCase())

      return matchCat && matchSearch
    })
  }, [doaList, selectedCategory, searchQuery, bookmarkedDoa])

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 p-4 sm:p-6 lg:p-8 animate-in fade-in duration-300">
      
      {/* Top Bar Header */}
      <div className="max-w-4xl mx-auto flex items-center justify-between pb-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shadow-xs"
        >
          <ArrowLeft className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>Beranda</span>
        </Link>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 text-xs font-bold border border-emerald-300/40">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>Kumpulan Doa Hisnul Muslim</span>
        </div>
      </div>

      {/* Main Container */}
      <main className="max-w-4xl mx-auto space-y-6">
        
        {/* Banner Section */}
        <div className="bg-gradient-to-r from-emerald-700 via-teal-800 to-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl space-y-3 relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-emerald-400/20 rounded-full blur-3xl pointer-events-none"></div>
          <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-300">Kumpulan Doa & Dzikir Shahih</span>
          <h1 className="text-2xl sm:text-4xl font-black font-heading">Doa-Doa Harian Pilihan</h1>
          <p className="text-xs sm:text-sm text-emerald-100 max-w-lg font-normal leading-relaxed">
            Lengkap dengan bacaan teks Arab, transliterasi latin, dan arti terjemahan Indonesia untuk mendampingi aktivitas ibadah Anda.
          </p>
        </div>

        {/* Search Bar & Category Filter Pills */}
        <div className="space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
            <input
              type="text"
              placeholder="Cari judul doa, bacaan latin, atau terjemahan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-xs sm:text-sm rounded-2xl pl-11 pr-4 py-3 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-emerald-500 shadow-xs"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar pb-2">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                    isActive
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-md'
                      : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {cat}
                </button>
              )
            })}
          </div>
        </div>

        {/* Doa Cards Grid */}
        {isLoading ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center flex flex-col items-center justify-center space-y-3">
            <Loader2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400 animate-spin" />
            <p className="text-sm font-bold text-slate-500">Memuat kumpulan doa dari API...</p>
          </div>
        ) : filteredDoa.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center space-y-3">
            <p className="text-sm font-bold text-slate-500">Tidak ada doa yang cocok dengan pencarian Anda.</p>
            <button
              onClick={() => { setSelectedCategory('Semua'); setSearchQuery('') }}
              className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs"
            >
              Reset Pencarian
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredDoa.map((item) => {
              const isFav = bookmarkedDoa.includes(item.id)
              return (
                <div
                  key={item.id}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 p-6 rounded-3xl space-y-4 shadow-xs transition-all"
                >
                  {/* Card Header Toolbar */}
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 font-bold text-[10px]">
                        {item.kategori}
                      </span>
                      <h3 className="text-base font-bold font-heading text-slate-900 dark:text-white">
                        {item.judul}
                      </h3>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => toggleBookmark(item.id)}
                        className={`p-2 rounded-xl text-xs font-semibold transition-colors ${
                          isFav
                            ? 'bg-amber-100 dark:bg-amber-400/20 text-amber-800 dark:text-amber-300'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-amber-500'
                        }`}
                        title={isFav ? 'Hapus dari Favorit' : 'Simpan ke Favorit'}
                      >
                        <Bookmark className={`w-4 h-4 ${isFav ? 'fill-amber-500 text-amber-500' : ''}`} />
                      </button>

                      <button
                        onClick={() => handleCopyDoa(item)}
                        className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-emerald-500 transition-colors"
                        title="Salin Doa"
                      >
                        <Copy className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleShareDoa(item)}
                        className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-emerald-500 transition-colors"
                        title="Bagikan Doa"
                      >
                        <Share2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Arabic Reading */}
                  <p className="text-right font-arabic text-2xl sm:text-3xl leading-[2.3] text-slate-900 dark:text-slate-100 font-bold pt-1">
                    {item.arab}
                  </p>

                  {/* Latin & Translation */}
                  <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800/60">
                    <p className="text-xs sm:text-sm font-semibold text-emerald-700 dark:text-emerald-400 italic">
                      {item.latin}
                    </p>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                      "{item.terjemah}"
                    </p>
                  </div>

                </div>
              )
            })}
          </div>
        )}
      </main>

      {/* Floating Toast */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 dark:bg-slate-800 text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-700 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 text-xs font-semibold">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

    </div>
  )
}

export default DoaPage
