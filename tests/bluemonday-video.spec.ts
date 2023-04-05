import { test, expect } from '@playwright/test';
import videoList from '../demo/video-list.js';

// Theme: BlueMonday - video
test('BlueMonday-video: click the second play/pause button', async ({ page }) => {
  await page.goto('./demo/index-test.html');

  // Select the video tag by its selector
  const mediaTag = await page.locator('//*[@id="blueMondayPlayerContainer2"]/div[1]/video');
  const playPauseBtn = await page.getByRole('button', { name: 'play' }).nth(1);

  // it should be paused at first
  const isPlaying1 = await mediaTag.evaluate((node) => !(node as HTMLMediaElement).paused);
  await expect(isPlaying1).toBeFalsy();

  // Click the first play/pause button.
  await playPauseBtn.click();

  // Check if the video is playing using `evaluate`
  const isPlaying2 = await mediaTag.evaluate((node) => !(node as HTMLMediaElement).paused);
  // Expects the video file is playing
  await expect(isPlaying2).toBeTruthy();

  await playPauseBtn.click();
  // it should be paused after the pause button clicked
  const isPlaying3 = await mediaTag.evaluate((node) => !(node as HTMLMediaElement).paused);
  await expect(isPlaying3).toBeFalsy();
});

// Theme: BlueMonday - video
test('BlueMonday-video: click the next button', async ({ page }) => {
  await page.goto('./demo/index-test.html');

  // Select the video tag by its selector
  const mediaTag = await page.locator('//*[@id="blueMondayPlayerContainer2"]/div[1]/video');
  const nextBtn = await page.getByRole('button', { name: 'next' }).nth(1);

  // it should be paused at first
  const isPlaying1 = await mediaTag.evaluate((node) => !(node as HTMLMediaElement).paused);
  await expect(isPlaying1).toBeFalsy();
  let videoSrc = await mediaTag.evaluate((node) => (node as HTMLMediaElement).currentSrc);
  await expect(videoSrc).toBe(videoList[0].src[0]);

  // Click the next button.
  await nextBtn.click();

  // Check if the video is playing using `evaluate`
  const isPlaying2 = await mediaTag.evaluate((node) => !(node as HTMLMediaElement).paused);
  // Expects the video file is playing
  await expect(isPlaying2).toBeTruthy();

  const videoSrc1 = await mediaTag.evaluate((node) => (node as HTMLMediaElement).currentSrc);
  await expect(videoSrc1).toBe(videoList[1].src[0]);
/*

  const isPlaying3 = await mediaTag.evaluate((node) => !(node as HTMLMediaElement).paused);
  await expect(isPlaying3).toBeTruthy();

  await nextBtn.click();
  // it should be paused after the pause button clicked
  const isPlaying4 = await mediaTag.evaluate((node) => !(node as HTMLMediaElement).paused);
  await expect(isPlaying4).toBeFalsy();
  */
});