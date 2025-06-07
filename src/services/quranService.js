const BASE_URL = 'https://equran.id/api/v2'

export const quranService = {
    // Get all surahs
    getAllSurahs: async () => {
        try {
            const response = await fetch(`${BASE_URL}/surat`)
            const data = await response.json()
            return data
        } catch (error) {
            console.error('Error fetching surahs:', error)
            throw error
        }
    },

    // Get surah detail by number
    getSurahDetail: async (number) => {
        try {
            const response = await fetch(`${BASE_URL}/surat/${number}`)
            const data = await response.json()
            return data
        } catch (error) {
            console.error('Error fetching surah detail:', error)
            throw error
        }
    }
} 