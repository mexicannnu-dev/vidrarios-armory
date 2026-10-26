import {useRef, useState} from 'react';

export default function Intro({onFinish}) {
    const video = useRef(null);
    const starting = useRef(false);
    const activated = useRef(false);
    const [playing, setPlaying] = useState(false);
    const [retry, setRetry] = useState(false);

    async function play() {
        const element = video.current;
        if (!activated.current || !element || element.ended || element.error || starting.current) return;
        starting.current = true;
        element.muted = false;
        element.volume = 1;
        try {
            await element.play();
            setRetry(false);
        } catch { setRetry(true); }
        finally { starting.current = false; }
    }

    function enter() {
        activated.current = true;
        setPlaying(true);
        // Call play directly from the click to retain browser user activation.
        void play();
    }

    return <main className={`intro-screen cinematic-intro ${playing ? 'is-playing' : ''}`}>
        <div className="intro-grid" aria-hidden="true" />
        <div className="intro-orbit" aria-hidden="true" />
        <div className="intro-embers" aria-hidden="true">{Array.from({length: 16}, (_, index) => <i key={index} style={{'--i': index}} />)}</div>
        <div className="cinematic-top"><div className="intro-brand"><img src="assets/logo.png" alt="" /><span>VIDRARIOS <b>ARMORY</b></span></div><span className="intro-system"><i /> {playing ? 'TRANSMISIUNE ACTIVĂ' : 'ACCES AUTORIZAT'}</span></div>
        {!playing && <section className="intro-welcome" aria-labelledby="intro-title">
            <p className="intro-kicker"><span /> NU E DOAR UN ARSENAL. E O DECLARAȚIE.</p>
            <h1 id="intro-title" aria-label="LINIȘTEA DE DINAINTEA FURTUNII."><span className="intro-title-line">LINIȘTEA DE</span><span className="intro-title-line intro-title-fire" data-text="DINAINTEA">DINAINTEA</span><span className="intro-title-line intro-title-outline">FURTUNII.</span></h1>
            <p className="intro-description">Lasă lumea de afară în urmă.<br />Aici începe povestea ta.</p>
            <button className="armory-enter" onClick={enter}><span className="enter-icon" aria-hidden="true">↗</span><span>GO TO ARMORY<small>APASĂ. SIMTE. INTRĂ ÎN JOC.</small></span><span className="enter-arrow" aria-hidden="true">→</span></button>
            <div className="intro-signal" aria-hidden="true">{Array.from({length: 23}, (_, index) => <i key={index} style={{'--i': index}} />)}<span>THE EXPERIENCE STARTS HERE</span></div>
        </section>}
        <div className="intro-video-stage" hidden={!playing}>
            <div className="intro-video-meta"><span><i /> VIDRARIOS / EXCLUSIVE TRANSMISSION</span><span>01 — INTRO</span></div>
            <div className="intro-video-frame" onContextMenu={event => event.preventDefault()}>
                <video ref={video} src="assets/video/ValiFurtunaVDR.mp4" playsInline controlsList="nodownload nofullscreen noremoteplayback" disablePictureInPicture disableRemotePlayback preload="auto" tabIndex={-1} aria-label="Videoclip introductiv Vidrarios Armory" onEnded={onFinish} onPause={play} onError={() => {if (activated.current) onFinish();}} />
            </div>
            {retry && <button className="armory-enter intro-retry" onClick={play}>REÎNCEARCĂ REDAREA →</button>}
        </div>
        <div className="cinematic-bottom"><span>INVENTARUL TĂU. REGULILE TALE.</span><span>EST. 2026 <b> / </b> VIDRARIOS</span></div>
    </main>;
}