import { Surah } from "@/types"

export default function BannerSurah(props: {
    surah: Surah | null
}) {
    return (
        <div className="banner-surah">
            <h3 className="surah-name-banner">{props.surah?.namaLatin}</h3>
            <h4 className="surah-arti">{props.surah?.arti}</h4>
            <span className="diver"></span>
            <p className="surah-ayat-locate">{props.surah?.tempatTurun} - {props.surah?.jumlahAyat} Ayat</p>
            <img src="/bismillah.svg" alt="Bismillah" className="bismillah-img" />
            <img src="/quran.svg" alt="Quran" className="quran-surah" />
        </div>
    )
}