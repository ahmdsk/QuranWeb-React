import { Link } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import { BookOpen } from 'lucide-react'

const ListSurahHome = () => {
  const { surahs } = useApp()

  return (
    <div className="mt-8">
      <h2 className="mb-4 text-xl font-semibold">Daftar Surah</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {surahs.map((surah) => (
          <Link
            key={surah.nomor}
            to={`/surah/${surah.nomor}`}
            className="flex items-center justify-between rounded-lg border bg-card p-4 text-left text-card-foreground shadow-sm transition-colors hover:bg-accent"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <BookOpen className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">{surah.namaLatin}</h3>
                <p className="text-sm text-muted-foreground">
                  {surah.arti} • {surah.jumlahAyat} Ayat
                </p>
              </div>
            </div>
            <div className="text-lg font-medium text-primary">
              {surah.nama}
            </div>
          </Link>
        ))}
      </div>
      {/* Copyright */}
      <div className="mt-6 text-center text-sm text-muted-foreground">
        <p>Copyright © {new Date().getFullYear()} Quread. All rights reserved.</p>
        <p>Created with ❤️ by <a href="https://github.com/ahmdsk" target='_blank' className="text-primary">Ahmad Shaleh</a></p>
      </div>
    </div>
  )
}

export default ListSurahHome