import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { BookOpen, Clock, Home } from 'lucide-react'

const SidebarBody = () => {
  const navigate = useNavigate()
  const { lastRead } = useApp()

  return (
    <div className="space-y-4 p-4">
      <button
        onClick={() => navigate('/home')}
        className="flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-accent"
      >
        <Home className="h-5 w-5" />
        <span>Beranda</span>
      </button>

      <button
        onClick={() => navigate('/surah')}
        className="flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-accent"
      >
        <BookOpen className="h-5 w-5" />
        <span>Daftar Surah</span>
      </button>

      {lastRead && (
        <button
          onClick={() => navigate(`/surah/${lastRead.id}`)}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-accent"
        >
          <Clock className="h-5 w-5" />
          <div className="flex-1 text-left">
            <p className="text-sm font-medium">Terakhir Dibaca</p>
            <p className="text-xs text-muted-foreground">{lastRead.name}</p>
          </div>
        </button>
      )}
    </div>
  )
}

export default SidebarBody 