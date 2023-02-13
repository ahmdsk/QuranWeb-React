import { Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './pages/Home/Home';
import SplashScreen from './pages/SplashScreen/SplashScreen';
import DetailSurah from './pages/Surah/DetailSurah';

function App() {
  return (
    <div className='App'>
      <Routes>
        <Route path="/" element={<SplashScreen />} />
        <Route path="/home" element={<Home />} />
        <Route path="/surah/:nomor" element={<DetailSurah />} />
      </Routes>
    </div>
  );
}

export default App;
