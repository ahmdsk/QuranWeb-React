import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import { Search, X } from 'lucide-react'

const ListSurahHome = () => {
  const { surahs } = useApp()
  const [searchQuery, setSearchQuery] = useState('')

  const filteredSurahs = surahs.filter((surah) => {
    const q = searchQuery.toLowerCase()
    return (
      surah.namaLatin.toLowerCase().includes(q) ||
      surah.nama.toLowerCase().includes(q) ||
      surah.arti.toLowerCase().includes(q) ||
      surah.nomor.toString().includes(q)
    )
  })

  return (
    <div className="mt-10 space-y-6">
      {/* Header & Quick Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-heading text-slate-900 dark:text-white">
            Daftar Surah <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60">114 Surah</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Cari surah berdasarkan nama, arti, atau nomor surah
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Cari surah (misal: Yasin, 36)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-xs rounded-xl pl-9 pr-8 py-2.5 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-emerald-500 transition-all shadow-xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Grid List */}
      {filteredSurahs.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredSurahs.map((surah) => (
            <Link
              key={surah.nomor}
              to={`/surah/${surah.nomor}`}
              className="flex items-center justify-between rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 text-left shadow-xs transition-all hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-md group"
            >
              <div className="flex items-center gap-3.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 font-bold text-xs group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  {surah.nomor}
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200 font-heading group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {surah.namaLatin}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {surah.arti} &bull; {surah.jumlahAyat} Ayat
                  </p>
                </div>
              </div>
              <div className="font-arabic text-xl text-emerald-600 dark:text-emerald-400 font-bold">
                {surah.nama}
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="py-12 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-2">
          <p className="text-sm font-bold text-slate-700 dark:text-slate-300">Surah "{searchQuery}" tidak ditemukan</p>
          <p className="text-xs text-slate-400">Coba cari dengan kata kunci lain atau nomor surah.</p>
        </div>
      )}

      {/* Footer */}
      <div className="mt-12 pt-6 border-t border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500">
        <p>Copyright &copy; {new Date().getFullYear()} Quread. All rights reserved.</p>
        <p className="mt-1">Created with ❤️ by <a href="https://github.com/ahmdsk" target="_blank" rel="noreferrer" className="text-emerald-600 dark:text-emerald-400 hover:underline">Ahmad Shaleh</a></p>
      </div>
    </div>
  )
}

export default ListSurahHome