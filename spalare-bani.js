const washingMoney = new Intl.NumberFormat('ro-RO', {maximumFractionDigits: 2});
const washingInput = document.querySelector('#washing-amount');
const washingError = document.querySelector('.washing-error');
const washingOptions = document.querySelectorAll('[data-loss]');

function updateWashing() {
    const empty = washingInput.value.trim() === '' && !washingInput.validity.badInput;
    const valid = empty || (washingInput.validity.valid && Number.isFinite(washingInput.valueAsNumber));
    washingInput.setAttribute('aria-invalid', String(!valid));
    washingError.hidden = valid;
    const cents = empty ? 0 : Math.round(washingInput.valueAsNumber * 100);

    washingOptions.forEach(option => {
        const lost = option.querySelector('[data-lost]');
        const clean = option.querySelector('[data-clean]');
        if (!valid) {
            lost.textContent = clean.textContent = '—';
            return;
        }
        const lostCents = Math.round(cents * Number(option.dataset.loss) / 100);
        lost.textContent = washingMoney.format(lostCents / 100) + ' $';
        clean.textContent = washingMoney.format((cents - lostCents) / 100) + ' $';
    });
}

washingInput.addEventListener('input', updateWashing);
updateWashing();
// Switch calculators within the same document without changing the URL.
document.querySelectorAll('[data-view]').forEach(control => {
    control.addEventListener('click', event => {
        event.preventDefault();
        const view = control.dataset.view;
        document.querySelectorAll('[data-page-view]').forEach(panel => {
            panel.hidden = panel.dataset.pageView !== view;
        });
        document.querySelectorAll('nav [data-view]').forEach(button => {
            const active = button.dataset.view === view;
            button.classList.toggle('active', active);
            button.setAttribute('aria-pressed', String(active));
        });
        document.title = view === 'washing'
            ? 'Calculator spălare bani | Vidrarios Armory'
            : 'Vidrarios Armory';
        window.scrollTo({top: 0, behavior: 'instant'});
    });
});

// Keep the public address clean when opening an explicit index.html link.
if (/^https?:$/.test(window.location.protocol) && /\/index\.html$/.test(window.location.pathname)) {
    window.history.replaceState(null, '', window.location.pathname.replace(/index\.html$/, '') + window.location.search);
}