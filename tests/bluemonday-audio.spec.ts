import { test, expect } from '@playwright/test';

// Theme: BlueMonday - audio

test('click the first play/pause button', async ({ page }) => {
  await page.goto('./demo/index-test.html');

  // Select the audio tag by its selector
  const audioTag = await page.locator('//*[@id="blueMondayPlayerContainer1"]/div[1]/audio');
  const playPauseBtn = await page.getByRole('button', { name: 'play' }).nth(0);

  // it should be paused at first
  const isPlaying1 = await audioTag.evaluate((node) => !(node as HTMLMediaElement).paused);
  await expect(isPlaying1).toBeFalsy();

  // Click the first play/pause button.
  await playPauseBtn.click();

  // Check if the audio is playing using `evaluate`
  const isPlaying2 = await audioTag.evaluate((node) => !(node as HTMLMediaElement).paused);
  // Expects the audio file is playing
  await expect(isPlaying2).toBeTruthy();

  await playPauseBtn.click();
  // it should be paused after the pause button clicked
  const isPlaying3 = await audioTag.evaluate((node) => !(node as HTMLMediaElement).paused);
  await expect(isPlaying3).toBeFalsy();
});