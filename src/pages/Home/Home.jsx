import { useEffect, useState } from 'react'
import Sidebar from '../../components/Sidebar'
import HeaderHome from '../../components/Home/HeaderHome'
import BannerHome from '../../components/Home/BannerHome'
import Loading from '../../components/Loading'
import ListSurahHome from '../../components/Home/ListSurahHome'
import InputSearchHome from '../../components/Home/InputSearchHome'
import { useApp } from '../../context/AppContext'
import { quranService } from '../../services/quranService'

import './Home.css'

const Home = () => {
    const { surahs, setSurahs, lastRead, isSidebarOpen, toggleSidebar } = useApp()
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchSurahs = async () => {
            try {
                const response = await quranService.getAllSurahs()
                if (response.code === 200) {
                    setSurahs(response.data)
                }
            } catch (error) {
                console.error('Error fetching surahs:', error)
            } finally {
                setLoading(false)
            }
        }

        if (surahs.length === 0) {
            fetchSurahs()
        } else {
            setLoading(false)
        }
    }, [surahs.length, setSurahs])

    return (
        <div className="min-h-screen bg-background">
            <HeaderHome />
            <Sidebar />
            <main className="container mx-auto px-4 py-8">
                <InputSearchHome />
                <BannerHome />
                {loading ? <Loading /> : <ListSurahHome />}
            </main>
        </div>
    )
}

export default Home