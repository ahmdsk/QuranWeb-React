import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom"
import './DetailSurah.css'

export default function DetailSurah() {
    const params = useParams()

    const [surah, setSurah] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function getSurah() {
            const request = await fetch(`https://equran.id/api/surat/${params?.nomor}`);
            const response = await request.json();

            setSurah(response)
            setLoading(false)

            document.title = `${surah.nama_latin} | Quran App`
        }

        getSurah()

        localStorage.setItem('lastRead', JSON.stringify({
            'nama_latin': surah.nama_latin,
            'nomor': surah.nomor
        }));
    }, [params, surah]);

    return (
        <>
            <div className="topBar">
                <div className="title-home">
                    <Link to="/home"><img src="/back.svg" alt="" /></Link>
                    <span>{surah.nama_latin}</span>
                </div>
                <span>
                    <img src="/search-line.svg" alt="" />
                </span>
            </div>

            <div className="banner-surah">
                <h3 className="surah-name-banner">{surah.nama_latin}</h3>
                <h4 className="surah-arti">{surah.arti}</h4>
                <span className="diver"></span>
                <p className="surah-ayat-locate">{surah.tempat_turun} - {surah.jumlah_ayat} Ayat</p>
                <img src="/bismillah.svg" alt="Bismillah" className="bismillah-img" />
                <img src="/quran.svg" alt="Quran" className="quran-surah" />
            </div>

            {loading ? <div className="loading">Loading Content...</div> : (
                <div className="list-ayat">
                    {surah.ayat.map((ayat) => {
                        return (
                            <div className="ayat" key={ayat.nomor}>
                                <div className="number-page">
                                    <span>{ayat.nomor}</span>
                                </div>
                                <div className="ayat-latin">
                                    <h3>{ayat.ar}</h3>
                                </div>
                                <div className="ayat-tr">
                                    <h3>{ayat.tr}</h3>
                                </div>
                                <div className="ayat-idn">
                                    <p>{ayat.idn}</p>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </>
    )
}