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
}

export const quranService = new QuranService() 