import { useContext } from "react"
import { AppContext } from '../../features/context/AppContext'
import { Search } from 'lucide-react'

export default function InputSearchHome() {
    const apps = useContext(AppContext)

    const handleSearchSurah = (e) => {
        apps.setSearch(e.target.value.toLowerCase())
    }

    return (
        <div 
            ref={apps.searchInput}
            className="mb-6 hidden"
        >
            <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                    type="text"
                    placeholder="Search Surah..."
                    onChange={handleSearchSurah}
                    className="w-full rounded-lg border bg-background px-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
            </div>
        </div>
    )
}