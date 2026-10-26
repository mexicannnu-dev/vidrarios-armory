import {ammoNote, attachmentById, dirtyPrice, fmt, totals, weaponById} from '../model.js';
import {PaymentPrices} from './WeaponCard.jsx';

const icons = {
    'Arc Metalic': 'arc-metalic.webp', 'Bec': 'bec.webp', 'Lupă': 'lupa.webp', 'Oțel': 'otel.webp',
    'Polimer': 'polimer.webp', 'Praf de Pușcă': 'praf-de-pusca.webp', 'Șuruburi': 'suruburi.webp',
    'Țeavă Metalică': 'teava-metalica.webp', 'Bucată de Lemn': 'BucataDeLemn.webp'
};

export default function Cart({cart, onRemove, onClear}) {
    const total = totals(cart);
    const weaponsCost = total.money - total.ammoFee;
    const bullets = cart.reduce((sum, item) => sum + item.bullets, 0);
    const billedBullets = Math.floor(bullets / 500) * 500;
    const paidWeapons = cart.filter(item => weaponById(item.weapon).price > 0);
    const weaponsLabel = paidWeapons.length === 1
        ? `${fmt(paidWeapons[0].qty)} × ${weaponById(paidWeapons[0].weapon).name}`
        : 'Arme';

    function breakdown(dirty = false) {
        const price = dirty ? dirtyPrice : amount => amount;
        return <p className="money-equation">
            <span>{fmt(price(weaponsCost))} $ <span className="money-equation-label">{weaponsLabel}</span></span>
            <span aria-hidden="true"> + </span>
            <span>{fmt(price(total.ammoFee))} $ <span className="money-equation-label">{fmt(billedBullets)} gloanțe</span></span>
        </p>;
    }
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
            <div className="money-options"><p>Alternative de plată pentru arme și taxa comenzii de gloanțe (fără atașamente).</p>
                <div className="money-total"><span>Total $ curați</span><b>{fmt(total.money)}</b></div>
                {breakdown()}
                <div className="money-total dirty-total"><span>Total $ murdari <small>+15%</small></span><b>{fmt(dirtyPrice(total.money))}</b></div>
                {breakdown(true)}
                {bullets !== billedBullets && <p>{fmt(bullets)} gloanțe introduse: {fmt(billedBullets)} taxate și {fmt(bullets - billedBullets)} sub următorul prag de 500.</p>}
            </div>
            <p className="quantity-help">Fiecare grup complet de 500 de gloanțe introduse în total costă 5.000$ curați (5.750$ murdari): 1.000 de gloanțe = 10.000$ curați (11.500$ murdari). Poți calcula orice cantitate, inclusiv sub 500.</p>
            <p className="quantity-help">Prețurile armelor se adună separat. Muniția se produce în loturi de 10, rotunjite în sus.</p>
            <small>Configurația se salvează în acest browser.</small>
        </div>
    </aside>;
}
