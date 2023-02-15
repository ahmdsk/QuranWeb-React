export default function BannerSurah(props) {
    return (
        <div className="banner-surah">
            <h3 className="surah-name-banner">{props.surah.nama_latin}</h3>
            <h4 className="surah-arti">{props.surah.arti}</h4>
            <span className="diver"></span>
            <p className="surah-ayat-locate">{props.surah.tempat_turun} - {props.surah.jumlah_ayat} Ayat</p>
            <img src="/bismillah.svg" alt="Bismillah" className="bismillah-img" />
            <img src="/quran.svg" alt="Quran" className="quran-surah" />
        </div>
    )
}