import CATALOG from '../catalog.js';

export const {weapons, ammo, attachments} = CATALOG;
export const STORAGE = 'vidrarios-catalog-cart-v2';
export const fmt = n => n.toLocaleString('ro-RO', {maximumFractionDigits: 2});
export const weaponById = id => weapons.find(w => w.id === id);
export const attachmentById = id => attachments.find(a => a.id === id);
export const ammoFor = w => ammo.find(a => a.id === w.ammo);
export const groupsFor = w => [...new Set(w.attachments.map(id => attachmentById(id).group))];
export const emptyDraft = w => ({weapon: w.id, qty: 1, bullets: 0, attachments: []});
export const validQty = (n, min = 0) => Number.isSafeInteger(n) && n >= min && n <= 999999;
export const dirtyPrice = clean => Math.round(clean * 115 / 100);
export const ammoBatches = item => Math.ceil(item.bullets / ammoFor(weaponById(item.weapon)).batch);
export const recipe = materials => Object.entries(materials).filter(([, n]) => n > 0).map(([name, n]) => `${fmt(n)} × ${name}`).join(' · ') || 'Fără materiale';

export function validItem(item) {
    const w = weaponById(item?.weapon);
    return Boolean(w && validQty(item.qty, 1) && validQty(item.bullets) &&
        Array.isArray(item.attachments) && item.attachments.every(a => a && w.attachments.includes(a.id) && attachmentById(a.id) && validQty(a.qty, 1)) &&
        new Set(item.attachments.map(a => attachmentById(a.id).group)).size === item.attachments.length);
}

export function loadCart(storage) {
    try {
        const saved = JSON.parse(storage.getItem(STORAGE) || '[]');
        return Array.isArray(saved) ? [...new Map(saved.filter(validItem).map(i => [i.weapon, i])).values()] : [];
    } catch { return []; }
}

export function totals(cart) {
    const materials = {};
    let money = 0;
    const add = (recipe, qty) => Object.entries(recipe).forEach(([key, n]) => {
        if (n > 0 && qty > 0) materials[key] = (materials[key] || 0) + n * qty;
    });
    for (const item of cart) {
        const w = weaponById(item.weapon);
        money += w.price * item.qty;
        add(w.materials, item.qty);
        add(ammoFor(w).materials, ammoBatches(item));
        for (const a of item.attachments) add(attachmentById(a.id).materials, a.qty);
    }
    return {materials, money};
}

export function ammoNote(item) {
    const batches = ammoBatches(item), produced = batches * ammoFor(weaponById(item.weapon)).batch;
    return item.bullets ? `${fmt(batches)} loturi → ${fmt(produced)} gloanțe${produced > item.bullets ? ` (${fmt(produced - item.bullets)} în plus)` : ''}` : 'Fără muniție selectată';
}

export function washMoney(amount, lossPercent) {
    const cents = Math.round(amount * 100);
    const lost = Math.round(cents * lossPercent / 100);
    return {lost: lost / 100, clean: (cents - lost) / 100};
}
