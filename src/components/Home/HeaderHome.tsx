import { Menu, Moon, Sun } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import SearchDialog from '../SearchDialog'
import { Link } from 'react-router-dom'

const HeaderHome = () => {
    const { toggleSidebar, theme, setTheme } = useApp()

    return (
        <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center justify-between px-4 md:px-8">
                <button
                    onClick={toggleSidebar}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring md:hidden"
                >
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle sidebar</span>
                </button>
                <div className="flex items-center gap-2">
                    <Link to="/" className="text-xl font-bold">Quread</Link>
                </div>
                <div className="flex items-center gap-2">
                    <SearchDialog />
                    <button
                        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    >
                        {theme === 'dark' ? (
                            <Sun className="h-5 w-5" />
                        ) : (
                            <Moon className="h-5 w-5" />
                        )}
                        <span className="sr-only">Toggle theme</span>
                    </button>
                </div>
            </div>
        </header>
    )
}

export default HeaderHome 