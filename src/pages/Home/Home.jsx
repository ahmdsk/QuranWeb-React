import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AiOutlineBug, AiOutlineClose, AiOutlineCoffee, AiOutlineFolderOpen, AiOutlineGithub, AiOutlineInstagram, AiOutlineWhatsApp } from "react-icons/ai"
import './Home.css'

export default function Home() {
    const [surah, setSurah] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [lastRead, setLastRead] = useState({})

    const navigate = useNavigate()
    const searchInput = useRef('')
    const sidebar = useRef('')

    document.title = 'Quran App'
    
    useEffect(() => {

        async function getAllSurah() {
            const request = await fetch('https://equran.id/api/surat');
            const response = await request.json();

            setSurah(response)
            setLoading(false)
        }

        getAllSurah()

        const lastSurah = JSON.parse(localStorage.getItem('lastRead'));
        lastSurah ? setLastRead(lastSurah) : setLastRead({})
    }, []);

    const detailSurah = (no_surah) => {
        navigate(`/surah/${no_surah}`)
    }

    const openSeachBar = () => {
        searchInput.current.classList.toggle('toggle-search')
    }

    const openMenu = () => {
        sidebar.current.classList.add('toggle-search')
    }

    const closeMenu = () => {
        sidebar.current.classList.remove('toggle-search')
    }

    const handleSearchSurah = (e) => {
        setSearch(e.target.value.toLowerCase())
    }

    return (
        <>
            <div className="topBar">
                <span onClick={openMenu}>
                    <img src="/menu-2-line.svg" alt="" />
                </span>
                <div className="title-home">
                    <Link to="/">Quran App</Link>
                </div>
                <span onClick={openSeachBar}>
                    <img src="/search-line.svg" alt="Search" />
                </span>
            </div>

            <div className="sidebar" ref={sidebar}>
                <div className="sidebar-top">
                    <h3>Menu</h3>
                    <AiOutlineClose onClick={closeMenu} />
                </div>
                <div className="sidebar-body">
                    <div className="sidebar-body-menu">
                        <ul>
                            <li>
                                <AiOutlineCoffee />
                                <a href="#">Trakteer coffe</a>
                            </li>
                            <li>
                                <AiOutlineBug />
                                <a href="#"> Report bug</a>
                            </li>
                            <li>
                                <AiOutlineFolderOpen />
                                <a href="#">This Repository</a>
                            </li>
                        </ul>
                    </div>
                    <div className="sidebar-footer">
                        <h3 className="footer-title">Contact me</h3>
                        <div className="icons-social">
                            <a href="https://www.github.com/ahmdsk" target="_blank" rel="noopener noreferrer"><AiOutlineGithub /></a>
                            <a href="https://www.wa.me/62895605997185" target="_blank" rel="noopener noreferrer"><AiOutlineWhatsApp /></a>
                            <a href="https://www.instagram.com/ahmdsk._" target="_blank" rel="noopener noreferrer"><AiOutlineInstagram /></a>
                        </div>
                        <h4 className="copyright">Developed by <b>Ahmad Shaleh</b></h4>
                    </div>
                </div>
            </div>

            <div className="seacrhBar" ref={searchInput}>
                <input type="text" placeholder="Search Surah..." onChange={handleSearchSurah} />
            </div>

            <div className="banner">
                <div className="left-info">
                    <div className="container-last-read">
                        <img src="/read-logo.svg" alt="Icon Read" />
                        <h3 className="last-read">Last Read</h3>
                    </div>
                    <div className="container-surah">
                        {Object.keys(lastRead).length > 0 ? (
                            <>
                                <h3 className="surah-name">{lastRead.nama_latin}</h3>
                                <h5 className="surah-number">Ayat No: {lastRead.nomor}</h5>
                            </>
                        ) : (
                            <h3 className="surah-name">nothing has been <br /> read yet.</h3>
                        )}
                    </div>
                </div>
                <div className="right-info">
                    <img src="/quran.svg" alt="Quran" />
                </div>
            </div>

            {loading ? (<span className="loading">Loading Content...</span>) : (
                <div className="list-surah">
                    {surah.filter((surah) => surah.nama_latin.toLowerCase().includes(search))
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
            )}
        </>
    )
}