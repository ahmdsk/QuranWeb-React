import { Menu, Search } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import InputSearchHome from './InputSearchHome'

const HeaderHome = () => {
    const navigate = useNavigate()
    const { toggleSidebar } = useApp()

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center justify-between px-4 md:px-8">
                <div className="flex items-center gap-4">
                    <button
                        onClick={toggleSidebar}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 md:hidden"
                    >
                        <Menu className="h-5 w-5" />
                        <span className="sr-only">Toggle menu</span>
                    </button>
                    <h1 className="text-xl font-bold md:text-2xl">Quran Web</h1>
                </div>

                <div className="flex items-center gap-4">
                    <div className="hidden md:block w-[300px]">
                        <InputSearchHome />
                    </div>
                    <button
                        onClick={() => navigate('/search')}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 md:hidden"
                    >
                        <Search className="h-5 w-5" />
                        <span className="sr-only">Search</span>
                    </button>
                </div>
            </div>
        </header>
    )
}

export default HeaderHome