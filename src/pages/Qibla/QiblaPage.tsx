import { useState, useEffect } from 'react'
import { Compass, MapPin, Smartphone, RefreshCw, Loader2, Locate, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import { shalatService } from '@/services/shalatService'

interface QiblaPageProps {
  latitude?: number
  longitude?: number
  cityName?: string
}

// Fallback city coordinates lookup for Indonesia cities
const CITY_COORDINATES: Record<string, { lat: number; lng: number }> = {
  bandung: { lat: -6.9175, lng: 107.6191 },
  jakarta: { lat: -6.2088, lng: 106.8456 },
  surabaya: { lat: -7.2575, lng: 112.7521 },
  medan: { lat: 3.5952, lng: 98.6722 },
  semarang: { lat: -6.9667, lng: 110.4167 },
  yogyakarta: { lat: -7.7956, lng: 110.3695 },
  makassar: { lat: -5.1477, lng: 119.4327 },
  palembang: { lat: -2.9761, lng: 104.7754 },
  denpasar: { lat: -8.6705, lng: 115.2126 },
  jayapura: { lat: -2.5489, lng: 140.7137 },
  bogor: { lat: -6.5971, lng: 106.7996 },
  depok: { lat: -6.4025, lng: 106.7942 },
  tangerang: { lat: -6.1783, lng: 106.6319 },
  bekasi: { lat: -6.2383, lng: 106.9756 },
  malang: { lat: -7.9666, lng: 112.6326 },
  surakarta: { lat: -7.5755, lng: 110.8243 },
  solo: { lat: -7.5755, lng: 110.8243 },
  banjarmasin: { lat: -3.3194, lng: 114.5908 },
  samarinda: { lat: -0.5022, lng: 117.1536 },
  pontianak: { lat: -0.0263, lng: 109.3425 },
  padang: { lat: -0.9471, lng: 100.4172 },
  pekanbaru: { lat: 0.5071, lng: 101.4478 },
  'bandar lampung': { lat: -5.45, lng: 105.2667 },
  aceh: { lat: 5.5483, lng: 95.3238 },
  'banda aceh': { lat: 5.5483, lng: 95.3238 }
}

export const QiblaPage = ({ latitude: propLat, longitude: propLng, cityName: propCity }: QiblaPageProps) => {
  const [qiblaBearing, setQiblaBearing] = useState<number>(295)
  const [deviceHeading, setDeviceHeading] = useState<number>(0)
  const [compassSupported, setCompassSupported] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [currentCity, setCurrentCity] = useState<string>(propCity || 'Kota Bandung')
  const [userCoords, setUserCoords] = useState<{ lat?: number; lng?: number }>({ lat: propLat, lng: propLng })
  const [locationStatus, setLocationStatus] = useState<string>('')

  // Trigonometry Fallback
  const calculateBearingMath = (userLatDeg: number, userLngDeg: number) => {
    const kaabaLat = (21.4225 * Math.PI) / 180
    const kaabaLng = (39.8262 * Math.PI) / 180
    const userLat = (userLatDeg * Math.PI) / 180
    const userLng = (userLngDeg * Math.PI) / 180

    const dLng = kaabaLng - userLng
    const y = Math.sin(dLng)
    const x =
      Math.cos(userLat) * Math.sin(kaabaLat) -
      Math.sin(userLat) * Math.cos(kaabaLat) * Math.cos(dLng)

    let bearing = (Math.atan2(y, x) * 180) / Math.PI
    bearing = (bearing + 360) % 360
    return Math.round(bearing)
  }

  // Get current user location via GPS HTML5 Geolocation API
  const fetchCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus('GPS tidak didukung browser ini.')
      return
    }

    setIsLoading(true)
    setLocationStatus('Mencari koordinat Lat/Long lokasi Anda...')

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude
        const lng = pos.coords.longitude
        setUserCoords({ lat, lng })
        
        // Reverse Geocode
        const geoResult = await shalatService.reverseGeocode(lat, lng)
        if (geoResult && (geoResult.kabkota || geoResult.provinsi)) {
          const detectedName = geoResult.kabkota || geoResult.provinsi || 'Lokasi Saya'
          setCurrentCity(detectedName)
          setLocationStatus(`Terdeteksi: ${detectedName} (${lat.toFixed(4)}, ${lng.toFixed(4)})`)
        } else {
          setLocationStatus(`Koordinat: ${lat.toFixed(4)}, ${lng.toFixed(4)}`)
        }
        setIsLoading(false)
      },
      (err) => {
        console.warn('Geolocation failed or denied:', err)
        setLocationStatus('Gagal mendapat GPS. Menggunakan lokasi default.')
        setIsLoading(false)
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    )
  }

  useEffect(() => {
    // If coords not provided via props, trigger GPS fetch automatically
    if (propLat === undefined || propLng === undefined) {
      fetchCurrentLocation()
    } else {
      setIsLoading(false)
    }
  }, [propLat, propLng])

  useEffect(() => {
    let lat = userCoords.lat !== undefined ? userCoords.lat : propLat
    let lng = userCoords.lng !== undefined ? userCoords.lng : propLng

    if ((lat === undefined || lng === undefined) && currentCity) {
      const lowerCity = currentCity.toLowerCase()
      const foundCityKey = Object.keys(CITY_COORDINATES).find((key) => lowerCity.includes(key))
      if (foundCityKey) {
        lat = CITY_COORDINATES[foundCityKey].lat
        lng = CITY_COORDINATES[foundCityKey].lng
      } else {
        lat = -6.9175
        lng = 107.6191
      }
    }

    if (lat !== undefined && lng !== undefined) {
      const localMathBearing = calculateBearingMath(lat, lng)
      setQiblaBearing(localMathBearing)

      fetch(`https://api.aladhan.com/v1/qibla/${lat}/${lng}`)
        .then((res) => res.json())
        .then((resData) => {
          if (resData.code === 200 && resData.data?.direction) {
            setQiblaBearing(Math.round(resData.data.direction))
          }
        })
        .catch(() => {})
    }
  }, [userCoords, currentCity, propLat, propLng])

  const handleOrientation = (event: DeviceOrientationEvent) => {
    let heading: number | null = null

    // iOS Webkit Compass Heading (Physical North 0° - 360°)
    if ((event as any).webkitCompassHeading !== undefined && (event as any).webkitCompassHeading !== null) {
      heading = (event as any).webkitCompassHeading
    } else if (event.absolute && event.alpha !== null) {
      // W3C Absolute orientation (Alpha = 0 at true North)
      heading = 360 - event.alpha
    } else if (event.alpha !== null) {
      // Relative orientation fallback
      heading = 360 - event.alpha
    }

    if (heading !== null && !isNaN(heading)) {
      setDeviceHeading(Math.round((heading + 360) % 360))
      setCompassSupported(true)
    }
  }

  const requestCompassPermission = async () => {
    if (
      typeof DeviceOrientationEvent !== 'undefined' &&
      typeof (DeviceOrientationEvent as any).requestPermission === 'function'
    ) {
      try {
        const response = await (DeviceOrientationEvent as any).requestPermission()
        if (response === 'granted') {
          window.addEventListener('deviceorientationabsolute', handleOrientation, true)
          window.addEventListener('deviceorientation', handleOrientation, true)
        }
      } catch (err) {
        console.error(err)
      }
    } else {
      window.addEventListener('deviceorientationabsolute', handleOrientation, true)
      window.addEventListener('deviceorientation', handleOrientation, true)
    }
  }

  useEffect(() => {
    requestCompassPermission()

    if (typeof window !== 'undefined') {
      const win = window as any
      if ('ondeviceorientationabsolute' in win) {
        win.addEventListener('deviceorientationabsolute', handleOrientation, true)
      } else if (win.DeviceOrientationEvent) {
        if (typeof win.DeviceOrientationEvent.requestPermission !== 'function') {
          win.addEventListener('deviceorientation', handleOrientation, true)
        }
      }
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('deviceorientationabsolute', handleOrientation, true)
        window.removeEventListener('deviceorientation', handleOrientation, true)
      }
    }
  }, [])

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-between p-4 sm:p-6 lg:p-8 animate-in fade-in duration-300">
      
      {/* Top Header Navigation Bar */}
      <div className="max-w-xl mx-auto w-full flex items-center justify-between pt-2">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shadow-sm"
        >
          <ArrowLeft className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>Beranda</span>
        </Link>

        <button
          onClick={fetchCurrentLocation}
          disabled={isLoading}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md active:scale-95"
        >
          <Locate className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>{isLoading ? 'Mencari GPS...' : 'Ambil GPS'}</span>
        </button>
      </div>

      {/* Main Full-Height Qibla Compass Container */}
      <div className="max-w-xl mx-auto w-full my-auto py-4">
        <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-center relative overflow-hidden backdrop-blur-xl">
          
          {/* Subtle Ambient Background Glow */}
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>

          {/* Title & Coordinates Info */}
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 text-xs font-bold border border-emerald-200 dark:border-emerald-800/60">
              <Compass className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Arah Kiblat Presisi (Makkah)</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black font-heading text-slate-900 dark:text-white pt-1">
              {currentCity}
            </h1>

            {locationStatus && (
              <p className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 animate-in fade-in">
                {locationStatus}
              </p>
            )}

            <div className="flex items-center justify-center gap-3 pt-1">
              <span className="text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/80 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700">
                Kiblat: <strong className="text-emerald-600 dark:text-emerald-400 font-bold">{qiblaBearing}° NW</strong>
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/80 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700">
                Arah HP: <strong className="text-slate-800 dark:text-slate-200 font-bold">{deviceHeading}°</strong>
              </span>
            </div>
          </div>

          {/* Full Screen Interactive Compass View */}
          <div className="relative w-72 h-72 sm:w-80 sm:h-80 mx-auto flex items-center justify-center my-2">
            
            {/* Loading Overlay */}
            {isLoading ? (
              <div className="absolute inset-0 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-full flex flex-col items-center justify-center space-y-3">
                <Loader2 className="w-10 h-10 text-emerald-600 animate-spin" />
                <span className="text-xs font-extrabold text-slate-700 dark:text-slate-300">
                  Mendapatkan Posisi GPS & Derajat Kiblat...
                </span>
              </div>
            ) : null}

            {/* TOP ALIGNMENT POINTER BEZEL */}
            <div className="absolute -top-3 z-20 flex flex-col items-center">
              <div className="px-2.5 py-0.5 rounded-full bg-slate-900 dark:bg-emerald-500 text-white dark:text-slate-950 font-black text-[10px] uppercase tracking-widest shadow-md">
                Depan HP
              </div>
              <div className="w-0 h-0 border-l-[7px] border-l-transparent border-r-[7px] border-r-transparent border-t-[10px] border-t-slate-900 dark:border-t-emerald-500 mt-0.5"></div>
            </div>

            {/* OUTER DIAL BEZEL RING */}
            <div className="absolute inset-0 rounded-full border-[6px] border-slate-200 dark:border-slate-800 shadow-inner pointer-events-none"></div>

            {/* ROTATING COMPASS DIAL */}
            <div
              className="w-[92%] h-[92%] absolute rounded-full border border-slate-200 dark:border-slate-700/80 shadow-2xl bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950 transition-transform duration-300 ease-out flex items-center justify-center"
              style={{
                transform: `rotate(${-deviceHeading}deg)`,
                transformOrigin: 'center center'
              }}
            >
              {/* Cardinal Directions */}
              <span className="absolute top-3 text-xs font-black text-rose-500 tracking-wider">U</span>
              <span className="absolute right-4 text-xs font-black text-slate-400">T</span>
              <span className="absolute bottom-3 text-xs font-black text-slate-400">S</span>
              <span className="absolute left-4 text-xs font-black text-slate-400">B</span>

              {/* Sub-cardinals */}
              <span className="absolute top-7 right-8 text-[9px] font-bold text-slate-400/60">TL</span>
              <span className="absolute bottom-7 right-8 text-[9px] font-bold text-slate-400/60">TG</span>
              <span className="absolute bottom-7 left-8 text-[9px] font-bold text-slate-400/60">BD</span>
              <span className="absolute top-7 left-8 text-[9px] font-bold text-slate-400/60">BL</span>

              {/* Degree ticks circle */}
              <div className="absolute inset-3 rounded-full border border-dashed border-slate-300 dark:border-slate-800 pointer-events-none"></div>

              {/* KAABA BEARING NEEDLE */}
              <div
                className="absolute inset-0 flex flex-col items-center justify-start pointer-events-none"
                style={{
                  transform: `rotate(${qiblaBearing}deg)`,
                  transformOrigin: 'center center'
                }}
              >
                {/* Kaaba Badge at outer ring */}
                <div className="pt-2 flex flex-col items-center relative z-20">
                  <div
                    className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-700 via-emerald-600 to-teal-500 text-white font-black flex items-center justify-center text-xl shadow-lg shadow-emerald-500/30 border-2 border-white dark:border-slate-900 transition-all"
                    style={{ transform: `rotate(${-qiblaBearing + deviceHeading}deg)` }}
                  >
                    🕋
                  </div>
                  <span className="text-[9px] font-black text-emerald-600 dark:text-emerald-400 bg-white dark:bg-slate-900 px-1.5 py-0.5 rounded-md border border-emerald-300 dark:border-emerald-800 shadow-xs mt-1">
                    {qiblaBearing}°
                  </span>
                </div>

                {/* Tactical Pointer Needle */}
                <div className="absolute top-12 bottom-1/2 w-1 bg-gradient-to-t from-emerald-500 to-teal-400 rounded-full shadow-sm opacity-90"></div>
              </div>

              {/* True North Pointer (Thin Red Line) */}
              <div className="absolute top-7 bottom-1/2 w-0.5 bg-rose-500/70 pointer-events-none rounded-full"></div>
            </div>

            {/* Center Metallic Pivot */}
            <div className="w-7 h-7 rounded-full bg-slate-900 dark:bg-slate-100 border-2 border-emerald-500 z-20 shadow-md flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
            </div>
          </div>

          {/* Device Guidance Status */}
          <div className="pt-2 flex flex-col items-center justify-center gap-3 text-xs font-semibold text-slate-600 dark:text-slate-400">
            <div className="flex flex-wrap items-center justify-center gap-2">
              {compassSupported ? (
                <span className="text-[11px] bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold px-3 py-1 rounded-full border border-emerald-300/40 flex items-center gap-1.5">
                  <Smartphone className="w-3.5 h-3.5 text-emerald-600" /> Sensor Gyroscope Aktif
                </span>
              ) : (
                <button
                  onClick={requestCompassPermission}
                  className="text-[11px] bg-emerald-600 text-white hover:bg-emerald-500 font-bold px-4 py-1.5 rounded-full transition-all flex items-center gap-1.5 shadow-md active:scale-95"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Kalibrasi / Izinkan Sensor Magnetik HP
                </button>
              )}
            </div>

            {!compassSupported && (
              <p className="text-[11px] text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 px-4 py-2 rounded-2xl border border-amber-200 dark:border-amber-800/60 max-w-sm text-center leading-relaxed">
                📌 <strong>Kompas Otomatis:</strong> Sensor magnetometer fisik berjalan penuh jika dibuka di browser <strong>Smartphone (iOS / Android)</strong>. Pada PC/Mac, putar secara manual dengan acuan sudut {qiblaBearing}° Barat Laut.
              </p>
            )}
          </div>

        </div>
      </div>

      {/* Footer Info */}
      <div className="text-center text-xs text-slate-400 pb-2 space-y-1">
        <p className="font-semibold text-slate-600 dark:text-slate-300">
          Cara Menggunakan: Putar badan/smartphone Anda hingga Ujung Atas Layar lurus sejajar dengan Jarum 🕋 Kiblat.
        </p>
        <p className="text-[11px] text-slate-400">Posisi Kaaba Makkah: 21.4225° N, 39.8262° E</p>
      </div>

    </div>
  )
}

export default QiblaPage
