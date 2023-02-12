import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import './Home.css'

export default function Home() {
    const [surah, setSurah] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function getAllSurah() {
            const request = await fetch('https://equran.id/api/surat');
            const response = await request.json();

            setSurah(response)
            setLoading(false)
        }

        getAllSurah()
    }, []);

    return (
        <>
            <div className="topBar">
                <span>
                    <img src="/menu-2-line.svg" alt="" />
                </span>
                <div className="title-home">
                    <Link to="/">Quran App</Link>
                </div>
                <span>
                    <img src="/search-line.svg" alt="" />
                </span>
            </div>

            <div className="banner">
                <div className="left-info">
                    <div className="container-last-read">
                        <img src="/read-logo.svg" alt="Icon Read" />
                        <h3 className="last-read">Last Read</h3>
                    </div>
                    <div className="container-surah">
                        <h3 className="surah-name">Al-Fatihah</h3>
                        <h5 className="surah-number">Ayat No: 1</h5>
                    </div>
                </div>
                <div className="right-info">
                    <img src="/quran.svg" alt="Quran" />
                </div>
            </div>

            {loading ? (<span className="loading">Loading Content...</span>) : (
                <div className="list-surah">
                    {surah.map((s) => {
                        return (
                            <div className="surah" key={s.nomor}>
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
            )}
        </>
    )
}