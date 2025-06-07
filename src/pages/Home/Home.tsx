import { useEffect, useState } from 'react'
import HeaderHome from '@/components/Home/HeaderHome'
import BannerHome from '@/components/Home/BannerHome'
import ListSurahHome from '@/components/Home/ListSurahHome'
import { useApp } from '@/context/AppContext'
import { quranService } from '@/services/quranService'

const Home = () => {
  const { setSurahs } = useApp()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchListSurah = async () => {
      try {
        setLoading(true)
        const data = await quranService.getAllSurah()
        setSurahs(data)
      } catch (error) {
        console.error('Error fetching surah:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchListSurah()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="flex h-screen items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <HeaderHome />
      <main className="container mx-auto px-4 py-8">
        <BannerHome />
        <ListSurahHome />
      </main>
    </div>
  )
}

export default Home 