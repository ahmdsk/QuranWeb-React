import { useContext } from "react"
import { AppContext } from "../../context/AppContext"

export default function InputSearchHome() {
    const apps = useContext(AppContext)

    const handleSearchSurah = (e) => {
        apps.setSearch(e.target.value.toLowerCase())
    }

    return (
        <div className="seacrhBar" ref={apps.searchInput}>
            <input type="text" placeholder="Search Surah..." onChange={handleSearchSurah} />
        </div>
    )
}