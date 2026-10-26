import {useState} from 'react';
import {fmt, washMoney} from '../model.js';

export default function WashingCalculator() {
    const [input, setInput] = useState({value: '', valid: true});
    return <div className="washing-page">
        <div className="washing-intro"><p className="eyebrow page-kicker">VIDRARIOS / CALCULATOR FINANCIAR</p><h1>CALCULATOR <em>SPĂLARE BANI</em></h1><p>Introdu suma de bani murdari pentru a vedea cât pierzi și câți bani curați primești.</p></div>
        <section className="washing-calculator" aria-labelledby="washing-title">
            <div className="section-head"><h2 id="washing-title">Compară variantele de spălare</h2></div>
            <label htmlFor="washing-amount">Sumă bani murdari ($)</label>
            <input id="washing-amount" type="number" min="0" max="1000000000000" step="0.01" placeholder="Ex: 100000" inputMode="decimal" value={input.value} aria-invalid={!input.valid} aria-describedby="washing-help washing-error" onChange={e => setInput({value: e.target.value, valid: e.target.validity.valid && !e.target.validity.badInput})} />
            <p id="washing-help" className="washing-help">Introdu suma o singură dată. Ambele variante se calculează automat.</p>
            <p id="washing-error" className="washing-error" hidden={input.valid}>Introdu o sumă între 0 și 1.000.000.000.000, cu maximum 2 zecimale.</p>
            <div className="washing-comparison" role="status" aria-live="polite" aria-atomic="true">
                {[{name: 'Cayo', loss: 5}, {name: 'Chinez', loss: 35}].map(({name, loss}) => {
                    const result = washMoney(Number(input.value), loss), id = name.toLowerCase();
                    return <section className="washing-option" key={name} aria-labelledby={`${id}-title`}>
                        <p className="washing-route">{loss === 5 ? '01 / CAYO' : '02 / CHINEZ'}</p>
                        <div className="section-head"><h2 id={`${id}-title`}>Bani spălați {name}</h2><span className="washing-rate">Pierdere {loss}%</span></div>
                        <div className="washing-net"><span>Bani curați primiți</span><output htmlFor="washing-amount">{input.valid ? `${fmt(result.clean)} $` : '—'}</output></div>
                        <p className="washing-help">Primești {100 - loss}% din suma introdusă.</p>
                        <div className="washing-loss"><span>Bani pierduți ({loss}%)</span><output htmlFor="washing-amount">{input.valid ? `${fmt(result.lost)} $` : '—'}</output></div>
                    </section>;
                })}
            </div>
        </section>
    </div>;
}
