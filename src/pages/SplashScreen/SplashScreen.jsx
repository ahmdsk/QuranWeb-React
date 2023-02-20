import { useNavigate } from 'react-router-dom'
import './SplashScreen.css'

export default function SplashScreen() {
    const navigate = useNavigate()
    const goToHome = () => {
        navigate('/home')
    }
    
    document.title = 'Quran App'
    
    return (
        <div className="splash">
            <h2 className="splash-title">Quran App</h2>
            <p className="splash-description">Learn Quran and Recite once everyday</p>
            <div className="banner-splash">
                <img src="/quran-splash.svg" alt="Quran Splash" className="image-splash" />
                <button className="splash-button" onClick={goToHome}>Get Started</button>
            </div>
        </div>
    )
}