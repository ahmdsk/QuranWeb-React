import { useApp } from '../../context/AppContext'
import { useNavigate } from 'react-router-dom'
import { BookOpen } from 'lucide-react'

const ListSurahHome = () => {
    const { surahs } = useApp()
    const navigate = useNavigate()

    return (
        <div className="container px-4 py-8 md:px-8">
            <h2 className="mb-6 text-2xl font-bold">Daftar Surah</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {surahs.map((surah) => (
                    <div
                        key={surah.nomor}
                        onClick={() => navigate(`/surah/${surah.nomor}`)}
                        className="group relative flex cursor-pointer flex-col rounded-lg border bg-card p-4 text-card-foreground shadow-sm transition-all hover:shadow-md"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
                                    {surah.nomor}
                                </div>
                                <div>
                                    <h3 className="font-semibold">{surah.namaLatin}</h3>
                                    <p className="text-sm text-muted-foreground">{surah.arti}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="font-arabic text-xl">{surah.nama}</p>
                                <p className="text-sm text-muted-foreground">{surah.jumlahAyat} ayat</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default ListSurahHome 