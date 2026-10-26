import {useRef, useState} from 'react';

export default function Intro({onFinish}) {
    const video = useRef(null);
    const [muted, setMuted] = useState(false);
    const [blocked, setBlocked] = useState(false);
    const [failed, setFailed] = useState(false);

    async function play() {
        try {
            await video.current.play();
            setBlocked(false);
        } catch {
            // Browsers may allow autoplay only when the video is muted.
            if (video.current && !video.current.muted) {
                video.current.muted = true;
                setMuted(true);
                try {
                    await video.current.play();
                    setBlocked(false);
                    return;
                } catch { /* Keep a manual start available if all autoplay is blocked. */ }
            }
            setBlocked(true);
        }
    }

    return <main className="intro-screen">
        <div className="intro-brand"><img src="assets/logo.png" alt="" /><span>VIDRARIOS <b>ARMORY</b></span></div>
        <p className="intro-caption">INVENTARUL TĂU. REGULILE TALE.</p>
        <div className="intro-video-frame">
            <video ref={video} src="assets/video/ValiFurtunaVDR.mp4" autoPlay muted={muted} playsInline controls preload="auto" aria-label="Videoclip introductiv Vidrarios Armory" onEnded={onFinish} onCanPlay={play} onPlaying={() => setBlocked(false)} onError={() => setFailed(true)} />
        </div>
        <div className="intro-actions">
            <button className="intro-sound" onClick={() => setMuted(value => !value)}>{muted ? 'Activează sunetul' : 'Oprește sunetul'}</button>
            <button className="intro-skip" onClick={onFinish}>Sari peste intro →</button>
        </div>
        {blocked && !failed && <button className="intro-play" onClick={play}>Pornește videoclipul</button>}
        <p className="intro-caption" role="status">{failed ? 'Videoclipul nu poate fi încărcat. Poți continua folosind „Sari peste intro”.' : 'La finalul videoclipului vei intra automat în armory.'}</p>
    </main>;
}
