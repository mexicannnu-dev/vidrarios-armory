import {useEffect, useRef, useState} from 'react';
import {emptyDraft, loadCart, STORAGE, validItem, weapons} from './model.js';
import WeaponCard from './components/WeaponCard.jsx';
import Cart from './components/Cart.jsx';
import WashingCalculator from './components/WashingCalculator.jsx';
import Intro from './components/Intro.jsx';

export default function App() {
    const [intro, setIntro] = useState(() => {
        try { return sessionStorage.getItem('vidrarios-intro-seen') !== '1'; }
        catch { return true; }
    });
    const [view, setView] = useState('armory');
    const [enteredFromIntro, setEnteredFromIntro] = useState(false);
    const [cart, setCart] = useState(() => {
        try { return loadCart(localStorage); } catch { return []; }
    });
    const [drafts, setDrafts] = useState(() => Object.fromEntries(cart.map(item => [item.weapon, item])));
    const [arsenal, setArsenal] = useState('craft');
    const [category, setCategory] = useState('Toate');
    const [search, setSearch] = useState('');
    const [toast, setToast] = useState('');
    const toastTimer = useRef();
    const [storageError, setStorageError] = useState(false);

    useEffect(() => {
        try { localStorage.setItem(STORAGE, JSON.stringify(cart)); setStorageError(false); }
        catch { setStorageError(true); }
    }, [cart]);
    useEffect(() => () => clearTimeout(toastTimer.current), []);
    useEffect(() => {
        try { sessionStorage.setItem('vidrarios-intro-seen', '1'); }
        catch { /* The app remains usable when browser storage is unavailable. */ }
    }, []);
    useEffect(() => {
        document.title = view === 'washing' ? 'Calculator spălare bani | Vidrarios Armory' : 'Vidrarios Armory';
    }, [view]);

    function notify(message) {
        setToast(message);
        clearTimeout(toastTimer.current);
        toastTimer.current = setTimeout(() => setToast(''), 2500);
    }
    function navigate(next) {
        setView(next);
        window.scrollTo({top: 0, behavior: 'instant'});
    }
    function changeDraft(item) {
        setDrafts(previous => ({...previous, [item.weapon]: item}));
        if (validItem(item)) setCart(previous => previous.map(saved => saved.weapon === item.weapon ? item : saved));
    }
    function add(item) {
        if (!validItem(item)) { notify('Introdu cantități valide între 0 și 999999 (minimum 1 pentru atașamente).'); return; }
        const exists = cart.some(saved => saved.weapon === item.weapon);
        setCart(previous => exists ? previous.map(saved => saved.weapon === item.weapon ? item : saved) : [...previous, item]);
    }
    const list = weapons.filter(w => (arsenal === 'neo' ? w.price > 0 : w.price === 0) && (category === 'Toate' || w.category === category) && w.name.toLowerCase().includes(search.toLowerCase()));

    if (intro) return <Intro onFinish={() => {setEnteredFromIntro(true); setIntro(false); window.scrollTo({top: 0, behavior: 'instant'});}} />;

    return <div className={`app-shell design-technical ${enteredFromIntro ? 'app-reveal' : ''}`}>
        {enteredFromIntro && <div className="armory-transition" aria-hidden="true"><span /></div>}
        <header><a className="brand" href="/" onClick={e => {e.preventDefault(); navigate('armory');}}><img src="assets/logo.png" alt="Logo Vidrarios" /><span>VIDRARIOS <b>ARMORY</b><small>INVENTARUL TĂU. REGULILE TALE.</small></span></a>
            <nav aria-label="Navigare principală">{[{id: 'armory', label: 'CALCULATOR MATERIALE ARME'}, {id: 'washing', label: 'CALCULATOR SPĂLARE BANI'}].map(({id, label}) => <button key={id} type="button" className={view === id ? 'active' : ''} aria-controls={`${id}-view`} aria-pressed={view === id} onClick={() => navigate(id)}><b>{label}</b></button>)}</nav>
        </header>
        <main>
            <div id="armory-view" data-page-view="armory" hidden={view !== 'armory'}>
                <div className="notice"><span aria-hidden="true">◈</span><div><b>Minimum 500 de gloanțe per tip de armă pentru comandă · 5.000 $ / 500 gloanțe</b><p>Calculatorul permite în continuare calculul materialelor în loturi de câte 10 gloanțe.</p></div><span className="tag">MUNIȚIE</span></div>
                <div className="layout"><section id="catalog">
                    <div className="section-head catalog-heading"><h2>ARMORY <span>{list.length}</span></h2><div className="armory-approval"><span>Approved by</span><strong>Vali Furtuna</strong></div><label className="search">⌕ <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Caută o armă…" aria-label="Caută o armă" /></label></div>
                    <div className="arsenal-tabs" aria-label="Tip arsenal">{[{id: 'craft', name: 'Civili'}, {id: 'neo', name: 'Neo & Oficiale'}].map(({id, name}) => <button key={id} className={arsenal === id ? 'selected' : ''} aria-pressed={arsenal === id} onClick={() => {setArsenal(id); setCategory('Toate'); setSearch('');}}>{name}<span>{weapons.filter(w => id === 'neo' ? w.price > 0 : w.price === 0).length}</span></button>)}</div>
                    <div className="filters">{['Toate', 'Pistol', 'SMG', 'RIFLE/LMG'].map(name => <button key={name} className={category === name ? 'selected' : ''} aria-pressed={category === name} onClick={() => setCategory(name)}>{name}</button>)}</div>
                    <div className="cards">{list.map(w => <WeaponCard key={w.id} weapon={w} draft={drafts[w.id] || emptyDraft(w)} added={cart.some(item => item.weapon === w.id)} onChange={changeDraft} onAdd={add} onRemove={id => setCart(previous => previous.filter(item => item.weapon !== id))} />)}{!list.length && <div className="no-results">Nicio armă găsită. Încearcă alt nume.</div>}</div>
                    <p className="footnote">01 — Selectează &nbsp; / &nbsp; 02 — Configurează &nbsp; / &nbsp; 03 — Adaugă în calculator</p>
                </section><Cart cart={cart} onRemove={id => setCart(previous => previous.filter(item => item.weapon !== id))} onClear={() => {setCart([]); notify('Coșul a fost golit');}} /></div>
            </div>
            <div id="washing-view" data-page-view="washing" hidden={view !== 'washing'}><WashingCalculator /></div>
        </main>
        <footer><b>VIDRARIOS ARMORY</b><span>Planifică. Configurează. Fii pregătit.</span><span>© 2026 Vidrarios Armory · Made by MeXicaNu</span></footer>
        <div id="toast" className={toast || storageError ? 'show' : ''} role="status">{toast || (storageError ? 'Salvarea locală nu este disponibilă.' : '')}</div>
    </div>;
}
