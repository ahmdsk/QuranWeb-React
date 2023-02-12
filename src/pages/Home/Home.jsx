import './Home.css'

export default function Home() {
    return (
        <>
            <div className="topBar">
                <span>
                    <img src="/menu-2-line.svg" alt="" />
                </span>
                <div className="title-home">Quran App</div>
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
        </>
    )
}