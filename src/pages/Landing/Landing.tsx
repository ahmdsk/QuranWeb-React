import { Link } from 'react-router-dom'
import {
  BookOpen,
  Calendar,
  Clock,
  Compass,
  MapPin,
  Moon,
  Navigation,
  Sun,
  Laptop,
  ChevronDown,
  Loader2,
  ArrowRight,
  Search,
  Check,
  Filter,
  X
} from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { shalatService } from '../../services/shalatService'
import { JadwalShalatData, JadwalShalatItem } from '../../types'
import { useTheme } from '../../context/ThemeContext'

export default function Landing() {
  const { theme, setTheme, resolvedTheme } = useTheme()

  const [provinsiList, setProvinsiList] = useState<string[]>([])
  const [kabkotaList, setKabkotaList] = useState<string[]>([])
  const [selectedProvinsi, setSelectedProvinsi] = useState<string>('Jawa Barat')
  const [selectedKabkota, setSelectedKabkota] = useState<string>('Kota Bandung')
  const [selectedBulan, setSelectedBulan] = useState<number>(new Date().getMonth() + 1)
  const [selectedTahun, setSelectedTahun] = useState<number>(new Date().getFullYear())

  // Modal / Dialog Filter State
  const [isFilterModalOpen, setIsFilterModalOpen] = useState<boolean>(false)

  // Dropdown states inside modal
  const [openProvDropdown, setOpenProvDropdown] = useState<boolean>(false)
  const [openKabDropdown, setOpenKabDropdown] = useState<boolean>(false)
  const [openBulanDropdown, setOpenBulanDropdown] = useState<boolean>(false)
  const [openTahunDropdown, setOpenTahunDropdown] = useState<boolean>(false)
  const [openThemeDropdown, setOpenThemeDropdown] = useState<boolean>(false)

  const [searchProv, setSearchProv] = useState<string>('')
  const [searchKab, setSearchKab] = useState<string>('')

  const provRef = useRef<HTMLDivElement>(null)
  const kabRef = useRef<HTMLDivElement>(null)
  const bulanRef = useRef<HTMLDivElement>(null)
  const tahunRef = useRef<HTMLDivElement>(null)
  const themeRef = useRef<HTMLDivElement>(null)

  const [jadwalData, setJadwalData] = useState<JadwalShalatData | null>(null)
  const [todaySchedule, setTodaySchedule] = useState<JadwalShalatItem | null>(null)
  const [nextPrayer, setNextPrayer] = useState<{ name: string; time: string; countdown: string } | null>(null)
  const [currentTime, setCurrentTime] = useState<Date>(new Date())

  // Real-time Digital Clock Effect
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const [isLoadingProv, setIsLoadingProv] = useState<boolean>(false)
  const [isLoadingKab, setIsLoadingKab] = useState<boolean>(false)
  const [isLoadingJadwal, setIsLoadingJadwal] = useState<boolean>(false)
  const [isLocating, setIsLocating] = useState<boolean>(false)
  const [locationStatus, setLocationStatus] = useState<string>('')

  const [showMonthlyView, setShowMonthlyView] = useState<boolean>(false)

  const bulanNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ]

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (provRef.current && !provRef.current.contains(e.target as Node)) setOpenProvDropdown(false)
      if (kabRef.current && !kabRef.current.contains(e.target as Node)) setOpenKabDropdown(false)
      if (bulanRef.current && !bulanRef.current.contains(e.target as Node)) setOpenBulanDropdown(false)
      if (tahunRef.current && !tahunRef.current.contains(e.target as Node)) setOpenTahunDropdown(false)
      if (themeRef.current && !themeRef.current.contains(e.target as Node)) setOpenThemeDropdown(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    fetchProvinces()
  }, [])

  useEffect(() => {
    if (selectedProvinsi) {
      fetchKabKota(selectedProvinsi)
    }
  }, [selectedProvinsi])

  useEffect(() => {
    if (selectedProvinsi && selectedKabkota) {
      fetchJadwal(selectedProvinsi, selectedKabkota, selectedBulan, selectedTahun)
    }
  }, [selectedProvinsi, selectedKabkota, selectedBulan, selectedTahun])

  const fetchProvinces = async () => {
    setIsLoadingProv(true)
    try {
      const provs = await shalatService.getProvinsi()
      if (provs && provs.length > 0) {
        setProvinsiList(provs)
        if (!provs.includes(selectedProvinsi)) {
          setSelectedProvinsi(provs[0])
        }
      }
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoadingProv(false)
    }
  }

  const fetchKabKota = async (prov: string) => {
    setIsLoadingKab(true)
    try {
      const kabs = await shalatService.getKabKota(prov)
      if (kabs && kabs.length > 0) {
        setKabkotaList(kabs)
        if (!kabs.includes(selectedKabkota)) {
          setSelectedKabkota(kabs[0])
        }
      }
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoadingKab(false)
    }
  }

  const fetchJadwal = async (prov: string, kab: string, bul: number, thn: number) => {
    setIsLoadingJadwal(true)
    try {
      const data = await shalatService.getJadwalShalat(prov, kab, bul, thn)
      if (data) {
        setJadwalData(data)
        const currentDay = new Date().getDate()
        const foundToday = data.jadwal.find(j => j.tanggal === currentDay) || data.jadwal[0]
        setTodaySchedule(foundToday)
        calculateNextPrayer(foundToday)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoadingJadwal(false)
    }
  }

  const calculateNextPrayer = (schedule: JadwalShalatItem) => {
    if (!schedule) return
    const now = new Date()
    const currentTimeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`

    const prayers = [
      { name: 'Subuh', time: schedule.subuh },
      { name: 'Dhuha', time: schedule.dhuha },
      { name: 'Dzuhur', time: schedule.dzuhur },
      { name: 'Ashar', time: schedule.ashar },
      { name: 'Maghrib', time: schedule.maghrib },
      { name: 'Isya', time: schedule.isya }
    ]

    let foundNext = prayers.find(p => p.time > currentTimeStr)
    if (!foundNext) {
      foundNext = { name: 'Subuh', time: schedule.subuh }
    }

    const [pHours, pMins] = foundNext.time.split(':').map(Number)
    const targetDate = new Date()
    targetDate.setHours(pHours, pMins, 0, 0)
    if (targetDate < now) {
      targetDate.setDate(targetDate.getDate() + 1)
    }

    const diffMs = targetDate.getTime() - now.getTime()
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60))
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))

    let countdownStr = ''
    if (diffHrs > 0) {
      countdownStr = `${diffHrs}j ${diffMins}m`
    } else {
      countdownStr = `${diffMins} menit`
    }

    setNextPrayer({
      name: foundNext.name,
      time: foundNext.time,
      countdown: countdownStr
    })
  }

  const handleTrackLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus('Browser tidak mendukung GPS')
      return
    }

    setIsLocating(true)
    setLocationStatus('Mencari posisi Anda...')

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords
        const locResult = await shalatService.reverseGeocode(latitude, longitude)
        setIsLocating(false)

        if (locResult && locResult.provinsi) {
          const matchedProv = provinsiList.find(p =>
            p.toLowerCase().includes(locResult.provinsi!.toLowerCase()) ||
            locResult.provinsi!.toLowerCase().includes(p.toLowerCase())
          )

          if (matchedProv) {
            setSelectedProvinsi(matchedProv)
            setLocationStatus(`Terdeteksi: ${matchedProv}`)
            const kabs = await shalatService.getKabKota(matchedProv)
            if (kabs.length > 0) {
              setKabkotaList(kabs)
              if (locResult.kabkota) {
                const matchedKab = kabs.find(k =>
                  k.toLowerCase().includes(locResult.kabkota!.toLowerCase()) ||
                  locResult.kabkota!.toLowerCase().includes(k.toLowerCase())
                )
                if (matchedKab) setSelectedKabkota(matchedKab)
                else setSelectedKabkota(kabs[0])
              } else {
                setSelectedKabkota(kabs[0])
              }
            }
          } else {
            setLocationStatus('Silakan pilih provinsi Anda dari daftar.')
          }
        } else {
          setLocationStatus('Gagal mendeteksi wilayah secara presisi.')
        }
        setTimeout(() => setLocationStatus(''), 4000)
      },
      (error) => {
        setIsLocating(false)
        console.error(error)
        setLocationStatus('Akses GPS ditolak.')
        setTimeout(() => setLocationStatus(''), 4000)
      },
      { timeout: 10000 }
    )
  }

  const filteredProvList = provinsiList.filter(p => p.toLowerCase().includes(searchProv.toLowerCase()))
  const filteredKabList = kabkotaList.filter(k => k.toLowerCase().includes(searchKab.toLowerCase()))

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#070c18] text-slate-800 dark:text-slate-100 font-sans selection:bg-emerald-500 selection:text-white transition-colors duration-200">
      
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-[#070c18]/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800/80 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold shadow-md">
              <BookOpen className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white font-heading">
              Qu<span className="text-emerald-600 dark:text-emerald-400">read</span>
            </span>
          </div>

          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-600 dark:text-slate-300">
            <a href="#jadwal" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Jadwal Shalat</a>
            <a href="#fitur" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Fitur</a>
            <a href="#quran" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Al-Qur'an</a>
          </nav>

          <div className="flex items-center space-x-3">
            {/* Theme Selector */}
            <div className="relative" ref={themeRef}>
              <button
                type="button"
                onClick={() => setOpenThemeDropdown(!openThemeDropdown)}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5 text-xs font-semibold"
                title="Pilih Mode Tema"
              >
                {resolvedTheme === 'dark' ? (
                  <Moon className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Sun className="w-4 h-4 text-amber-500" />
                )}
                <span className="capitalize hidden sm:inline">{theme}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {openThemeDropdown && (
                <div className="absolute right-0 mt-2 w-36 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl z-50 p-1.5 space-y-1">
                  <button
                    onClick={() => { setTheme('light'); setOpenThemeDropdown(false) }}
                    className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-left ${theme === 'light' ? 'bg-emerald-50 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 font-bold' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                  >
                    <Sun className="w-3.5 h-3.5 text-amber-500" /> Light Mode
                  </button>
                  <button
                    onClick={() => { setTheme('dark'); setOpenThemeDropdown(false) }}
                    className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-left ${theme === 'dark' ? 'bg-emerald-50 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 font-bold' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                  >
                    <Moon className="w-3.5 h-3.5 text-emerald-400" /> Dark Mode
                  </button>
                  <button
                    onClick={() => { setTheme('system'); setOpenThemeDropdown(false) }}
                    className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-left ${theme === 'system' ? 'bg-emerald-50 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 font-bold' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                  >
                    <Laptop className="w-3.5 h-3.5 text-slate-500" /> System Default
                  </button>
                </div>
              )}
            </div>

            <Link
              to="/home"
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-all flex items-center gap-1.5 shadow-md shadow-emerald-600/20"
            >
              Baca Qur'an
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 md:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          <div className="lg:col-span-7 space-y-6">
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight text-slate-900 dark:text-white font-heading">
              Al-Qur'an Digital & <br />
              <span className="text-emerald-600 dark:text-emerald-400">
                Waktu Shalat Otomatis
              </span>
            </h1>

            <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl">
              Platform Al-Qur'an digital yang bersih, modern, dan responsif. Memudahkan Anda membaca ayat suci Al-Qur'an serta memantau waktu shalat presisi untuk seluruh wilayah kabupaten dan kota di Indonesia.
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <button
                onClick={() => setIsFilterModalOpen(true)}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md shadow-emerald-600/20 flex items-center gap-2"
              >
                <Filter className="w-4 h-4" />
                Ubah Lokasi & Waktu
              </button>
              <button
                onClick={handleTrackLocation}
                disabled={isLocating}
                className="px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white text-xs font-bold transition-all flex items-center gap-2"
              >
                <Navigation className="w-4 h-4 text-emerald-400" />
                {isLocating ? 'Deteksi GPS...' : 'Lokasi Saya'}
              </button>
            </div>
          </div>

          {/* Right Hero Card Spotlight */}
          <div className="lg:col-span-5">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xl space-y-4 relative">
              
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-1.5 font-heading">
                    <MapPin className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    {selectedKabkota}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{selectedProvinsi}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsFilterModalOpen(true)}
                    className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                    title="Ubah Filter Lokasi & Waktu"
                  >
                    <Filter className="w-4 h-4" />
                  </button>
                  <span className="text-[10px] uppercase font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800/60">
                    {todaySchedule?.hari || 'Hari Ini'}
                  </span>
                </div>
              </div>

              {/* Real-time Digital Clock Display */}
              <div className="bg-emerald-500/10 dark:bg-emerald-950/40 border border-emerald-500/20 dark:border-emerald-800/40 p-3 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-semibold text-xs">
                  <Clock className="w-4 h-4 text-emerald-600 dark:text-emerald-400 animate-pulse" />
                  <span>Waktu Sekarang</span>
                </div>
                <div className="text-right font-mono font-extrabold text-lg text-emerald-700 dark:text-emerald-300 tracking-wider">
                  {currentTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })} <span className="text-xs font-semibold px-1.5 py-0.5 rounded bg-emerald-600 text-white">{shalatService.getTimeZone(selectedProvinsi)}</span>
                </div>
              </div>

              {nextPrayer && (
                <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-3.5 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-medium">Shalat Berikutnya</span>
                    <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400 font-heading">{nextPrayer.name}</span>
                    <span className="text-xs text-slate-600 dark:text-slate-300 block font-mono">{nextPrayer.time} {shalatService.getTimeZone(selectedProvinsi)}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-semibold">Sisa Waktu</span>
                    <span className="text-sm font-bold font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/80 px-3 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800/80 inline-block mt-0.5">
                      {nextPrayer.countdown}
                    </span>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-3 gap-2">
                {[
                  { name: 'Subuh', time: todaySchedule?.subuh },
                  { name: 'Dzuhur', time: todaySchedule?.dzuhur },
                  { name: 'Ashar', time: todaySchedule?.ashar },
                  { name: 'Maghrib', time: todaySchedule?.maghrib },
                  { name: 'Isya', time: todaySchedule?.isya },
                  { name: 'Imsak', time: todaySchedule?.imsak }
                ].map((item, idx) => (
                  <div key={idx} className="bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800/80 text-center">
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium block uppercase">{item.name}</span>
                    <span className="text-sm font-bold font-mono text-slate-800 dark:text-slate-200">
                      {item.time || '--:--'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* JADWAL SHALAT BULANAN SECTION */}
      <section id="jadwal" className="py-14 bg-slate-100 dark:bg-[#050914] border-t border-b border-slate-200 dark:border-slate-800/80 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight font-heading">Jadwal Shalat Bulanan</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Menampilkan jadwal untuk {selectedKabkota}, {selectedProvinsi} ({bulanNames[selectedBulan - 1]} {selectedTahun})
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsFilterModalOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center gap-2 shadow-sm"
              >
                <Filter className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                Ubah Lokasi
              </button>

              <button
                onClick={handleTrackLocation}
                disabled={isLocating}
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all flex items-center gap-2 shadow-md"
              >
                <Navigation className="w-4 h-4" />
                {isLocating ? 'Deteksi GPS...' : 'GPS Lokasi Saya'}
              </button>
            </div>
          </div>

          {locationStatus && (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-emerald-800 dark:text-emerald-300 text-xs rounded-xl flex items-center gap-2">
              <Compass className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>{locationStatus}</span>
            </div>
          )}

          {/* Table Results */}
          {isLoadingJadwal ? (
            <div className="py-12 text-center text-slate-500 dark:text-slate-400 text-xs flex justify-center items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-emerald-500" />
              Memuat data jadwal shalat...
            </div>
          ) : jadwalData ? (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 overflow-x-auto shadow-sm">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-bold uppercase">
                    <th className="py-3 px-3">Tgl</th>
                    <th className="py-3 px-3">Hari</th>
                    <th className="py-3 px-3 text-slate-400">Imsak</th>
                    <th className="py-3 px-3 text-emerald-600 dark:text-emerald-400">Subuh</th>
                    <th className="py-3 px-3">Terbit</th>
                    <th className="py-3 px-3">Dhuha</th>
                    <th className="py-3 px-3">Dzuhur</th>
                    <th className="py-3 px-3 text-emerald-600 dark:text-emerald-400">Ashar</th>
                    <th className="py-3 px-3 text-emerald-600 dark:text-emerald-400">Maghrib</th>
                    <th className="py-3 px-3">Isya</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50 font-mono">
                  {jadwalData.jadwal.map((item) => {
                    const todayDate = new Date()
                    const isToday =
                      item.tanggal === todayDate.getDate() &&
                      selectedBulan === todayDate.getMonth() + 1 &&
                      selectedTahun === todayDate.getFullYear()

                    return (
                      <tr
                        key={item.tanggal}
                        className={`hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-all ${
                          isToday
                            ? 'bg-emerald-100/80 dark:bg-emerald-950/80 text-emerald-950 dark:text-emerald-300 font-extrabold border-l-4 border-l-emerald-600 shadow-sm'
                            : 'text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <td className="py-3 px-3 font-sans flex items-center gap-2">
                          <span>{item.tanggal}</span>
                          {isToday && (
                            <span className="text-[9px] uppercase font-black px-2 py-0.5 rounded-md bg-emerald-600 text-white shadow-xs">
                              Hari Ini
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-3 font-sans">{item.hari}</td>
                        <td className="py-3 px-3 text-slate-500 dark:text-slate-400">{item.imsak}</td>
                        <td className="py-3 px-3 text-emerald-700 dark:text-emerald-400 font-semibold">{item.subuh}</td>
                        <td className="py-3 px-3">{item.terbit}</td>
                        <td className="py-3 px-3">{item.dhuha}</td>
                        <td className="py-3 px-3">{item.dzuhur}</td>
                        <td className="py-3 px-3 text-emerald-700 dark:text-emerald-400 font-semibold">{item.ashar}</td>
                        <td className="py-3 px-3 text-emerald-700 dark:text-emerald-400 font-semibold">{item.maghrib}</td>
                        <td className="py-3 px-3">{item.isya}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          ) : null}

        </div>
      </section>

      {/* QUICK SURAH SECTION */}
      <section id="quran" className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white font-heading">Baca Al-Qur'an Online</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Pilihan surah populer</p>
          </div>
          <Link to="/home" className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1">
            Semua Surah <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { id: 1, name: 'Al-Fatihah', verses: 7, arabic: 'الفاتحة' },
            { id: 36, name: 'Yasin', verses: 83, arabic: 'يس' },
            { id: 67, name: 'Al-Mulk', verses: 30, arabic: 'الملك' },
            { id: 18, name: 'Al-Kahf', verses: 110, arabic: 'الكهف' }
          ].map((s) => (
            <Link
              key={s.id}
              to={`/surah/${s.id}`}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 p-4 rounded-xl flex items-center justify-between transition-all shadow-sm hover:shadow-md"
            >
              <div className="flex items-center space-x-3">
                <span className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 font-bold text-xs flex items-center justify-center">
                  {s.id}
                </span>
                <div>
                  <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 font-heading">{s.name}</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">{s.verses} Ayat</p>
                </div>
              </div>
              <span className="font-arabic text-xl text-emerald-600 dark:text-emerald-400">{s.arabic}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* FILTER MODAL DIALOG */}
      {isFilterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-lg rounded-2xl shadow-2xl p-6 space-y-5 relative">
            
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-white font-heading">
                  Filter Wilayah & Periode
                </h3>
              </div>
              <button
                onClick={() => setIsFilterModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              
              {/* Provinsi Combobox */}
              <div className="space-y-1.5 relative" ref={provRef}>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 block">
                  Provinsi
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setOpenProvDropdown(!openProvDropdown)
                    setOpenKabDropdown(false)
                    setOpenBulanDropdown(false)
                    setOpenTahunDropdown(false)
                  }}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 text-left rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center justify-between transition-all"
                >
                  <span className="truncate">{selectedProvinsi || 'Pilih Provinsi'}</span>
                  {isLoadingProv ? (
                    <Loader2 className="w-4 h-4 animate-spin text-emerald-500" />
                  ) : (
                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${openProvDropdown ? 'rotate-180' : ''}`} />
                  )}
                </button>

                {openProvDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl overflow-hidden p-2">
                    <div className="relative mb-2">
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        placeholder="Cari provinsi..."
                        value={searchProv}
                        onChange={(e) => setSearchProv(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 text-xs rounded-lg pl-8 pr-3 py-1.5 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div className="max-h-40 overflow-y-auto custom-scrollbar space-y-1">
                      {filteredProvList.map((p) => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => {
                            setSelectedProvinsi(p)
                            setOpenProvDropdown(false)
                            setSearchProv('')
                          }}
                          className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium flex items-center justify-between transition-colors ${selectedProvinsi === p ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 font-bold' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                        >
                          <span className="truncate">{p}</span>
                          {selectedProvinsi === p && <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Kab/Kota Combobox */}
              <div className="space-y-1.5 relative" ref={kabRef}>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 block">
                  Kabupaten / Kota
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setOpenKabDropdown(!openKabDropdown)
                    setOpenProvDropdown(false)
                    setOpenBulanDropdown(false)
                    setOpenTahunDropdown(false)
                  }}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 text-left rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center justify-between transition-all"
                >
                  <span className="truncate">{selectedKabkota || 'Pilih Kota'}</span>
                  {isLoadingKab ? (
                    <Loader2 className="w-4 h-4 animate-spin text-emerald-500" />
                  ) : (
                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${openKabDropdown ? 'rotate-180' : ''}`} />
                  )}
                </button>

                {openKabDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl overflow-hidden p-2">
                    <div className="relative mb-2">
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        placeholder="Cari kab/kota..."
                        value={searchKab}
                        onChange={(e) => setSearchKab(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 text-xs rounded-lg pl-8 pr-3 py-1.5 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div className="max-h-40 overflow-y-auto custom-scrollbar space-y-1">
                      {filteredKabList.map((k) => (
                        <button
                          key={k}
                          type="button"
                          onClick={() => {
                            setSelectedKabkota(k)
                            setOpenKabDropdown(false)
                            setSearchKab('')
                          }}
                          className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium flex items-center justify-between transition-colors ${selectedKabkota === k ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 font-bold' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                        >
                          <span className="truncate">{k}</span>
                          {selectedKabkota === k && <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Bulan & Tahun */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 block">
                  Bulan & Tahun
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <div className="relative" ref={bulanRef}>
                    <button
                      type="button"
                      onClick={() => setOpenBulanDropdown(!openBulanDropdown)}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-left rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center justify-between"
                    >
                      <span>{bulanNames[selectedBulan - 1]}</span>
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                    </button>
                    {openBulanDropdown && (
                      <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl overflow-hidden p-1 max-h-40 overflow-y-auto custom-scrollbar">
                        {bulanNames.map((b, idx) => (
                          <button
                            key={b}
                            type="button"
                            onClick={() => { setSelectedBulan(idx + 1); setOpenBulanDropdown(false) }}
                            className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium ${selectedBulan === idx + 1 ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 font-bold' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                          >
                            {b}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="relative" ref={tahunRef}>
                    <button
                      type="button"
                      onClick={() => setOpenTahunDropdown(!openTahunDropdown)}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-left rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center justify-between"
                    >
                      <span>{selectedTahun}</span>
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                    </button>
                    {openTahunDropdown && (
                      <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl overflow-hidden p-1">
                        {[2025, 2026, 2027].map((y) => (
                          <button
                            key={y}
                            type="button"
                            onClick={() => { setSelectedTahun(y); setOpenTahunDropdown(false) }}
                            className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium ${selectedTahun === y ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 font-bold' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                          >
                            {y}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleTrackLocation}
                disabled={isLocating}
                className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-all flex items-center gap-1.5"
              >
                <Navigation className="w-3.5 h-3.5 text-emerald-500" />
                {isLocating ? 'Deteksi GPS...' : 'Gunakan GPS'}
              </button>

              <button
                type="button"
                onClick={() => setIsFilterModalOpen(false)}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md"
              >
                Tampilkan Jadwal
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-8 text-center text-xs text-slate-500">
        <p>&copy; {new Date().getFullYear()} Quread. Platform Al-Qur'an & Jadwal Shalat Digital Indonesia.</p>
      </footer>

    </div>
  )
}