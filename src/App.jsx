import { Routes, Route } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import './App.css';
import Landing from './pages/Landing/Landing';
import Home from './pages/Home/Home';
import Surah from './pages/Surah/Surah';

function App() {
  return (
    <AppProvider>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/home" element={<Home />} />
        <Route path="/surah/:id" element={<Surah />} />
      </Routes>
    </AppProvider>
  );
}

export default App;
