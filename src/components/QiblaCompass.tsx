import { useState, useEffect } from 'react'
import { Compass, MapPin, Smartphone, RefreshCw, Loader2, Maximize2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { shalatService } from '@/services/shalatService'

interface QiblaCompassProps {
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

export const QiblaCompass = ({ latitude: propLat, longitude: propLng, cityName }: QiblaCompassProps) => {
  const [qiblaBearing, setQiblaBearing] = useState<number>(295)
  const [deviceHeading, setDeviceHeading] = useState<number>(0)
  const [compassSupported, setCompassSupported] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [autoCoords, setAutoCoords] = useState<{ lat?: number; lng?: number }>({ lat: propLat, lng: propLng })
  const [detectedLocationName, setDetectedLocationName] = useState<string>(cityName || 'Kota Bandung')

  // Calculate Qibla angle from coordinates to Kaaba (21.4225° N, 39.8262° E) - Trigonometry Fallback
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
  useEffect(() => {
    if (propLat !== undefined && propLng !== undefined) {
      setAutoCoords({ lat: propLat, lng: propLng })
      setIsLoading(false)
      return
    }

    if (navigator.geolocation) {
      setIsLoading(true)
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const lat = pos.coords.latitude
          const lng = pos.coords.longitude
          setAutoCoords({ lat, lng })

          // Reverse Geocode
          const geoResult = await shalatService.reverseGeocode(lat, lng)
          if (geoResult && (geoResult.kabkota || geoResult.provinsi)) {
            setDetectedLocationName(geoResult.kabkota || geoResult.provinsi || 'Lokasi Saya')
          }
          setIsLoading(false)
        },
        () => {
          setIsLoading(false)
        },
        { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
      )
    } else {
      setIsLoading(false)
    }
  }, [propLat, propLng])

  useEffect(() => {
    let lat = autoCoords.lat
    let lng = autoCoords.lng

    // Fallback to city coordinates if lat/lng is not passed directly
    if ((lat === undefined || lng === undefined) && detectedLocationName) {
      const lowerCity = detectedLocationName.toLowerCase()
      const foundCityKey = Object.keys(CITY_COORDINATES).find((key) =>
        lowerCity.includes(key)
      )
      if (foundCityKey) {
        lat = CITY_COORDINATES[foundCityKey].lat
        lng = CITY_COORDINATES[foundCityKey].lng
      } else {
        lat = -6.9175
        lng = 107.6191
      }
    }

    if (lat !== undefined && lng !== undefined) {
      // Direct local trigonometry calculation first for instant render
      const localMathBearing = calculateBearingMath(lat, lng)
      setQiblaBearing(localMathBearing)

      // Fetch official Aladhan Qibla API (100% Free API)
      fetch(`https://api.aladhan.com/v1/qibla/${lat}/${lng}`)
        .then((res) => res.json())
        .then((resData) => {
          if (resData.code === 200 && resData.data?.direction) {
            setQiblaBearing(Math.round(resData.data.direction))
          }
        })
        .catch(() => {})
    }
  }, [autoCoords, detectedLocationName])

  const handleOrientation = (event: DeviceOrientationEvent) => {
    let heading: number | null = null

    // iOS Webkit Compass Heading
    if ((event as any).webkitCompassHeading !== undefined) {
      heading = (event as any).webkitCompassHeading
    } else if (event.alpha !== null) {
      // Standard W3C Device Orientation
      heading = 360 - event.alpha
    }

    if (heading !== null) {
      setDeviceHeading(Math.round(heading))
      setCompassSupported(true)
    }
  }

  // Request iOS 13+ DeviceOrientation Permission if required
  const requestCompassPermission = async () => {
    if (
      typeof DeviceOrientationEvent !== 'undefined' &&
      typeof (DeviceOrientationEvent as any).requestPermission === 'function'
    ) {
      try {
        const response = await (DeviceOrientationEvent as any).requestPermission()
        if (response === 'granted') {
          window.addEventListener('deviceorientation', handleOrientation, true)
        }
      } catch (err) {
        console.error(err)
      }
    } else {
      window.addEventListener('deviceorientation', handleOrientation, true)
    }
  }

  // Device Orientation Listener Setup
  useEffect(() => {
    if (typeof window !== 'undefined' && window.DeviceOrientationEvent) {
      if (typeof (DeviceOrientationEvent as any).requestPermission !== 'function') {
        window.addEventListener('deviceorientation', handleOrientation, true)
      }
    }
    return () => {
      if (typeof window !== 'undefined' && window.DeviceOrientationEvent) {
        window.removeEventListener('deviceorientation', handleOrientation, true)
      }
    }
  }, [])

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6 text-center transition-all relative overflow-hidden">
      
      {/* Full-Screen Page Button Header */}
      <div className="flex items-center justify-between">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 text-xs font-bold border border-emerald-300/40">
          <Compass className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>Kompas Kiblat Digital</span>
        </div>

        <Link
          to="/qibla"
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 text-slate-700 dark:text-slate-300 hover:text-emerald-600 text-xs font-bold transition-all border border-slate-200 dark:border-slate-700"
          title="Buka Layar Penuh Kompas Kiblat"
        >
          <Maximize2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>Layar Penuh</span>
        </Link>
      </div>

      <div className="space-y-1">
        <h3 className="text-xl sm:text-2xl font-black font-heading text-slate-900 dark:text-white">
          Arah Kiblat dari {detectedLocationName}
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
          Posisi Kiblat Makkah: <strong className="text-emerald-600 dark:text-emerald-400">{qiblaBearing}° Barat Laut</strong> (dari arah Utara)
        </p>
      </div>

      {/* Visual Compass Graphic Container */}
      <div className="relative w-56 h-56 sm:w-64 sm:h-64 mx-auto flex items-center justify-center">
        
        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-full flex flex-col items-center justify-center space-y-2">
            <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
            <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
              Mendeteksi Lokasi GPS...
            </span>
          </div>
        )}

        {/* FIXED TOP TARGET GUIDE */}
        <div className="absolute -top-3.5 z-20 flex flex-col items-center animate-bounce">
          <span className="text-[9px] uppercase font-black px-2 py-0.5 rounded-full bg-emerald-600 text-white shadow-md">
            Atas HP Anda
          </span>
          <div className="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[7px] border-t-emerald-600 mt-0.5"></div>
        </div>

        {/* ROTATING COMPASS DIAL (Mata Angin N-E-S-W Berputar Mengikuti Gerakan HP) */}
        <div
          className="w-full h-full absolute inset-0 rounded-full border-4 border-slate-200 dark:border-slate-800 shadow-xl bg-slate-50/80 dark:bg-slate-950/80 transition-transform duration-300 ease-out flex items-center justify-center"
          style={{
            transform: `rotate(${-deviceHeading}deg)`,
            transformOrigin: 'center center'
          }}
        >
          {/* Mata Angin Utama */}
          <span className="absolute top-2 text-xs font-black text-red-500 tracking-wider">N</span>
          <span className="absolute right-3.5 text-xs font-black text-slate-400">E</span>
          <span className="absolute bottom-2 text-xs font-black text-slate-400">S</span>
          <span className="absolute left-3.5 text-xs font-black text-slate-400">W</span>

          {/* Tanda Titik Derajat (Ticks) */}
          <div className="absolute inset-2 rounded-full border border-dashed border-slate-300 dark:border-slate-700/60 pointer-events-none"></div>

          {/* KAABA MARKER & CONNECTING NEEDLE FROM CENTER PIVOT */}
          <div
            className="absolute inset-0 flex flex-col items-center justify-start pointer-events-none"
            style={{
              transform: `rotate(${qiblaBearing}deg)`,
              transformOrigin: 'center center'
            }}
          >
            {/* Kaaba Badge at top edge */}
            <div className="pt-2 flex flex-col items-center">
              <div
                className="w-9 h-9 rounded-full bg-emerald-600 text-white font-black flex items-center justify-center text-base shadow-lg shadow-emerald-600/50 border-2 border-white dark:border-slate-900 transition-transform duration-300 z-20"
                style={{ transform: `rotate(${-qiblaBearing + deviceHeading}deg)` }}
              >
                🕋
              </div>
            </div>

            {/* Needle Line connecting Center Pivot to Kaaba Badge */}
            <div className="absolute top-6 bottom-1/2 w-1.5 bg-gradient-to-t from-emerald-600 via-emerald-400 to-emerald-500 rounded-full shadow-sm"></div>
          </div>
        </div>

        {/* Center Pivot Pin */}
        <div className="w-5 h-5 rounded-full bg-slate-900 dark:bg-white border-2 border-emerald-500 z-20 shadow-md"></div>
      </div>

      {/* Device Status & Permissions Info */}
      <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 text-xs font-semibold text-slate-600 dark:text-slate-400">
        <span className="flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          Arah Kiblat: {qiblaBearing}° Barat Laut
        </span>

        {compassSupported ? (
          <span className="text-[11px] bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 font-bold px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800/60 flex items-center gap-1.5">
            <Smartphone className="w-3.5 h-3.5" /> Sensor Gyroscope Aktif ({deviceHeading}°)
          </span>
        ) : (
          <button
            onClick={requestCompassPermission}
            className="text-[11px] bg-emerald-600 text-white hover:bg-emerald-700 font-bold px-3.5 py-1 rounded-full transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <RefreshCw className="w-3 h-3" /> Kalibrasi Sensor HP
          </button>
        )}
      </div>
    </div>
  )
}
