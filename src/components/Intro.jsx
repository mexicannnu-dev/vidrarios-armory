import {useRef, useState} from 'react';

export default function Intro({onFinish}) {
    const video = useRef(null);
    const [blocked, setBlocked] = useState(false);
    const [failed, setFailed] = useState(false);

    async function play() {
        const element = video.current;
        if (!element || element.ended || element.error) return;
        element.muted = false;
        element.volume = 1;
        try {
            await element.play();
            setBlocked(false);
        } catch { setBlocked(true); }
    }

    return <main className="intro-screen">
        <div className="intro-brand"><img src="assets/logo.png" alt="" /><span>VIDRARIOS <b>ARMORY</b></span></div>
        <p className="intro-caption">INVENTARUL TĂU. REGULILE TALE.</p>
        <div className="intro-video-frame" onContextMenu={event => event.preventDefault()}>
            <video ref={video} src="assets/video/ValiFurtunaVDR.mp4" autoPlay playsInline controlsList="nodownload nofullscreen noremoteplayback" disablePictureInPicture disableRemotePlayback preload="auto" tabIndex={-1} aria-label="Videoclip introductiv Vidrarios Armory" onEnded={onFinish} onCanPlay={play} onPause={play} onPlaying={() => setBlocked(false)} onError={() => setFailed(true)} />
        </div>
        {blocked && !failed && <button className="intro-play" onClick={play}>Pornește videoclipul</button>}
        {failed && <button className="intro-play" onClick={onFinish}>Continuă în armory</button>}
        <p className="intro-caption" role="status">{failed ? 'Videoclipul nu poate fi încărcat.' : 'La finalul videoclipului vei intra automat în armory.'}</p>
    </main>;
}