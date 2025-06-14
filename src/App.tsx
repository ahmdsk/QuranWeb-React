import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from '@/context/ThemeContext'
import { AppProvider } from '@/context/AppContext'
import Landing from './pages/Landing/Landing'
import Home from './pages/Home/Home'
import DetailSurah from './pages/Surah/DetailSurah'

const App = () => {
  return (
    <ThemeProvider>
      <AppProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/home" element={<Home />} />
            <Route path="/surah/:id" element={<DetailSurah />} />
          </Routes>
        </Router>
      </AppProvider>
    </ThemeProvider>
  )
}

export default App 