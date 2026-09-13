import { User } from '@supabase/supabase-js'

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
  verseNumber?: number
  lastRead: string
}

export interface AppContextType {
  surahs: Surah[]
  setSurahs: (surahs: Surah[]) => void
  lastRead: LastRead | null
  updateLastRead: (lastRead: LastRead) => Promise<boolean>
  isSidebarOpen: boolean
  toggleSidebar: () => void
  theme: 'light' | 'dark'
  setTheme: (theme: 'light' | 'dark') => void
  globalTheme?: string
  setGlobalTheme?: (theme: any) => void
  selectedQari?: string
  handleQariChange?: (qari: string) => void
  currentUser: User | null
  isAuthModalOpen?: boolean
  setIsAuthModalOpen?: (open: boolean) => void
}

export interface JadwalShalatItem {
  tanggal: number
  tanggal_lengkap: string
  hari: string
  imsak: string
  subuh: string
  terbit: string
  dhuha: string
  dzuhur: string
  ashar: string
  maghrib: string
  isya: string
}

export interface JadwalShalatData {
  provinsi: string
  kabkota: string
  bulan: number
  tahun: number
  bulan_nama: string
  jadwal: JadwalShalatItem[]
}