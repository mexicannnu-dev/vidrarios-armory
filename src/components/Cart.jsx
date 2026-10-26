import {ammoNote, attachmentById, dirtyPrice, fmt, totals, weaponById} from '../model.js';
import {PaymentPrices} from './WeaponCard.jsx';

const icons = {
    'Arc Metalic': 'arc-metalic.webp', 'Bec': 'bec.webp', 'Lupă': 'lupa.webp', 'Oțel': 'otel.webp',
    'Polimer': 'polimer.webp', 'Praf de Pușcă': 'praf-de-pusca.webp', 'Șuruburi': 'suruburi.webp',
    'Țeavă Metalică': 'teava-metalica.webp', 'Bucată de Lemn': 'BucataDeLemn.webp'
};

export default function Cart({cart, onRemove, onClear}) {
    const total = totals(cart);
    return <aside tabIndex="0" role="region" aria-label="Configurația ta și total materiale — derulare independentă">
        <div className="section-head"><h2>CALCULATOR <span>{cart.length}</span></h2><button className="text-btn" disabled={!cart.length} onClick={onClear}>Golește</button></div>
        <div>{cart.length ? cart.map(item => {
            const w = weaponById(item.weapon);
            return <div className="cart-item" key={item.weapon}>
                <h4>{w.name}<button aria-label={`Șterge ${w.name}`} onClick={() => onRemove(item.weapon)}>×</button></h4>
                <p><strong>{fmt(item.qty)} × armă</strong>{w.price > 0 && <> · <PaymentPrices clean={w.price * item.qty} /></>}</p>
                <p>{fmt(item.bullets)} gloanțe · {ammoNote(item)}</p>
                {item.attachments.length ? item.attachments.map(a => <p key={a.id}>{fmt(a.qty)} × {attachmentById(a.id).name}</p>) : <p>Fără atașamente</p>}
            </div>;
        }) : <div className="empty"><div className="empty-icon">▱</div><b>Încă nu ai adăugat nimic</b><p>Adaugă o armă din armory.<br />Modificările ulterioare se actualizează automat.</p></div>}</div>
        <div className="totals"><p className="eyebrow">NECESAR PENTRU COMANDĂ</p><h4>TOTAL MATERIALE & BANI</h4>
            {Object.entries(total.materials).map(([name, qty]) => <div className="total-row" key={name}><span className="material-label">{icons[name] ? <img className="material-icon" src={`assets/materials/${icons[name]}`} alt="" width="38" height="38" /> : <span className="material-fallback" aria-hidden="true">◇</span>}<span>{name}</span></span><b>{fmt(qty)}</b></div>)}
            {!Object.keys(total.materials).length && <div className="total-row"><span>Niciun material necesar</span><b>—</b></div>}
            <div className="money-options"><p>Alternative de plată pentru armă (nu intră și atașamentele).</p><div className="money-total"><span>Total $ curați</span><b>{fmt(total.money)}</b></div><div className="money-total dirty-total"><span>Total $ murdari <small>+15%</small></span><b>{fmt(dirtyPrice(total.money))}</b></div></div>
            <p className="quantity-help">Prețurile armelor se adună separat. Muniția se produce în loturi de 10, rotunjite în sus.</p>
            <small>Configurația se salvează în acest browser.</small>
        </div>
    </aside>;
}
