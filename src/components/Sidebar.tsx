import { useApp } from '../context/AppContext'
import SidebarTop from './SidebarTop'
import SidebarBody from './SidebarBody'

const Sidebar = () => {
  const { isSidebarOpen } = useApp()

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-background transition-transform duration-300 ease-in-out ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <SidebarTop />
      <SidebarBody />
    </aside>
  )
}

export default Sidebar 