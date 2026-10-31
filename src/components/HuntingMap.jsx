import {useEffect, useRef, useState} from 'react';
import {huntingZones} from '../huntingZones.js';

const initialView = {x: -26, y: -224, size: 2180};
const levels = ['Toate', 'I', 'II', 'III', 'IV', 'V'];

export default function HuntingMap({embedded = false}) {
    const [view, setView] = useState(initialView);
    const [filter, setFilter] = useState('Toate');
    const [selected, setSelected] = useState(null);
    const [missingImage, setMissingImage] = useState(false);
    const drag = useRef(null);
    const moved = useRef(false);
    const mapRef = useRef(null);
    const [mapPixels, setMapPixels] = useState(800);
    useEffect(() => {
        const observer = new ResizeObserver(([entry]) => {
            const {width, height} = entry.contentRect;
            if (width && height) setMapPixels(Math.min(width, height));
        });
        observer.observe(mapRef.current);
        return () => observer.disconnect();
    }, []);
    useEffect(() => {
        const map = mapRef.current;
        function onWheel(event) {
            event.preventDefault();
            if (drag.current || !event.deltaY) return;
            const bounds = map.getBoundingClientRect();
            const pixels = Math.min(bounds.width, bounds.height);
            const x = (event.clientX - bounds.left - (bounds.width - pixels) / 2) / pixels;
            const y = (event.clientY - bounds.top - (bounds.height - pixels) / 2) / pixels;
            const delta = event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? pixels : 1);
            const factor = Math.exp(Math.max(-.5, Math.min(.5, delta * .002)));
            setView(old => {
                const size = Math.max(300, Math.min(4360, old.size * factor));
                return {x: old.x + (old.size - size) * x, y: old.y + (old.size - size) * y, size};
            });
        }
        map.addEventListener('wheel', onWheel, {passive: false});
        return () => map.removeEventListener('wheel', onWheel);
    }, []);
    const labelScale = view.size / mapPixels;
    const visible = huntingZones.filter(zone => filter === 'Toate' || zone.level.replace('LVL ', '').split(' / ').includes(filter));

    function zoom(factor) {
        setView(old => {
            const size = Math.max(300, Math.min(4360, old.size * factor));
            return {x: old.x + (old.size - size) / 2, y: old.y + (old.size - size) / 2, size};
        });
    }

    return <section className={embedded ? 'hunting-map-panel' : 'hunting-page'} aria-label={embedded ? 'Harta vânătorului' : undefined} aria-labelledby={embedded ? undefined : 'hunting-title'}>
        {!embedded && <div className="hunting-heading washing-intro">
            <p className="eyebrow page-kicker">VIDRARIOS / ZONE DE VÂNĂTOARE</p>
            <h1 id="hunting-title">HARTA <em>VÂNĂTORULUI</em></h1>
            <p>Explorează zonele de vânătoare. Selectează un marcaj pentru detalii.</p>
        </div>}
        <div className="filters" aria-label="Filtrează zonele după nivel">{levels.map(level => <button key={level} aria-pressed={filter === level} className={filter === level ? 'selected' : ''} onClick={() => {setFilter(level); setSelected(null);}}>{level === 'Toate' ? 'Toate zonele' : `Nivel ${level}`}</button>)}</div>
        {missingImage && <p className="hunting-warning" role="status">Imaginea de fundal lipsește. Adaugă fișierul map.png în directorul public pentru a afișa harta completă. Zonele originale sunt disponibile mai jos.</p>}
        <div className="hunting-layout">
            <div className="hunting-canvas">
                <div className="hunting-controls" aria-label="Comenzi hartă"><button aria-label="Mărește harta" onClick={() => zoom(.75)}>+</button><button aria-label="Micșorează harta" onClick={() => zoom(1.33)}>−</button><button onClick={() => setView(initialView)}>Resetează</button></div>
                <svg ref={mapRef} className="hunting-map" viewBox={`${view.x} ${view.y} ${view.size} ${view.size}`} aria-label="Zone de vânătoare interactive" onPointerDown={event => {
                    if (event.button !== 0) return;
                    event.preventDefault();
                    moved.current = false;
                    const bounds = event.currentTarget.getBoundingClientRect();
                    drag.current = {x: event.clientX, y: event.clientY, view, scale: view.size / Math.min(bounds.width, bounds.height)};
                }} onPointerMove={event => {
                    const start = drag.current;
                    if (start && (moved.current || Math.hypot(event.clientX - start.x, event.clientY - start.y) > 4)) {
                        if (!moved.current) event.currentTarget.setPointerCapture(event.pointerId);
                        moved.current = true;
                        setView({...start.view, x: start.view.x - (event.clientX - start.x) * start.scale, y: start.view.y - (event.clientY - start.y) * start.scale});
                    }
                }} onClickCapture={event => {
                    if (moved.current && event.detail !== 0) {event.preventDefault(); event.stopPropagation();}
                }} onPointerUp={() => {drag.current = null;}} onPointerCancel={() => {drag.current = null;}} onLostPointerCapture={() => {drag.current = null;}}>
                    <image href="map.png" x="-26" y="-224" width="2180" height="2180" onError={() => setMissingImage(true)} />
                    {visible.map(zone => <path key={zone.id} data-zone={zone.id} d={zone.d} stroke={zone.stroke} fill={zone.fill} fillOpacity={selected?.id === zone.id ? .45 : .3} strokeWidth={selected?.id === zone.id ? 3 : 2} vectorEffect="non-scaling-stroke" onClick={() => setSelected(zone)} />)}
                    {visible.map(zone => <g key={zone.id} data-zone={zone.id} transform={`translate(${zone.x} ${zone.y}) scale(${labelScale})`} className="hunting-marker" role="button" tabIndex={0} aria-label={`Zona ${zone.id}, ${zone.level}`} aria-pressed={selected?.id === zone.id} onClick={() => setSelected(zone)} onKeyDown={event => {if (event.key === 'Enter' || event.key === ' ') {event.preventDefault(); setSelected(zone);}}}>
                        <rect className="hunting-label-background" width={zone.level.length * 7 + 20} height="26" rx="3" fill="#140e06" fillOpacity={selected?.id === zone.id ? .95 : .85} stroke={zone.stroke} strokeWidth="1" />
                        <text x={(zone.level.length * 7 + 20) / 2} y="17" textAnchor="middle" fill={zone.stroke} fontFamily="Georgia, 'Times New Roman', serif" fontSize="11" fontWeight="700" letterSpacing="1">{zone.level}</text>
                    </g>)}
                </svg>
                <span className="hunting-count">{visible.length} zone afișate · Trage pentru deplasare</span>
            </div>
            <aside className="hunting-details" aria-live="polite">
                <h3>{selected ? `${selected.level} · Zona ${selected.id}` : 'Informații zonă'}</h3>
                {!selected ? <p>Selectează o zonă colorată sau un marcaj de pe hartă.</p> : selected.id === 31 ? <>
                    <h4>Insulă Tropicală</h4><p className="hunting-warning">Zonă cu risc ridicat — Nu intrați singuri.</p>
                    <h4>Animale prezente</h4><p>PANTERA</p>
                    <h4>Despre zonă</h4><p>Insulă izolată cu climat tropical și vegetație exuberantă. Faună exotică cu specii care nu se găsesc pe continent. Terenul dificil și flora deasă fac deplasarea anevoioasă, echipamentul adecvat este obligatoriu.</p>
                    <h4>Sfaturi de vânătoare</h4><p>Cel mai bun moment de vânătoare: 20:00–06:00.</p>
                </> : <p>Fișierul sursă include poziția și nivelul acestei zone, fără detalii despre animale sau recomandări.</p>}
                {selected && <button className="hunting-close" onClick={() => setSelected(null)}>Închide detaliile</button>}
            </aside>
        </div>
    </section>;
}
