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