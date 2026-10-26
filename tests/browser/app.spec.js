import {test, expect} from '@playwright/test';

test('intro loads the video and enters the app when playback ends', async ({page}) => {
    await page.goto('/');
    const video = page.locator('.intro-screen video');
    await expect(video).toBeVisible();
    await expect.poll(() => video.evaluate(element => element.readyState)).toBeGreaterThanOrEqual(2);
    await expect.poll(async () => (await video.evaluate(element => !element.paused)) || await page.getByRole('button', {name: 'Pornește videoclipul'}).isVisible()).toBe(true);
    if (await page.getByRole('button', {name: 'Pornește videoclipul'}).isVisible()) {
        await page.getByRole('button', {name: 'Pornește videoclipul'}).click();
    }
    await expect.poll(() => video.evaluate(element => element.currentTime)).toBeGreaterThan(0);
    if (await page.getByRole('button', {name: 'Activează sunetul'}).isVisible()) {
        await page.getByRole('button', {name: 'Activează sunetul'}).click();
    }
    expect(await video.evaluate(element => element.muted)).toBe(false);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.screenshot({path: test.info().outputPath('intro.png')});
    await video.evaluate(element => {element.currentTime = element.duration - 0.2;});
    await expect(page.locator('.intro-screen')).toHaveCount(0);
    await expect(page.locator('.card')).toHaveCount(15);
    await expect(page).toHaveURL('http://127.0.0.1:4173/');
});

test('calculator sections keep the same width and alignment when switching', async ({page}) => {
    await page.goto('/');
    await page.getByRole('button', {name: 'Sari peste intro'}).click();
    const bounds = selector => page.locator(selector).evaluate(element => {
        const {x, width} = element.getBoundingClientRect();
        return {x, width};
    });
    const header = await bounds('header');
    const main = await bounds('main');
    const armory = await bounds('#armory-view .layout');
    await page.getByRole('button', {name: 'CALCULATOR SPĂLARE BANI', exact: true}).click();
    expect(await bounds('header')).toEqual(header);
    expect(await bounds('main')).toEqual(main);
    expect(await bounds('.washing-calculator')).toEqual(armory);
    // Short content must reserve the same scrollbar space as the long catalog.
    await page.addStyleTag({content: '.washing-page {min-height: 0; padding-block: 0}'});
    expect(await bounds('main')).toEqual(main);
    expect(await bounds('.washing-calculator')).toEqual(armory);
});

test('catalog, configuration, persistence and both calculators work together', async ({page}) => {
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto('/index.html');
    await page.getByRole('button', {name: 'Sari peste intro'}).click();
    await expect(page).toHaveURL('http://127.0.0.1:4173/');
    await expect(page.locator('.card')).toHaveCount(15);
    const card = page.locator('[data-weapon="pistol"]');
    await card.getByRole('combobox').first().selectOption({index: 1});
    await card.getByRole('spinbutton', {name: 'Număr arme', exact: true}).fill('2');
    await card.getByRole('spinbutton', {name: 'Număr gloanțe', exact: true}).fill('11');
    await card.getByRole('button', {name: 'Adaugă în calculator'}).click();
    await expect(page.locator('.cart-item')).toContainText('2 × armă');
    await expect(page.locator('.cart-item')).toContainText('20 gloanțe');
    await card.getByRole('button', {name: 'Crește Număr arme', exact: true}).click();
    await expect(page.locator('.cart-item')).toContainText('3 × armă');
    await page.reload();
    await page.getByRole('button', {name: 'Sari peste intro'}).click();
    await expect(page.locator('.cart-item')).toContainText('3 × armă');
    await expect(card.getByRole('spinbutton', {name: 'Număr arme', exact: true})).toHaveValue('3');
    await page.getByRole('button', {name: 'Neo & Oficiale'}).click();
    await expect(page.locator('.card')).toHaveCount(8);
    await page.getByRole('textbox', {name: 'Caută o armă'}).fill('not-a-weapon');
    await expect(page.locator('.no-results')).toBeVisible();
    await page.getByRole('button', {name: 'CALCULATOR SPĂLARE BANI', exact: true}).click();
    await page.getByLabel('Sumă bani murdari ($)').fill('100000');
    const outputs = page.locator('.washing-net output');
    await expect(outputs.nth(0)).toHaveText('95.000 $');
    await expect(outputs.nth(1)).toHaveText('65.000 $');
    await expect(page).toHaveURL('http://127.0.0.1:4173/');
    await page.getByLabel('Sumă bani murdari ($)').fill('-1');
    await expect(page.locator('.washing-error')).toBeVisible();
    await expect(outputs.nth(0)).toHaveText('—');
    await page.getByLabel('Sumă bani murdari ($)').fill('123.45');
    await expect(outputs.nth(0)).toHaveText('117,28 $');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.screenshot({path: test.info().outputPath('washing.png'), fullPage: true});
    await page.getByRole('button', {name: 'CALCULATOR MATERIALE ARME', exact: true}).click();
    await page.getByRole('button', {name: 'Civili'}).click();
    await expect(page.locator('.cart-item')).toContainText('3 × armă');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.screenshot({path: test.info().outputPath('catalog.png')});
    await page.getByRole('button', {name: 'Șterge Pistol', exact: true}).click();
    await expect(page.locator('.cart-item')).toHaveCount(0);
    expect(errors).toEqual([]);
});
