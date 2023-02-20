import { useContext } from "react"
import { AppContext } from "../../context/AppContext"

export default function BannerHome() {
    const apps = useContext(AppContext)

    return (
        <div className="banner">
            <div className="left-info">
                <div className="container-last-read">
                    <img src="/read-logo.svg" alt="Icon Read" />
                    <h3 className="last-read">Last Read</h3>
                </div>
                <div className="container-surah">
                    {Object.keys(apps.lastRead).length > 0 ? (
                        <>
                            <h3 className="surah-name">{apps.lastRead.nama_latin}</h3>
                            <h5 className="surah-number">Surah No: {apps.lastRead.nomor}</h5>
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
    )
}
