import { useNavigate } from "react-router-dom"

export default function ListSurahHome(props) {
    const navigate = useNavigate()

    const surah = props.surah
    const detailSurah = (no_surah) => {
        navigate(`/surah/${no_surah}`)
    }
    
    return (
        <div className="list-surah">
            {surah.filter((surah) => surah.nama_latin.toLowerCase().includes(props.search))
                .map((s) => {
                    return (
                        <div className="surah" key={s.nomor} onClick={() => detailSurah(s.nomor)}>
                            <div className="surah-title">
                                <div className="no-surah">
                                    <span>{s.nomor}</span>
                                </div>
                                <div className="surah-location">
                                    <h2>{s.nama_latin}</h2>
                                    <span>{s.tempat_turun} - {s.jumlah_ayat} Ayat</span>
                                </div>
                            </div>
                            <div className="name-surah-latin">
                                <h2>{s.nama}</h2>
                            </div>
                        </div>
                    )
                })}
        </div>
    )
}