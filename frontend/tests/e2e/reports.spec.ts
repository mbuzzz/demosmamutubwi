import { expect, test } from '@playwright/test';

const reports = [
  { label: 'Rekap Absensi Siswa', path: '/panel/guru/absensi/rekap' },
  { label: 'Laporan Absensi Guru', path: '/panel/guru/absensi/guru' },
  { label: 'Rapor Siswa', path: '/panel/guru/rapor' },
  { label: 'Laporan Piket', path: '/panel/piket/laporan' },
] as const;

test('public shell and protected report routes are reachable', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/.+/);

  for (const report of reports) {
    const response = await page.goto(report.path);
    expect(response?.status(), report.path).toBe(200);
    await expect(page.locator('#root')).toBeVisible();
  }
});

test('Kurikulum can open every report from the mobile navigation', async ({ page }) => {
  const username = process.env.E2E_KURIKULUM_USERNAME;
  const password = process.env.E2E_KURIKULUM_PASSWORD;

  test.skip(!username || !password, 'Set E2E_KURIKULUM_USERNAME and E2E_KURIKULUM_PASSWORD for authenticated coverage.');

  const apiFailures: string[] = [];
  page.on('response', (response) => {
    if (response.url().includes('/api/') && response.status() >= 500) {
      apiFailures.push(`${response.status()} ${response.url()}`);
    }
  });

  await page.goto('/login/guru');
  await page.getByLabel('Username Pendidik').fill(username!);
  await page.getByLabel('Password').fill(password!);
  await page.getByRole('button', { name: /Masuk Portal Guru/i }).click();
  await expect(page).toHaveURL(/\/panel\/guru/);

  await page.getByText('Laporan', { exact: true }).first().click();

  for (const report of reports) {
    const link = page.getByRole('link', { name: report.label }).first();
    await expect(link).toBeVisible();
    await link.click();
    await expect(page).toHaveURL(new RegExp(report.path.replace(/\//g, '\\/') + '$'));
    await expect(page.locator('#root')).toBeVisible();
    await page.goBack();
    await page.getByText('Laporan', { exact: true }).first().click();
  }

  expect(apiFailures).toEqual([]);
});
