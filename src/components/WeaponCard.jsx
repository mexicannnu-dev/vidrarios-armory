import {ammoFor, ammoNote, attachmentById, dirtyPrice, fmt, groupsFor, recipe, validQty, weapons} from '../model.js';

export function PaymentPrices({clean}) {
    return <><span className="clean-price">{fmt(clean)} $ curați</span><span className="payment-or"> / </span><span className="dirty-price">{fmt(dirtyPrice(clean))} $ murdari</span></>;
}

function Stepper({value, min = 0, increment = 1, label, onChange}) {
    return <div className="stepper">
        <button type="button" aria-label={`Scade ${label}`} onClick={() => onChange(Math.max(min, Number(value) - increment))}>−</button>
        <input type="number" min={min} max="999999" step="1" value={value} aria-label={label} onChange={e => onChange(e.target.value === '' ? '' : Number(e.target.value))} />
        <button type="button" aria-label={`Crește ${label}`} onClick={() => onChange(Math.min(999999, Number(value) + increment))}>+</button>
    </div>;
}

export default function WeaponCard({weapon: w, draft, added, onChange, onAdd}) {
    const groups = groupsFor(w), a = ammoFor(w);
    const update = patch => onChange({...draft, ...patch});
    function updateAttachment(group, id, qty) {
        const remaining = draft.attachments.filter(a => attachmentById(a.id).group !== group);
        update({attachments: id ? [...remaining, {id, qty}] : remaining});
    }
    return <article className="card" data-weapon={w.id}>
        <div className="art"><span className="serial">VA / {String(weapons.indexOf(w) + 1).padStart(2, '0')}</span><span className="type">{w.category === 'RIFLE/LMG' ? (['mg', 'combatmgmk2'].includes(w.id) ? 'LMG' : 'RIFLE') : w.category.toUpperCase()}</span><img className="weapon-image" src={w.image} alt={w.name} width="560" height="378" loading="lazy" decoding="async" /></div>
        <form className="card-body" onSubmit={e => {e.preventDefault(); onAdd(draft);}}>
            <div className="weapon-heading"><h3>{w.name}</h3><span className="price-badge">{w.price ? <PaymentPrices clean={w.price} /> : 'CRAFT'}</span></div>
            <p className="subtitle">{groups.length} tipuri · {w.attachments.length} variante de atașamente</p>
            <details className="recipe-details"><summary>Materialele necesare {w.price ? '& costul' : ''}</summary><p>{recipe(w.materials)}</p>{w.price > 0 && <><p>Preț unitar: <PaymentPrices clean={w.price} /></p><p>Banii murdari includ un adaos de 15%. Sumele sunt alternative de plată.</p></>}</details>
            <div className="field-title"><span>ATAȘAMENTE COMPATIBILE</span></div>
            <div className="attachment-list" tabIndex="0" role="region" aria-label={`Atașamente pentru ${w.name}`}>
                {groups.map((group, index) => {
                    const options = w.attachments.map(attachmentById).filter(a => a.group === group);
                    const selected = draft.attachments.find(a => attachmentById(a.id).group === group);
                    return <div className="attachment-control" key={group}>
                        <div className="field-title"><label htmlFor={`s-${w.id}-${index}`}><span className="mini-icon">{options[0].icon}</span> {group}</label></div>
                        <div className="attachment-select-row">
                            <select id={`s-${w.id}-${index}`} value={selected?.id || ''} aria-label={`${group} pentru ${w.name}`} onChange={e => updateAttachment(group, e.target.value, selected?.qty || 1)}>
                                <option value="">Fără {group.toLowerCase()}</option>{options.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                            </select>
                            <input type="number" min="1" max="999999" step="1" value={selected?.qty ?? 1} disabled={!selected} aria-label={`Număr ${group}`} onChange={e => updateAttachment(group, selected.id, e.target.value === '' ? '' : Number(e.target.value))} />
                        </div>
                        <p className="attachment-recipe">{selected ? recipe(attachmentById(selected.id).materials) : 'Selectează varianta dorită'}</p>
                    </div>;
                })}
                {!groups.length && <p className="missing-attachments">Niciun atașament disponibil pentru această armă.</p>}
            </div>
            <div className="quantity-row"><span>◇ &nbsp; Număr arme</span><Stepper value={draft.qty} min={1} label="Număr arme" onChange={qty => update({qty})} /></div>
            <div className="quantity-row"><span>▰ &nbsp; Gloanțe</span><Stepper value={draft.bullets} increment={10} label="Număr gloanțe" onChange={bullets => update({bullets})} /></div>
            <p className="ammo-note">{a.batch} gloanțe = {recipe(a.materials)}<br /><span>{validQty(draft.bullets) ? ammoNote(draft) : 'Introdu un număr valid de gloanțe.'}</span></p>
            <p className="quantity-help">Cantitățile atașamentelor și gloanțelor sunt totale pentru această poziție.</p>
            <button className="primary" type="submit">{added ? '✓ Adaugat în calculator · actualizare automată' : '＋ Adaugă în calculator'}</button>
        </form>
    </article>;
}
