import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, X } from 'lucide-react'
import { useApp } from '../context/AppContext'

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from './ui/dialog'
import { Input } from './ui/input'
import { Button } from './ui/button'

const SearchDialog = () => {
    const navigate = useNavigate()
    const { surahs } = useApp()
    const [open, setOpen] = useState(false)
    const [search, setSearch] = useState('')
    const [filteredSurahs, setFilteredSurahs] = useState([])

    useEffect(() => {
        if (search) {
            const filtered = surahs.filter(
                (surah) =>
                    surah.namaLatin.toLowerCase().includes(search.toLowerCase()) ||
                    surah.nama.toLowerCase().includes(search.toLowerCase()) ||
                    surah.arti.toLowerCase().includes(search.toLowerCase())
            )
            setFilteredSurahs(filtered)
        } else {
            setFilteredSurahs([])
        }
    }, [search, surahs])

    const handleSurahClick = (surahNumber) => {
        navigate(`/surah/${surahNumber}`)
        setOpen(false)
        setSearch('')
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9"
                >
                    <Search className="h-4 w-4" />
                    <span className="sr-only">Search</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Cari Surah</DialogTitle>
                </DialogHeader>
                <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Cari surah..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-8"
                    />
                    {search && (
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute right-2 top-1 h-7 w-7"
                            onClick={() => setSearch('')}
                        >
                            <X className="h-4 w-4" />
                            <span className="sr-only">Clear search</span>
                        </Button>
                    )}
                </div>
                <div className="mt-4 max-h-[300px] overflow-y-auto">
                    {filteredSurahs.length > 0 ? (
                        <div className="space-y-2">
                            {filteredSurahs.map((surah) => (
                                <button
                                    key={surah.nomor}
                                    onClick={() => handleSurahClick(surah.nomor)}
                                    className="flex w-full items-center justify-between rounded-lg border p-3 text-left hover:bg-accent"
                                >
                                    <div>
                                        <p className="font-medium">{surah.namaLatin}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {surah.arti}
                                        </p>
                                    </div>
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
                                        {surah.nomor}
                                    </div>
                                </button>
                            ))}
                        </div>
                    ) : search ? (
                        <p className="text-center text-sm text-muted-foreground">
                            Tidak ada surah yang ditemukan
                        </p>
                    ) : null}
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default SearchDialog