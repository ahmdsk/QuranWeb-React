import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from '@/context/ThemeContext'
import { AppProvider } from '@/context/AppContext'
import Landing from './pages/Landing/Landing'
import Home from './pages/Home/Home'
import DetailSurah from './pages/Surah/DetailSurah'
import AuthPage from './pages/Auth/AuthPage'
import ProfilePage from './pages/Profile/ProfilePage'
import { BottomNav } from './components/BottomNav'

const AppContent = () => {
  return (
    <Router>
      <div className="pb-16 md:pb-0">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/home" element={<Home />} />
          <Route path="/surah/:id" element={<DetailSurah />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </div>
      <BottomNav />
    </Router>
  )
}

const App = () => {
  return (
    <ThemeProvider>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </ThemeProvider>
  )
}

export default App 