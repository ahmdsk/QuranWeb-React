import { createContext, useContext, useState, useEffect } from 'react'

const AppContext = createContext()

export const useApp = () => {
  return useContext(AppContext)
}

export const AppProvider = ({ children }) => {
  const [surahs, setSurahs] = useState([])
  const [lastRead, setLastRead] = useState(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  useEffect(() => {
    // Load last read from localStorage
    const savedLastRead = localStorage.getItem('lastRead')
    if (savedLastRead) {
      setLastRead(JSON.parse(savedLastRead))
    }
  }, [])

  const updateLastRead = (surah) => {
    setLastRead(surah)
    localStorage.setItem('lastRead', JSON.stringify(surah))
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const value = {
    surahs,
    setSurahs,
    lastRead,
    updateLastRead,
    isSidebarOpen,
    toggleSidebar
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export default AppContext 