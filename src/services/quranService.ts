import { Surah } from '../types'

class QuranService {
  private baseUrl = 'https://equran.id/api/v2'

  async getAllSurah(): Promise<Surah[]> {
    try {
      const response = await fetch(`${this.baseUrl}/surat`)
      const data = await response.json()
      return data.data
    } catch (error) {
      console.error('Error fetching surahs:', error)
      throw error
    }
  }

  async getSurah(id: number): Promise<Surah> {
    try {
      const response = await fetch(`${this.baseUrl}/surat/${id}`)
      const data = await response.json()
      return data.data
    } catch (error) {
      console.error('Error fetching surah:', error)
      throw error
    }
  }

  async getTafsir(id: number): Promise<Record<number, string>> {
    try {
      const response = await fetch(`${this.baseUrl}/tafsir/${id}`)
      const data = await response.json()
      if (data.code === 200 && data.data?.tafsir) {
        const tafsirMap: Record<number, string> = {}
        data.data.tafsir.forEach((item: { ayat: number; teks: string }) => {
          tafsirMap[item.ayat] = item.teks
        })
        return tafsirMap
      }
      return {}
    } catch (error) {
      console.error('Error fetching tafsir:', error)
      return {}
    }
  }
}

export const quranService = new QuranService() 