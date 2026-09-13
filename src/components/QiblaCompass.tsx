import { useState, useEffect } from 'react'
import { Compass, Navigation, MapPin, Smartphone, RefreshCw } from 'lucide-react'

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

export const QiblaCompass = ({ latitude, longitude, cityName }: QiblaCompassProps) => {
  const [qiblaBearing, setQiblaBearing] = useState<number>(295)
  const [deviceHeading, setDeviceHeading] = useState<number>(0)
  const [compassSupported, setCompassSupported] = useState<boolean>(false)
  const [permissionGranted, setPermissionGranted] = useState<boolean>(true)

  // Calculate Qibla angle from coordinates to Kaaba (21.4225° N, 39.8262° E)
  const calculateBearing = (userLatDeg: number, userLngDeg: number) => {
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

  useEffect(() => {
    let lat = latitude
    let lng = longitude

    // Fallback to city coordinates if lat/lng is not passed directly
    if ((lat === undefined || lng === undefined) && cityName) {
      const lowerCity = cityName.toLowerCase()
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
      setQiblaBearing(calculateBearing(lat, lng))
    }
  }, [latitude, longitude, cityName])

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
          setPermissionGranted(true)
          window.addEventListener('deviceorientation', handleOrientation, true)
        } else {
          setPermissionGranted(false)
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
      // Auto-listen if requestPermission is not needed (Android & Desktop)
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

  // Final compass needle rotation angle relative to current device heading
  const finalRotation = qiblaBearing - deviceHeading

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6 text-center transition-all">
      
      <div className="space-y-1">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 text-xs font-bold border border-emerald-300/40">
          <Compass className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>Kompas Kiblat Digital</span>
        </div>
        <h3 className="text-xl sm:text-2xl font-black font-heading text-slate-900 dark:text-white">
          Arah Kiblat dari {cityName || 'Kota Bandung'}
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
          Posisi Kiblat Makkah: <strong className="text-emerald-600 dark:text-emerald-400">{qiblaBearing}° Barat Laut</strong> (dari arah Utara)
        </p>
      </div>

      {/* Visual Compass Graphic Container */}
      <div className="relative w-56 h-56 sm:w-64 sm:h-64 mx-auto flex items-center justify-center">
        
        {/* Fixed Outer Rose Dial (North, East, South, West) */}
        <div className="absolute inset-0 rounded-full border-4 border-slate-100 dark:border-slate-800 shadow-inner flex items-center justify-center bg-slate-50/50 dark:bg-slate-950/50">
          <span className="absolute top-2.5 text-xs font-black text-red-500 tracking-wider">N</span>
          <span className="absolute right-3.5 text-xs font-black text-slate-400">E</span>
          <span className="absolute bottom-2.5 text-xs font-black text-slate-400">S</span>
          <span className="absolute left-3.5 text-xs font-black text-slate-400">W</span>
        </div>

        {/* Rotating Compass Dial with Kaaba Needle */}
        <div
          className="w-full h-full relative transition-transform duration-300 ease-out flex items-center justify-center"
          style={{ transform: `rotate(${finalRotation}deg)` }}
        >
          {/* Qibla Needle Arrow */}
          <div className="flex flex-col items-center justify-start h-full py-4">
            <div className="flex flex-col items-center space-y-1">
              <div className="w-10 h-10 rounded-full bg-emerald-600 text-white font-black flex items-center justify-center text-base shadow-lg shadow-emerald-600/50 border-2 border-white dark:border-slate-900 animate-pulse">
                🕋
              </div>
              <Navigation className="w-6 h-6 text-emerald-600 dark:text-emerald-400 fill-emerald-600" />
            </div>
            <div className="w-1.5 bg-gradient-to-b from-emerald-500 via-emerald-400 to-transparent flex-1 rounded-full"></div>
          </div>
        </div>

        {/* Center Pivot Point */}
        <div className="w-5 h-5 rounded-full bg-slate-900 dark:bg-white border-2 border-emerald-500 z-10 shadow-md"></div>
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
