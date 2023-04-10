import { test, expect } from '@playwright/test';
import AudioList from '../tests/audio-list.js';

const testURL = './tests/index.html';

// Theme: BlueMonday - audio

test('BlueMonday-audio: click the first play/pause button', async ({ page }) => {
  await page.goto(testURL);

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

// Theme: BlueMonday - audio
test('BlueMonday-audio: click the next button', async ({ page }) => {
  await page.goto(testURL);

  // Select the audio tag by its selector
  const mediaTag = await page.locator('//*[@id="blueMondayPlayerContainer1"]/div[1]/audio');
  const nextBtn = await page.getByRole('button', { name: 'next' }).nth(0);

  // it should be paused at first
  const isPlaying1 = await mediaTag.evaluate((node) => !(node as HTMLMediaElement).paused);
  await expect(isPlaying1).toBeFalsy();
  let mediaSrc = await mediaTag.evaluate((node) => (node as HTMLMediaElement).currentSrc);
  await expect(mediaSrc).toBe(AudioList[0].src);

  // Click the next button.
  await nextBtn.click();

  // Check if the video is playing using `evaluate`
  const isPlaying2 = await mediaTag.evaluate((node) => !(node as HTMLMediaElement).paused);
  // Expects the video file is playing
  await expect(isPlaying2).toBeTruthy();

  const mediaSrc1 = await mediaTag.evaluate((node) => (node as HTMLMediaElement).currentSrc);
  await expect(mediaSrc1).toBe(AudioList[1].src);
});

test('BlueMonday-audio: the controls container should always be visible',async ({ page }) => {
  await page.goto(testURL);

  // Select the audio tag by its selector
  const mediaTag = await page.locator('//*[@id="blueMondayPlayerContainer1"]/div[1]/audio');
  const playPauseBtn = await page.getByRole('button', { name: 'play' }).nth(0);
  const currentTimeDiv = await page.locator('#blueMondayPlayerContainer1 .yuan-current-time');
  const controlsContainer = await page.locator('#blueMondayPlayerContainer1 audio+div');

  await expect(controlsContainer).toBeVisible();
  await playPauseBtn.click();
  await currentTimeDiv.click();

  // wait for 3 second
  await page.waitForTimeout(3000);
  await expect(controlsContainer).toBeVisible();
});