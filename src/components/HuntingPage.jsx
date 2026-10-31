import {useRef, useState} from 'react';
import HuntingMap from './HuntingMap.jsx';
import HuntingRegistry from './HuntingRegistry.jsx';

const tabs = [{id: 'registry', label: 'Registru'}, {id: 'map', label: 'Harta vânătorului'}];

export default function HuntingPage() {
    const [tab, setTab] = useState('registry');
    const tabButtons = useRef([]);

    return <section className="hunting-page" aria-labelledby="hunter-title">
        <div className="washing-intro">
            <p className="eyebrow page-kicker">VIDRARIOS / VÂNĂTOARE (WORK IN PROGRESS)</p>
            <h1 id="hunter-title">VÂNĂTOR</h1>
            <p>Explorează zonele de vânătoare și calculează valoarea produselor din inventar.</p>
        </div>
        <div className="arsenal-tabs hunting-tabs" role="tablist" aria-label="Pagini vânător">
            {tabs.map(({id, label}, index) => <button key={id} ref={element => {tabButtons.current[index] = element;}} id={`hunter-tab-${id}`} role="tab" aria-selected={tab === id} aria-controls={`hunter-panel-${id}`} tabIndex={tab === id ? 0 : -1} className={tab === id ? 'selected' : ''} onClick={() => setTab(id)} onKeyDown={event => {
                const next = event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : event.key === 'ArrowRight' ? (index + 1) % tabs.length : event.key === 'ArrowLeft' ? (index + tabs.length - 1) % tabs.length : null;
                if (next !== null) {event.preventDefault(); setTab(tabs[next].id); tabButtons.current[next].focus();}
            }}>{label}</button>)}
        </div>
        <div id="hunter-panel-map" role="tabpanel" aria-labelledby="hunter-tab-map" hidden={tab !== 'map'}><HuntingMap embedded /></div>
        <div id="hunter-panel-registry" role="tabpanel" aria-labelledby="hunter-tab-registry" hidden={tab !== 'registry'}><HuntingRegistry /></div>
    </section>;
}
