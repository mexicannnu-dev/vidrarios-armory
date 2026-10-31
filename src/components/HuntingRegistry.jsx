import {useState} from 'react';
import {huntingAnimals} from '../huntingRegistry.js';

const products = ['Carne', 'Piele perfectă', 'Piele bună', 'Piele slabă', 'Coarne'];
const money = value => `${new Intl.NumberFormat('ro-RO').format(value)} $`;

function ProductIcon({index}) {
    if (index > 0 && index < 4) return <span>{'★'.repeat(4 - index)}</span>;
    return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        {index === 0 ? <><path d="M15 3c-3 0-6 3-6 6 0 2 1 3 3 3 3 0 6-3 6-6 0-2-1-3-3-3Z" /><path d="m10 11-5 5a2 2 0 1 0-2 3 2 2 0 1 0 3 2l6-8" /></> : <><path d="M7 3h10v5a5 5 0 0 1-10 0V3ZM12 13v6M8 21h8M9 19h6M7 5H3v2a4 4 0 0 0 4 4M17 5h4v2a4 4 0 0 1-4 4" /></>}
    </svg>;
}

export default function HuntingRegistry() {
    const [quantities, setQuantities] = useState({});
    const [search, setSearch] = useState('');
    const [level, setLevel] = useState('Toate');
    const normalize = text => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    const rows = huntingAnimals.map(animal => ({...animal,
        subtotal: animal.prices.reduce((sum, price, index) => sum + (price ?? 0) * Number(quantities[`${animal.id}-${index}`] || 0), 0),
        quantity: animal.prices.reduce((sum, price, index) => sum + (price === null ? 0 : Number(quantities[`${animal.id}-${index}`] || 0)), 0)
    }));
    const total = rows.reduce((sum, row) => sum + row.subtotal, 0);
    const quantity = rows.reduce((sum, row) => sum + row.quantity, 0);
    const breakdown = [{name: 'Carne', indices: [0], icon: 0}, {name: 'Piei', indices: [1, 2, 3], icon: 1}, {name: 'Trofee', indices: [4], icon: 4}].map(group => ({...group,
        value: rows.reduce((sum, animal) => sum + group.indices.reduce((amount, index) => amount + (animal.prices[index] ?? 0) * Number(quantities[`${animal.id}-${index}`] || 0), 0), 0)
    }));
    const visible = rows.filter(animal => (level === 'Toate' || animal.level === level) && normalize(animal.name).includes(normalize(search)));

    return <section className="hunting-registry" aria-labelledby="registry-title">
        <div className="section-head catalog-heading registry-heading">
            <h2 id="registry-title">Registru de vânătoare <span>{huntingAnimals.length}</span></h2>
            <label className="search"><input aria-label="Caută un animal" placeholder="Caută un animal…" value={search} onChange={event => setSearch(event.target.value)} /></label>
        </div>
        <div className="registry-overview" aria-label="Valoare pe categorii">
            {breakdown.map(group => <div className="registry-metric" key={group.name}>
                <span className="registry-metric-icon" aria-hidden="true"><ProductIcon index={group.icon} /></span>
                <div><span className="registry-metric-label">{group.name}</span><strong>{money(group.value)}</strong></div>
                <span className="registry-metric-share">{total ? Math.round(group.value / total * 100) : 0}% din total</span>
                <div className="registry-metric-track" aria-hidden="true"><span style={{width: `${total ? group.value / total * 100 : 0}%`}} /></div>
            </div>)}
        </div>
        <p className="registry-help">Introdu cantitățile pentru fiecare produs. Subtotalurile și valoarea totală se calculează automat.</p>
        <div className="filters" aria-label="Filtrează animalele după nivel">{['Toate', 'I', 'II', 'III', 'IV', 'V'].map(value => <button key={value} className={level === value ? 'selected' : ''} aria-pressed={level === value} onClick={() => setLevel(value)}>{value === 'Toate' ? 'Toate animalele' : `Nivel ${value}`}</button>)}</div>
        <div className="registry-layout">
            <div className="registry-table-scroll" role="region" aria-label="Prețuri și cantități produse de vânătoare" tabIndex={0}>
                <table className="registry-table">
                    <caption className="registry-caption">Prețuri pe unitate · Cantități între 0 și 9.999<span className="registry-scroll-hint">Glisează pentru toate coloanele →</span></caption>
                    <thead><tr><th scope="col">Specie animal</th>{products.map((product, index) => <th scope="col" key={product}><span className="registry-quality" aria-hidden="true"><ProductIcon index={index} /></span>{product}</th>)}<th scope="col">Subtotal</th></tr></thead>
                    <tbody>{visible.map(animal => <tr key={animal.id} className={animal.quantity ? 'registry-row-filled' : ''}>
                        <th scope="row"><div className="registry-species"><span className="registry-row-number" aria-hidden="true">{String(animal.id + 1).padStart(2, '0')}</span><div><span className="registry-animal">{animal.name}</span><span className="registry-level">LVL {animal.level}</span></div></div></th>
                        {animal.prices.map((price, index) => <td key={index}>{price === null ? <span className="registry-unavailable" aria-label="Produs indisponibil">—</span> : <>
                            <input type="number" min="0" max="9999" step="1" inputMode="numeric" aria-label={`${animal.name} — ${products[index]}`} placeholder="0" value={quantities[`${animal.id}-${index}`] ?? ''} onChange={event => {
                                const value = event.target.value;
                                if (/^\d{0,4}$/.test(value)) setQuantities(previous => ({...previous, [`${animal.id}-${index}`]: value}));
                            }} />
                            <span className="registry-price">{money(price)}</span>
                        </>}</td>)}
                        <td className={`registry-subtotal ${animal.quantity ? 'has-value' : ''}`} data-testid={`animal-total-${animal.id}`}>{money(animal.subtotal)}</td>
                    </tr>)}{!visible.length && <tr><td colSpan={7} className="registry-empty">Niciun animal găsit. Încearcă alt nume sau nivel.</td></tr>}</tbody>
                </table>
            </div>
            <aside className="registry-summary" aria-labelledby="registry-summary-title">
                <div className="registry-total"><h2 id="registry-summary-title">Valoare totală estimată</h2><output data-testid="registry-total" aria-live="polite" aria-atomic="true">{money(total)}</output></div>
                <div className="registry-summary-details"><dl><div><dt>Produse</dt><dd>{quantity.toLocaleString('ro-RO')}</dd></div><div><dt>Specii</dt><dd>{rows.filter(row => row.quantity > 0).length}</dd></div></dl><p className="registry-help">Include și animalele ascunse de filtre.</p></div>
                <button className="registry-reset" disabled={!quantity} onClick={() => setQuantities({})}>Resetează registrul</button>
            </aside>
        </div>
    </section>;
}
