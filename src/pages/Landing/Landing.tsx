import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import {
  BookOpen,
  Calendar,
  Compass,
  MapPin,
  Search,
  Filter,
  Navigation,
  ChevronDown,
  Check,
  X,
  Loader2,
  Bookmark,
  ArrowRight,
  Sparkles,
  ExternalLink
} from 'lucide-react'
import { shalatService } from '@/services/shalatService'
import { JadwalShalatData, JadwalShalatItem } from '@/types'
import { useApp } from '@/context/AppContext'
import HeaderHome from '@/components/Home/HeaderHome'

export const Landing = () => {
  const { lastRead } = useApp()

  // Load initial location from localStorage or default
  const savedProv = localStorage.getItem('quread_user_provinsi')
  const savedKab = localStorage.getItem('quread_user_kabkota')

  // State lokasi & filter
  const [selectedProvinsi, setSelectedProvinsi] = useState<string>(savedProv || 'JAWA BARAT')
  const [selectedKabkota, setSelectedKabkota] = useState<string>(savedKab || 'KOTA BANDUNG')
  const [selectedBulan, setSelectedBulan] = useState<number>(new Date().getMonth() + 1)
  const [selectedTahun, setSelectedTahun] = useState<number>(new Date().getFullYear())

  const [provinsiList, setProvinsiList] = useState<string[]>([])
  const [kabkotaList, setKabkotaList] = useState<string[]>([])

  const [jadwalData, setJadwalData] = useState<JadwalShalatData | null>(null)
  const [isLoadingJadwal, setIsLoadingJadwal] = useState<boolean>(false)
  const [isLoadingKab, setIsLoadingKab] = useState<boolean>(false)
  const [isLocating, setIsLocating] = useState<boolean>(false)
  const [locationStatus, setLocationStatus] = useState<string>('')
  const [userAddressDetail, setUserAddressDetail] = useState<string>('')

  // State Modal Filter
  const [isFilterModalOpen, setIsFilterModalOpen] = useState<boolean>(false)
  const [openProvDropdown, setOpenProvDropdown] = useState<boolean>(false)
  const [openKabDropdown, setOpenKabDropdown] = useState<boolean>(false)
  const [openBulanDropdown, setOpenBulanDropdown] = useState<boolean>(false)
  const [openTahunDropdown, setOpenTahunDropdown] = useState<boolean>(false)

  const [searchProv, setSearchProv] = useState<string>('')
  const [searchKab, setSearchKab] = useState<string>('')

  const provRef = useRef<HTMLDivElement>(null)
  const kabRef = useRef<HTMLDivElement>(null)
  const bulanRef = useRef<HTMLDivElement>(null)
  const tahunRef = useRef<HTMLDivElement>(null)

  // Next Prayer Countdown
  const [nextPrayer, setNextPrayer] = useState<{ name: string; time: string; countdown: string } | null>(null)

  const bulanNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ]

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (provRef.current && !provRef.current.contains(e.target as Node)) setOpenProvDropdown(false)
      if (kabRef.current && !kabRef.current.contains(e.target as Node)) setOpenKabDropdown(false)
      if (bulanRef.current && !bulanRef.current.contains(e.target as Node)) setOpenBulanDropdown(false)
      if (tahunRef.current && !tahunRef.current.contains(e.target as Node)) setOpenTahunDropdown(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Initial Fetch Provinsi
  useEffect(() => {
    const fetchProv = async () => {
      const data = await shalatService.getProvinsi()
      if (data.length > 0) setProvinsiList(data)
    }
    fetchProv()
  }, [])

  // Fetch KabKota when Provinsi changes
  useEffect(() => {
    if (!selectedProvinsi) return
    const fetchKab = async () => {
      setIsLoadingKab(true)
      const data = await shalatService.getKabKota(selectedProvinsi)
      setKabkotaList(data)
      setIsLoadingKab(false)
      if (data.length > 0 && !data.includes(selectedKabkota)) {
        setSelectedKabkota(data[0])
      }
    }
    fetchKab()
  }, [selectedProvinsi])

  // Fetch Jadwal Shalat
  useEffect(() => {
    if (!selectedProvinsi || !selectedKabkota) return
    fetchJadwal()
  }, [selectedProvinsi, selectedKabkota, selectedBulan, selectedTahun])

  const fetchJadwal = async () => {
    setIsLoadingJadwal(true)
    try {
      const data = await shalatService.getJadwalShalat(
        selectedProvinsi,
        selectedKabkota,
        selectedBulan,
        selectedTahun
      )
      setJadwalData(data)
      if (data && data.jadwal) {
        const todayNum = new Date().getDate()
        const foundToday = data.jadwal.find((j) => j.tanggal === todayNum) || data.jadwal[0]
        calculateNextPrayer(foundToday)
      }
    } catch (err) {
      console.error(err)
    } fontinally: {
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

  // Save selected location to localStorage whenever changed
  const updateAndSaveLocation = (prov: string, kab: string) => {
    setSelectedProvinsi(prov)
    setSelectedKabkota(kab)
    localStorage.setItem('quread_user_provinsi', prov)
    localStorage.setItem('quread_user_kabkota', kab)
  }

  // Initial Auto Geolocation Track on Load (only if not manually saved by user before)
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          handleTrackLocationWithCoords(pos.coords.latitude, pos.coords.longitude)
        },
        () => {
          // Geolocation denied/unavailable, stay with saved or default
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 300000 }
      )
    }
  }, [provinsiList])

  const handleTrackLocationWithCoords = async (latitude: number, longitude: number) => {
    setIsLocating(true)
    setLocationStatus('Mencari posisi Anda...')

    const locResult = await shalatService.reverseGeocode(latitude, longitude)
    setIsLocating(false)

    if (locResult && locResult.provinsi) {
      const targetProvStr = locResult.provinsi.toLowerCase()
      const matchedProv = provinsiList.find(p => {
        const pLower = p.toLowerCase()
        return pLower.includes(targetProvStr) || targetProvStr.includes(pLower) ||
               (targetProvStr.includes('jakarta') && pLower.includes('jakarta'))
      })

      if (matchedProv) {
        let matchedKabName = ''
        const kabs = await shalatService.getKabKota(matchedProv)
        if (kabs.length > 0) {
          setKabkotaList(kabs)
          if (locResult.kabkota) {
            const targetKabStr = locResult.kabkota.toLowerCase().replace(/kota|kabupaten|kab\./gi, '').trim()
            const matchedKab = kabs.find(k => {
              const kClean = k.toLowerCase().replace(/kota|kabupaten|kab\./gi, '').trim()
              return kClean.includes(targetKabStr) || targetKabStr.includes(kClean)
            })
            if (matchedKab) {
              matchedKabName = matchedKab
            } else {
              matchedKabName = kabs[0]
            }
          } else {
            matchedKabName = kabs[0]
          }
        }
        updateAndSaveLocation(matchedProv, matchedKabName || selectedKabkota)
        if (locResult.displayName) {
          setUserAddressDetail(locResult.displayName)
        }
        setLocationStatus(`Lokasi Presisi: ${matchedKabName || selectedKabkota}`)
      } else {
        setLocationStatus('Silakan pilih provinsi Anda dari daftar.')
      }
    } else {
      setLocationStatus('Gagal mendeteksi wilayah secara presisi.')
    }
    setTimeout(() => setLocationStatus(''), 6000)
  }

  const handleTrackLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus('Browser tidak mendukung GPS')
      return
    }

    setIsLocating(true)
    setLocationStatus('Mencari posisi Anda...')

    navigator.geolocation.getCurrentPosition(
      (position) => {
        handleTrackLocationWithCoords(position.coords.latitude, position.coords.longitude)
      },
      () => {
        setIsLocating(false)
        setLocationStatus('Akses GPS ditolak.')
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
    )
  }

  const filteredProvList = provinsiList.filter(p => p.toLowerCase().includes(searchProv.toLowerCase()))
  const filteredKabList = kabkotaList.filter(k => k.toLowerCase().includes(searchKab.toLowerCase()))

  const todayNum = new Date().getDate()
  const todaySchedule = jadwalData?.jadwal.find(j => j.tanggal === todayNum) || jadwalData?.jadwal[0]

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      <HeaderHome />

      {/* HERO BANNER SECTION */}
      <section className="relative overflow-hidden pt-8 pb-16 md:pt-14 md:pb-24 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-b from-emerald-900 via-slate-900 to-slate-950 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-emerald-500/20 via-transparent to-transparent opacity-60"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">

            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30 backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>Al-Qur'an & Jadwal Shalat Digital Terlengkap</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black font-heading tracking-tight leading-tight">
                Membawa Keberkahan <br />
                <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-200 bg-clip-text text-transparent">
                  Dalam Setiap Bacaan Ayat
                </span>
              </h1>

              <p className="text-slate-300 text-sm sm:text-base max-w-xl font-normal leading-relaxed">
                Platform ibadah harian digital Indonesia dengan fitur Al-Qur'an lengkap, pencarian juz & surah, kompas kiblat digital presisi, dan jadwal shalat terupdate.
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <Link
                  to="/home"
                  className="px-6 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm transition-all shadow-lg shadow-emerald-500/30 flex items-center gap-2"
                >
                  <BookOpen className="w-4 h-4 fill-slate-950" />
                  <span>Mulai Baca Al-Qur'an</span>
                </Link>

                <Link
                  to="/qibla"
                  className="px-5 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm backdrop-blur-md transition-all border border-white/10 flex items-center gap-2"
                >
                  <Compass className="w-4 h-4 text-emerald-400" />
                  <span>Kompas Kiblat Presisi</span>
                </Link>
              </div>

              {/* Last Read Quick Widget */}
              {lastRead && (
                <div className="pt-2">
                  <Link
                    to={`/surah/${lastRead.id}?verse=${lastRead.verseNumber || 1}#verse-${lastRead.verseNumber || 1}`}
                    className="inline-flex items-center gap-3 p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-white hover:bg-white/15 transition-all text-xs"
                  >
                    <Bookmark className="w-4 h-4 text-amber-400 fill-amber-400" />
                    <div>
                      <span className="text-[10px] text-emerald-300 font-semibold block">Lanjutkan Bacaan Terakhir:</span>
                      <strong className="font-bold">{lastRead.name} (Ayat {lastRead.verseNumber || 1})</strong>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-300 ml-2" />
                  </Link>
                </div>
              )}
            </div>

            {/* Right Card Widget: Waktu Shalat Hari Ini */}
            <div className="lg:col-span-5">
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-2xl text-white space-y-5">

                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
                      <MapPin className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div className="overflow-hidden">
                      <h3 className="text-sm font-bold truncate max-w-[200px]">{selectedKabkota}</h3>
                      <p className="text-[10px] text-emerald-300 truncate max-w-[200px]" title={userAddressDetail || selectedProvinsi}>
                        {userAddressDetail || selectedProvinsi}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={handleTrackLocation}
                      disabled={isLocating}
                      className="px-2.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-all flex items-center gap-1 shadow-sm"
                      title="Deteksi ulang posisi GPS Saya"
                    >
                      <Navigation className={`w-3 h-3 ${isLocating ? 'animate-spin' : ''}`} />
                      <span className="hidden sm:inline">{isLocating ? 'GPS...' : 'Lokasi Saya'}</span>
                    </button>

                    <button
                      onClick={() => setIsFilterModalOpen(true)}
                      className="px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold transition-all flex items-center gap-1 border border-white/10"
                      title="Ganti Kota & Filter"
                    >
                      <Filter className="w-3 h-3 text-emerald-400" />
                      <span className="hidden sm:inline">Filter</span>
                    </button>
                  </div>
                </div>

                {/* Countdown Box */}
                {nextPrayer && (
                  <div className="bg-emerald-500/20 border border-emerald-500/40 rounded-2xl p-4 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-emerald-300 font-bold">Waktu Shalat Berikutnya</p>
                      <h4 className="text-xl font-black text-white">{nextPrayer.name} • {nextPrayer.time}</h4>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-emerald-200 block">Sisa Waktu</span>
                      <span className="text-sm font-black font-mono bg-emerald-600 px-2.5 py-1 rounded-lg text-white">
                        {nextPrayer.countdown}
                      </span>
                    </div>
                  </div>
                )}

                {/* Shalat Schedule Today Grid */}
                {todaySchedule ? (
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 pt-1 text-center font-mono">
                    {[
                      { name: 'Subuh', time: todaySchedule.subuh },
                      { name: 'Dhuha', time: todaySchedule.dhuha },
                      { name: 'Dzuhur', time: todaySchedule.dzuhur },
                      { name: 'Ashar', time: todaySchedule.ashar },
                      { name: 'Maghrib', time: todaySchedule.maghrib },
                      { name: 'Isya', time: todaySchedule.isya }
                    ].map((p) => (
                      <div
                        key={p.name}
                        className={`p-2 rounded-xl border text-xs transition-all ${nextPrayer?.name === p.name
                            ? 'bg-emerald-500 text-slate-950 font-black border-emerald-400 shadow-md scale-105'
                            : 'bg-white/5 border-white/10 text-slate-200 font-medium'
                          }`}
                      >
                        <span className="block text-[10px] font-sans text-slate-300">{p.name}</span>
                        <span className="font-bold">{p.time}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-6 text-center text-xs text-slate-300 flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
                    <span>Memuat Jadwal Hari Ini...</span>
                  </div>
                )}

              </div>
            </div>

          </div>

        </div>
      </section>

      {/* FEATURE CARDS NAVIGATION SECTION (RINGKAS & TERARAH) */}
      <section className="py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="text-xs font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800/60">
            Fitur Utama Quread
          </span>
          <h2 className="text-2xl sm:text-3xl font-black font-heading text-slate-900 dark:text-white">
            Layanan Ibadah Digital Terpadu
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Akses langsung ke berbagai fitur unggulan harian untuk menemani ibadah Anda di mana saja.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

          {/* Card 1: Baca Al-Qur'an */}
          <Link
            to="/home"
            className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 dark:hover:border-emerald-500 rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 font-bold flex items-center justify-center group-hover:scale-110 transition-transform">
                <BookOpen className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold font-heading text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors flex items-center gap-2">
                  <span>Al-Qur'an 30 Juz</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-emerald-500" />
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Lengkap 114 Surah, terjemahan, audio murottal merdu 5 qari, & tafsir per ayat.
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-bold text-emerald-600 dark:text-emerald-400">
              <span>Jelajahi Surah</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Card 2: Jadwal Shalat Bulanan */}
          <div
            onClick={() => setIsFilterModalOpen(true)}
            className="group cursor-pointer bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 dark:hover:border-emerald-500 rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-teal-100 dark:bg-teal-950/80 text-teal-600 dark:text-teal-400 font-bold flex items-center justify-center group-hover:scale-110 transition-transform">
                <Calendar className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold font-heading text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors flex items-center gap-2">
                  <span>Jadwal Shalat</span>
                  <Filter className="w-3.5 h-3.5 text-emerald-500" />
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Jadwal shalat bulanan lengkap seluruh kota di Indonesia (Subuh s/d Isya & Imsak).
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-bold text-emerald-600 dark:text-emerald-400">
              <span>Buka Jadwal Kota</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 3: Kompas Kiblat Layar Penuh */}
          <Link
            to="/qibla"
            className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 dark:hover:border-emerald-500 rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 font-bold flex items-center justify-center group-hover:scale-110 transition-transform">
                <Compass className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold font-heading text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors flex items-center gap-2">
                  <span>Kompas Kiblat</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-emerald-500" />
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Deteksi otomatis arah Kaaba Makkah dengan sensor gyroscope & koordinat GPS presisi.
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-bold text-emerald-600 dark:text-emerald-400">
              <span>Buka Kompas</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Card 4: Doa-Doa Harian & Dzikir */}
          <Link
            to="/doa"
            className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 dark:hover:border-emerald-500 rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-950/80 text-purple-600 dark:text-purple-400 font-bold flex items-center justify-center group-hover:scale-110 transition-transform">
                <Sparkles className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold font-heading text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors flex items-center gap-2">
                  <span>Doa-Doa Harian</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-emerald-500" />
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Kumpulan doa shahih Hisnul Muslim (doa harian, dzikir pagi petang, perjalanan, dll).
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-bold text-emerald-600 dark:text-emerald-400">
              <span>Buka Kumpulan Doa</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

        </div>
      </section>

      {/* QUICK SURAH POPULER ROW */}
      <section className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white font-heading">Surah Pilihan Populer</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Akses cepat bacaan rutin harian</p>
          </div>
          <Link to="/home" className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1">
            Lihat Semua <ArrowRight className="w-3 h-3" />
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
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 p-4 rounded-2xl flex items-center justify-between transition-all shadow-sm hover:shadow-md"
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

      {/* FILTER MODAL DIALOG (Termasuk Tabel Jadwal Bulanan saat dibuka) */}
      {isFilterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 relative">

            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-white font-heading">
                  Jadwal Shalat Bulanan ({selectedKabkota})
                </h3>
              </div>
              <button
                onClick={() => setIsFilterModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Filter Controls Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">

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
                  <span className="truncate">{selectedProvinsi}</span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${openProvDropdown ? 'rotate-180' : ''}`} />
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
                      <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl max-h-40 overflow-y-auto p-1.5 space-y-1">
                        {bulanNames.map((name, idx) => (
                          <button
                            key={name}
                            type="button"
                            onClick={() => { setSelectedBulan(idx + 1); setOpenBulanDropdown(false) }}
                            className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium ${selectedBulan === idx + 1 ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 font-bold' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                          >
                            {name}
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
                      <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl max-h-40 overflow-y-auto p-1.5 space-y-1">
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

            {/* GPS Location Auto Track Bar */}
            <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-950 p-3 rounded-2xl border border-slate-200 dark:border-slate-800">
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                <Navigation className="w-4 h-4 text-emerald-500" />
                {locationStatus || 'Lokasi otomatis melalui GPS'}
              </span>

              <button
                type="button"
                onClick={handleTrackLocation}
                disabled={isLocating}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-sm"
              >
                {isLocating ? 'Deteksi GPS...' : 'Gunakan GPS'}
              </button>
            </div>

            {/* Monthly Prayer Table inside Modal */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Tabel Jadwal Shalat {bulanNames[selectedBulan - 1]} {selectedTahun}
              </h4>

              {isLoadingJadwal ? (
                <div className="py-12 text-center text-slate-500 dark:text-slate-400 text-xs flex justify-center items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-emerald-500" />
                  Memuat data jadwal shalat...
                </div>
              ) : jadwalData ? (
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-2 overflow-x-auto shadow-inner">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-bold uppercase">
                        <th className="py-2.5 px-3">Tgl</th>
                        <th className="py-2.5 px-3">Hari</th>
                        <th className="py-2.5 px-3 text-slate-400">Imsak</th>
                        <th className="py-2.5 px-3 text-emerald-600 dark:text-emerald-400">Subuh</th>
                        <th className="py-2.5 px-3">Terbit</th>
                        <th className="py-2.5 px-3">Dhuha</th>
                        <th className="py-2.5 px-3">Dzuhur</th>
                        <th className="py-2.5 px-3 text-emerald-600 dark:text-emerald-400">Ashar</th>
                        <th className="py-2.5 px-3 text-emerald-600 dark:text-emerald-400">Maghrib</th>
                        <th className="py-2.5 px-3">Isya</th>
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
                            className={`hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-all ${isToday
                                ? 'bg-emerald-100/80 dark:bg-emerald-950/80 text-emerald-950 dark:text-emerald-300 font-extrabold border-l-4 border-l-emerald-600'
                                : 'text-slate-700 dark:text-slate-300'
                              }`}
                          >
                            <td className="py-2.5 px-3 font-sans flex items-center gap-2">
                              <span>{item.tanggal}</span>
                              {isToday && (
                                <span className="text-[9px] uppercase font-black px-1.5 py-0.5 rounded-md bg-emerald-600 text-white">
                                  Hari Ini
                                </span>
                              )}
                            </td>
                            <td className="py-2.5 px-3 font-sans">{item.hari}</td>
                            <td className="py-2.5 px-3 text-slate-500 dark:text-slate-400">{item.imsak}</td>
                            <td className="py-2.5 px-3 text-emerald-700 dark:text-emerald-400 font-semibold">{item.subuh}</td>
                            <td className="py-2.5 px-3">{item.terbit}</td>
                            <td className="py-2.5 px-3">{item.dhuha}</td>
                            <td className="py-2.5 px-3">{item.dzuhur}</td>
                            <td className="py-2.5 px-3 text-emerald-700 dark:text-emerald-400 font-semibold">{item.ashar}</td>
                            <td className="py-2.5 px-3 text-emerald-700 dark:text-emerald-400 font-semibold">{item.maghrib}</td>
                            <td className="py-2.5 px-3">{item.isya}</td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              ) : null}
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <button
                type="button"
                onClick={() => setIsFilterModalOpen(false)}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md"
              >
                Tutup Jadwal
              </button>
            </div>

          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-8 text-center text-xs text-slate-500">
        <p>&copy; {new Date().getFullYear()} Quread. Platform Al-Qur'an & Jadwal Shalat Digital Indonesia.</p>
      </footer>

    </div>
  )
}

export default Landing