import AudioPlayer from 'react-h5-audio-player';

export default function MurotalSurah(props) {
    return (
        <div className="audio-player-container">
            <div className="audio-player">
                <AudioPlayer autoPlay={false} src={props.surah.audio} />
            </div>
        </div>
    )
}