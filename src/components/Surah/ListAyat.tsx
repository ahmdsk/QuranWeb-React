export default function ListAyat(props) {
    return (
        <div className="list-ayat">
            {props.surah.ayat.map((ayat) => {
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
    )
}