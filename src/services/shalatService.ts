import { JadwalShalatData } from '../types'

class ShalatService {
  private baseUrl = 'https://equran.id/api/v2/shalat'

  async getProvinsi(): Promise<string[]> {
    try {
      const response = await fetch(`${this.baseUrl}/provinsi`)
      const result = await response.json()
      if (result.code === 200 && Array.isArray(result.data)) {
        return result.data
      }
      return []
    } catch (error) {
      console.error('Error fetching provinsi list:', error)
      return []
    }
  }

  async getKabKota(provinsi: string): Promise<string[]> {
    try {
      const response = await fetch(`${this.baseUrl}/kabkota`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ provinsi }),
      })
      const result = await response.json()
      if (result.code === 200 && Array.isArray(result.data)) {
        return result.data
      }
      return []
    } catch (error) {
      console.error('Error fetching kabkota list:', error)
      return []
    }
  }

  async getJadwalShalat(
    provinsi: string,
    kabkota: string,
    bulan?: number,
    tahun?: number
  ): Promise<JadwalShalatData | null> {
    try {
      const payload: { provinsi: string; kabkota: string; bulan?: number; tahun?: number } = {
        provinsi,
        kabkota,
      }
      if (bulan) payload.bulan = bulan
      if (tahun) payload.tahun = tahun

      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })
      const result = await response.json()
      if (result.code === 200 && result.data) {
        return result.data
      }
      return null
    } catch (error) {
      console.error('Error fetching jadwal shalat:', error)
      return null
    }
  }

  // Reverse Geocoding via Nominatim OpenStreetMap (Free, client-side reverse geocoding)
  async reverseGeocode(lat: number, lon: number): Promise<{ provinsi?: string; kabkota?: string } | null> {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&accept-language=id`,
        {
          headers: {
            'User-Agent': 'QuranWeb-ReactApp/1.0',
          },
        }
      )
      const data = await res.json()
      if (data && data.address) {
        const addr = data.address
        const state = addr.state || addr.region || ''
        const city = addr.city || addr.regency || addr.county || addr.city_district || addr.town || ''
        return { provinsi: state, kabkota: city }
      }
      return null
    } catch (err) {
      console.error('Reverse geocode failed:', err)
      return null
    }
  }
}

export const shalatService = new ShalatService()
