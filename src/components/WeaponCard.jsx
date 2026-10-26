import {ammoFor, ammoNote, attachmentById, dirtyPrice, fmt, groupsFor, validQty, weapons} from '../model.js';

export function PaymentPrices({clean}) {
    return <><span className="clean-price">{fmt(clean)} $ curați</span><span className="payment-or"> / </span><span className="dirty-price">{fmt(dirtyPrice(clean))} $ murdari</span></>;
}

function MaterialRecipe({materials}) {
    const entries = Object.entries(materials).filter(([, qty]) => qty > 0);
    return entries.length ? entries.map(([name, qty], index) => <span key={name}>{index > 0 && ' · '}<strong className="recipe-quantity">{fmt(qty)}</strong> × {name}</span>) : 'Fără materiale';
}

function Stepper({value, min = 0, increment = 1, label, onChange}) {
    return <div className="stepper">
        <button type="button" aria-label={`Scade ${label}`} onClick={() => onChange(Math.max(min, Number(value) - increment))}>−</button>
        <input type="number" min={min} max="999999" step="1" value={value} aria-label={label} onChange={e => onChange(e.target.value === '' ? '' : Number(e.target.value))} />
        <button type="button" aria-label={`Crește ${label}`} onClick={() => onChange(Math.min(999999, Number(value) + increment))}>+</button>
    </div>;
}

export default function WeaponCard({weapon: w, draft, added, onChange, onAdd, onRemove}) {
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
            <details className="recipe-details"><summary>Materialele necesare {w.price ? '& costul' : ''}</summary><p><MaterialRecipe materials={w.materials} /></p>{w.price > 0 && <><p>Preț unitar: <PaymentPrices clean={w.price} /></p><p>Banii murdari includ un adaos de 15%. Sumele sunt alternative de plată.</p></>}</details>
            <div className="field-title"><span>ATAȘAMENTE COMPATIBILE</span></div>
            <div className="attachment-list" tabIndex="0" role="region" aria-label={`Atașamente pentru ${w.name}`}>
                {groups.map((group, index) => {
                    const options = w.attachments.map(attachmentById).filter(a => a.group === group);
                    const selected = draft.attachments.find(a => attachmentById(a.id).group === group);
                    return <div className={`attachment-control${selected ? ' has-selection' : ''}`} key={group}>
                        <div className="field-title"><label htmlFor={`s-${w.id}-${index}`}><span className="mini-icon">{options[0].icon}</span> {group}</label></div>
                        <div className="attachment-select-row">
                            <select id={`s-${w.id}-${index}`} value={selected?.id || ''} aria-label={`${group} pentru ${w.name}`} onChange={e => updateAttachment(group, e.target.value, selected?.qty || 1)}>
                                <option value="">Fără {group.toLowerCase()}</option>{options.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                            </select>
                            <input type="number" min="1" max="999999" step="1" value={selected?.qty ?? 1} disabled={!selected} aria-label={`Număr ${group}`} onChange={e => updateAttachment(group, selected.id, e.target.value === '' ? '' : Number(e.target.value))} />
                        </div>
                        <p className="attachment-recipe">{selected ? <MaterialRecipe materials={attachmentById(selected.id).materials} /> : 'Selectează varianta dorită'}</p>
                    </div>;
                })}
                {!groups.length && <p className="missing-attachments">Niciun atașament disponibil pentru această armă.</p>}
            </div>
            <div className="quantity-row"><span>◇ &nbsp; Număr arme</span><Stepper value={draft.qty} min={1} label="Număr arme" onChange={qty => update({qty})} /></div>
            <div className="quantity-row"><span>▰ &nbsp; Gloanțe</span><Stepper value={draft.bullets} increment={10} label="Număr gloanțe" onChange={bullets => update({bullets})} /></div>
            <p className="ammo-note">{a.batch} gloanțe = <MaterialRecipe materials={a.materials} /><br /><span>{validQty(draft.bullets) ? ammoNote(draft) : 'Introdu un număr valid de gloanțe.'}</span></p>
            <p className="quantity-help">Cantitățile atașamentelor și gloanțelor sunt totale pentru această poziție.</p>
            <div className={`configure-action${added ? ' has-remove' : ''}`}>
            <button className={`primary configure-button${added ? ' is-added' : ''}`} type="submit">
                <span className="configure-button-icon" aria-hidden="true">{added ? '✓' : '+'}</span>
                <span className="configure-button-copy"><span>{added ? 'Adăugat în calculator' : 'Adaugă în calculator'}</span><small>{added ? 'ACTUALIZARE AUTOMATĂ ACTIVĂ' : 'CONFIGURAȚIA TA. REGULILE TALE.'}</small></span>
                {!added && <span className="configure-button-arrow" aria-hidden="true">↗</span>}
            </button>
            {added && <button className="configure-remove" type="button" aria-label={`Scoate ${w.name} din calculator`} title="Scoate arma din calculator" onClick={() => onRemove(w.id)}>×</button>}
            </div>
        </form>
    </article>;
}
