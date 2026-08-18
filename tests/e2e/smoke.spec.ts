import { expect, test } from '@playwright/test';

test.describe('template smoke demo', () => {
  test('opens, reacts to canvas input, and restarts', async ({ page }) => {
    await page.goto('/');

    const canvas = page.getByTestId('game-canvas');
    const score = page.getByTestId('score');

    await expect(page.getByTestId('game-app')).toBeVisible();
    await expect(canvas).toBeVisible();
    await expect(score).toHaveText('0');
    await expect(score).toHaveAttribute('data-block-position', /\d+,\d+/);

    const initialPosition = await score.getAttribute('data-block-position');

    await canvas.click({ position: { x: 100, y: 100 } });

    await expect(score).toHaveText('10');
    await expect(score).toHaveAttribute('data-move-count', '1');
    await expect
      .poll(() => score.getAttribute('data-block-position'))
      .not.toBe(initialPosition);

    await page.getByTestId('restart-button').click();

    await expect(score).toHaveText('0');
    await expect(score).toHaveAttribute('data-move-count', '0');
    await expect(score).toHaveAttribute('data-block-position', initialPosition ?? '');
  });
});

test.describe('template smoke demo touch input', () => {
  test.use({ hasTouch: true });

  test('accepts a touch gesture on the canvas', async ({ page }) => {
    await page.goto('/');

    const canvas = page.getByTestId('game-canvas');
    const score = page.getByTestId('score');

    await expect(canvas).toBeVisible();
    await expect(score).toHaveText('0');

    await canvas.tap({ position: { x: 100, y: 100 } });

    await expect(score).toHaveText('10');
    await expect(score).toHaveAttribute('data-move-count', '1');
  });
});
