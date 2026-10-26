import {test} from 'node:test';
import assert from 'node:assert/strict';
import {existsSync} from 'node:fs';
import {weapons, ammoFor, attachmentById, dirtyPrice, emptyDraft, loadCart, totals, validItem, washMoney} from '../src/model.js';

test('catalog links, ammunition and images remain valid', () => {
    assert.equal(weapons.length, 23);
    for (const w of weapons) {
        assert.ok(ammoFor(w));
        assert.ok(existsSync(w.image), w.image);
        for (const id of w.attachments) assert.equal(attachmentById(id).weapon, w.id);
    }
});

test('totals combine weapons, rounded ammo batches and attachment quantities', () => {
    const w = weapons.find(w => w.attachments.length);
    const a = attachmentById(w.attachments[0]);
    const item = {...emptyDraft(w), qty: 2, bullets: 11, attachments: [{id: a.id, qty: 3}]};
    const expected = {};
    for (const [materials, qty] of [[w.materials, 2], [ammoFor(w).materials, Math.ceil(11 / ammoFor(w).batch)], [a.materials, 3]]) {
        for (const [name, value] of Object.entries(materials)) if (value > 0) expected[name] = (expected[name] || 0) + value * qty;
    }
    assert.deepEqual(totals([item]), {materials: expected, money: w.price * 2, ammoFee: 0});
    const paid = weapons.find(w => w.price > 0);
    assert.equal(totals([{...emptyDraft(paid), qty: 3}]).money, paid.price * 3);
});

test('legacy storage restores valid entries and rejects corrupt data', () => {
    const item = emptyDraft(weapons[0]);
    const saved = [null, item, {...item, qty: 2}, {...item, qty: -1}, {...item, attachments: [null]}];
    assert.deepEqual(loadCart({getItem: () => JSON.stringify(saved)}), [{...item, qty: 2}]);
    assert.deepEqual(loadCart({getItem: () => '{broken'}), []);
    assert.deepEqual(loadCart({getItem() {throw Error('unavailable');}}), []);
    assert.equal(validItem({...item, bullets: 0.5}), false);
    const id = weapons[0].attachments[0];
    assert.equal(validItem({...item, attachments: [{id, qty: 1}, {id, qty: 2}]}), false);
});

test('washing returns both rates and preserves cents', () => {
    assert.deepEqual(washMoney(100000, 5), {lost: 5000, clean: 95000});
    assert.deepEqual(washMoney(100000, 35), {lost: 35000, clean: 65000});
    assert.deepEqual(washMoney(123.45, 5), {lost: 6.17, clean: 117.28});
    assert.deepEqual(washMoney(0, 35), {lost: 0, clean: 0});
});

test('ammo order fee applies once at 500 entered bullets and includes dirty markup', () => {
    const w = weapons.find(w => w.price > 0);
    for (const bullets of [0, 1, 499, 500, 501, 1000]) {
        const item = {...emptyDraft(w), qty: 2, bullets};
        assert.ok(validItem(item));
        const total = totals([item]);
        const fee = bullets >= 500 ? 5000 : 0;
        assert.equal(total.ammoFee, fee);
        assert.equal(total.money, w.price * 2 + fee);
        assert.equal(dirtyPrice(total.money), dirtyPrice(w.price * 2) + dirtyPrice(fee));
    }
    const cart = weapons.slice(0, 2).map(w => ({...emptyDraft(w), bullets: 250}));
    assert.equal(totals(cart).ammoFee, 5000);
    cart[0].bullets = 249;
    assert.equal(totals(cart).ammoFee, 0);
    assert.equal(dirtyPrice(5000), 5750);
});
