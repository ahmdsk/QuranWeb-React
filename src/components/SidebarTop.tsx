import { useApp } from '../context/AppContext'
import { X } from 'lucide-react'

const SidebarTop = () => {
  const { toggleSidebar } = useApp()

  return (
    <div className="flex h-14 items-center justify-between border-b px-4">
      <h2 className="text-lg font-semibold">Menu</h2>
      <button
        onClick={toggleSidebar}
        className="rounded-full p-2 hover:bg-accent"
      >
        <X className="h-5 w-5" />
      </button>
    </div>
  )
}

export default SidebarTop 