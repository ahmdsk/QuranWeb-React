import { useState, useEffect } from 'react'
import { Compass, Navigation, MapPin } from 'lucide-react'

interface QiblaCompassProps {
  latitude?: number
  longitude?: number
  cityName?: string
}

export const QiblaCompass = ({ latitude, longitude, cityName }: QiblaCompassProps) => {
  const [qiblaBearing, setQiblaBearing] = useState<number | null>(null)
  const [deviceHeading, setDeviceHeading] = useState<number | null>(null)
  const [compassSupported, setCompassSupported] = useState<boolean>(false)

  // Calculate Qibla angle from user coordinates to Kaaba (21.4225° N, 39.8262° E)
  useEffect(() => {
    if (latitude !== undefined && longitude !== undefined) {
      const kaabaLat = (21.4225 * Math.PI) / 180
      const kaabaLng = (39.8262 * Math.PI) / 180
      const userLat = (latitude * Math.PI) / 180
      const userLng = (longitude * Math.PI) / 180

      const dLng = kaabaLng - userLng
      const y = Math.sin(dLng)
      const x =
        Math.cos(userLat) * Math.sin(kaabaLat) -
        Math.sin(userLat) * Math.cos(kaabaLat) * Math.cos(dLng)

      let bearing = (Math.atan2(y, x) * 180) / Math.PI
      bearing = (bearing + 360) % 360
      setQiblaBearing(Math.round(bearing))
    }
  }, [latitude, longitude])

  // Device Orientation Handler for mobile compass sensor
  useEffect(() => {
    const handleOrientation = (event: DeviceOrientationEvent) => {
      let heading: number | null = null

      if ((event as any).webkitCompassHeading !== undefined) {
        // iOS devices
        heading = (event as any).webkitCompassHeading
      } else if (event.alpha !== null) {
        // Android devices
        heading = 360 - event.alpha
      }

      if (heading !== null) {
        setDeviceHeading(Math.round(heading))
        setCompassSupported(true)
      }
    }

    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', handleOrientation, true)
    }

    return () => {
      if (window.DeviceOrientationEvent) {
        window.removeEventListener('deviceorientation', handleOrientation, true)
      }
    }
  }, [])

  const compassRotation =
    qiblaBearing !== null && deviceHeading !== null
      ? qiblaBearing - deviceHeading
      : qiblaBearing || 0

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6 text-center">
      <div className="space-y-1">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 text-xs font-bold border border-emerald-300/40">
          <Compass className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>Kompas Kiblat Digital</span>
        </div>
        <h3 className="text-xl sm:text-2xl font-black font-heading text-slate-900 dark:text-white">
          Arah Kiblat dari {cityName || 'Lokasi Anda'}
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
          {qiblaBearing !== null
            ? `Derajat arah Ka'bah (Makkah): ${qiblaBearing}° dari Utara`
            : 'Mendeteksi lokasi untuk menghitung arah Kiblat...'}
        </p>
      </div>

      {/* Visual Compass Graphic */}
      <div className="relative w-48 h-48 sm:w-56 sm:h-56 mx-auto flex items-center justify-center">
        {/* Outer Ring */}
        <div className="absolute inset-0 rounded-full border-4 border-slate-100 dark:border-slate-800 shadow-inner flex items-center justify-center">
          <span className="absolute top-2 text-[10px] font-black text-slate-400">N</span>
          <span className="absolute right-3 text-[10px] font-black text-slate-400">E</span>
          <span className="absolute bottom-2 text-[10px] font-black text-slate-400">S</span>
          <span className="absolute left-3 text-[10px] font-black text-slate-400">W</span>
        </div>

        {/* Rotating Compass Needle Pointer */}
        <div
          className="w-full h-full relative transition-transform duration-500 ease-out flex items-center justify-center"
          style={{ transform: `rotate(${compassRotation}deg)` }}
        >
          {/* Qibla Indicator Arrow */}
          <div className="flex flex-col items-center justify-start h-full py-3">
            <div className="flex flex-col items-center space-y-1 animate-bounce">
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-black flex items-center justify-center text-xs shadow-lg shadow-emerald-600/40">
                🕋
              </div>
              <Navigation className="w-6 h-6 text-emerald-600 dark:text-emerald-400 fill-emerald-600" />
            </div>
            <div className="w-1 bg-gradient-to-b from-emerald-500 to-transparent flex-1 rounded-full"></div>
          </div>
        </div>

        {/* Center Point */}
        <div className="w-5 h-5 rounded-full bg-slate-900 dark:bg-white border-2 border-emerald-500 z-10 shadow-md"></div>
      </div>

      {/* Footer Info */}
      <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400">
        <span className="flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          {qiblaBearing !== null
            ? `Posisi Kiblat: ${qiblaBearing}° Barat Laut`
            : 'Perhitungan presisi koordinat Makkah'}
        </span>
        {compassSupported && (
          <span className="text-[10px] bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 font-bold px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800/60">
            Sensor Kompas Aktif
          </span>
        )}
      </div>
    </div>
  )
}
