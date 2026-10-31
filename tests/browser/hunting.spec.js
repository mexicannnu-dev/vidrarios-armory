import {test, expect} from '@playwright/test';

test.beforeEach(async ({page}) => {
    await page.addInitScript(() => sessionStorage.setItem('vidrarios-intro-seen', '1'));
    await page.goto('/');
    await page.getByRole('button', {name: 'VÂNĂTOR', exact: true}).click();
});

test('hunter navigation, registry totals, filters and reset', async ({page}) => {
    await expect(page.locator('header nav button').last()).toHaveText('VÂNĂTOR');
    await page.getByRole('tab', {name: 'Registru', exact: true}).click();
    await expect(page.locator('.registry-table tbody tr')).toHaveCount(19);
    await page.getByRole('spinbutton', {name: 'ARMADILLO — Carne', exact: true}).fill('2');
    await page.getByRole('spinbutton', {name: 'ARMADILLO — Piele perfectă', exact: true}).fill('3');
    await page.getByRole('spinbutton', {name: 'ARABIAN ORYX — Coarne', exact: true}).fill('2');
    await expect(page.getByTestId('animal-total-0')).toHaveText('3.730 $');
    await expect(page.getByTestId('registry-total')).toHaveText('6.730 $');
    await page.getByRole('button', {name: 'Nivel V', exact: true}).click();
    await expect(page.locator('.registry-table tbody tr')).toHaveCount(5);
    await expect(page.getByTestId('registry-total')).toHaveText('6.730 $');
    await page.getByRole('tab', {name: 'Harta vânătorului', exact: true}).click();
    await expect(page.locator('.hunting-map')).toBeVisible();
    await page.getByRole('tab', {name: 'Registru', exact: true}).click();
    await expect(page.getByTestId('registry-total')).toHaveText('6.730 $');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.screenshot({path: test.info().outputPath('registry.png'), fullPage: true});
    await page.getByRole('button', {name: 'Resetează registrul'}).click();
    await expect(page.getByTestId('registry-total')).toHaveText('0 $');
    await expect(page.getByRole('spinbutton', {name: 'ARABIAN ORYX — Coarne', exact: true})).toHaveValue('');
});

test('hunter tabs work with keyboard navigation', async ({page}) => {
    const mapTab = page.getByRole('tab', {name: 'Harta vânătorului', exact: true});
    const registryTab = page.getByRole('tab', {name: 'Registru', exact: true});
    await mapTab.focus();
    await page.keyboard.press('ArrowRight');
    await expect(registryTab).toBeFocused();
    await expect(registryTab).toHaveAttribute('aria-selected', 'true');
    await page.keyboard.press('Home');
    await expect(registryTab).toBeFocused();
    await expect(registryTab).toHaveAttribute('aria-selected', 'true');
});
