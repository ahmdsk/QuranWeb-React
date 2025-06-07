export interface Verse {
    nomorAyat: number
    teksArab: string
    teksLatin: string
    teksIndonesia: string
    audio: {
        [key: string]: string
    }
}

export interface Surah {
    nomor: number
    nama: string
    namaLatin: string
    jumlahAyat: number
    tempatTurun: string
    arti: string
    deskripsi: string
    audioFull: {
        [key: string]: string
    }
    ayat: Array<Verse>
}

export interface LastRead {
    id: number
    name: string
    arabicName: string
    translation: string
    verseCount: number
    lastRead: string
}

export interface AppContextType {
    surahs: Surah[]
    setSurahs: (surahs: Surah[]) => void
    lastRead: LastRead | null
    updateLastRead: (lastRead: LastRead) => void
    isSidebarOpen: boolean
    toggleSidebar: () => void
    theme: 'light' | 'dark'
    setTheme: (theme: 'light' | 'dark') => void
} 