import { Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './pages/Home/Home';
import SplashScreen from './pages/SplashScreen/SplashScreen';

function App() {
  return (
    <div className='App'>
      <Routes>
        <Route path="/" element={<SplashScreen />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </div>
  );
}

export default App;
