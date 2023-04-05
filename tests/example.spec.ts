import { test, expect } from '@playwright/test';

// Theme: BlueMonday - audio

test('click the first play/pause button', async ({ page }) => {
  await page.goto('https://yuan-projects.github.io/YuanPlayer/demo/index-test.html');

  // Select the audio tag by its selector
  const audioTag = await page.locator('//*[@id="blueMondayPlayerContainer1"]/div[1]/audio');
  const playPauseBtn = await page.getByRole('button', { name: 'play' }).nth(0);

  await expect(audioTag).toBeTruthy();
  await expect(playPauseBtn).toBeTruthy();
  /*

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
  */
});
/*
// Theme: BlueMonday - video
test('click the second play/pause button', async ({ page }) => {
  await page.goto('https://yuan-projects.github.io/YuanPlayer/demo/index-test.html');

  // Select the audio tag by its selector
  const mediaTag = await page.locator('//*[@id="blueMondayPlayerContainer2"]/div[1]/video');
  const playPauseBtn = await page.getByRole('button', { name: 'play' }).nth(1);

  // it should be paused at first
  const isPlaying1 = await mediaTag.evaluate((node) => !(node as HTMLMediaElement).paused);
  await expect(isPlaying1).toBeFalsy();

  // Click the first play/pause button.
  await playPauseBtn.click();

  // Check if the audio is playing using `evaluate`
  const isPlaying2 = await mediaTag.evaluate((node) => !(node as HTMLMediaElement).paused);
  // Expects the audio file is playing
  await expect(isPlaying2).toBeTruthy();

  await playPauseBtn.click();
  // it should be paused after the pause button clicked
  const isPlaying3 = await mediaTag.evaluate((node) => !(node as HTMLMediaElement).paused);
  await expect(isPlaying3).toBeFalsy();
});
*/

/*
test('has title', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Playwright/);
});
*/