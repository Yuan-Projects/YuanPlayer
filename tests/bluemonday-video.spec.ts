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
});

test('BlueMonday-video: click the previous button', async ({ page }) => {
  await page.goto('./demo/index-test.html');

  // Select the video tag by its selector
  const mediaTag = await page.locator('//*[@id="blueMondayPlayerContainer2"]/div[1]/video');
  const nextBtn = await page.getByRole('button', { name: 'next' }).nth(1);
  const previousBtn = await page.getByRole('button', { name: 'previous' }).nth(1);

  // it should be paused at first
  const isPlaying1 = await mediaTag.evaluate((node) => !(node as HTMLMediaElement).paused);
  await expect(isPlaying1).toBeFalsy();
  let videoSrc = await mediaTag.evaluate((node) => (node as HTMLMediaElement).currentSrc);
  await expect(videoSrc).toBe(videoList[0].src[0]);

  // Click the next button.
  await nextBtn.click();
  videoSrc = await mediaTag.evaluate((node) => (node as HTMLMediaElement).currentSrc);
  await expect(videoSrc).toBe(videoList[1].src[0]);

  await previousBtn.click();
  videoSrc = await mediaTag.evaluate((node) => (node as HTMLMediaElement).currentSrc);
  await expect(videoSrc).toBe(videoList[0].src[0]);

  // Check if the video is playing using `evaluate`
  const isPlaying2 = await mediaTag.evaluate((node) => !(node as HTMLMediaElement).paused);
  // Expects the video file is playing
  await expect(isPlaying2).toBeTruthy();
});

test('BlueMonday-video: click the volume bar', async ({ page }) => {
  await page.goto('./demo/index-test.html');

  // Select the video tag by its selector
  const mediaTag = await page.locator('//*[@id="blueMondayPlayerContainer2"]/div[1]/video');
  //const nextBtn = await page.locator('//*[@id="yuan_container_b4545927-2009-42ab-bc31-769a2d12e526"]/div/div[1]/div[2]/div[2]/div');
  const volumeBar = await page.waitForSelector('#blueMondayPlayerContainer2 .yuan-volume-bar');

  let volume = await mediaTag.evaluate((node) => (node as HTMLMediaElement).volume);
  const volumeWidth = await volumeBar.evaluate((node) => (node as HTMLElement).clientWidth);
  await expect(volume).toBe(1);

  // Click the next button.
  await volumeBar.click({
    position: {
      x: volumeWidth / 2,
      y: 1
    }
  });
  volume = await mediaTag.evaluate((node) => (node as HTMLMediaElement).volume);
  //await expect(volume).toBeCloseTo(0.5);
  await expect(Math.abs(volume - 0.5) <= 0.1).toBeTruthy();
});

test('BlueMonday-video: click the mute button', async ({ page }) => {
  await page.goto('./demo/index-test.html');

  // Select the video tag by its selector
  const mediaTag = await page.locator('//*[@id="blueMondayPlayerContainer2"]/div[1]/video');
  const muteBtn = await page.waitForSelector('#blueMondayPlayerContainer2 .yuan-mute');

  // Click the mute button.
  await muteBtn.click();

  let volume = await mediaTag.evaluate((node) => (node as HTMLMediaElement).volume);
  await expect(volume).toBe(1);
  const muted = await mediaTag.evaluate((node) => (node as HTMLMediaElement).muted);
  await expect(muted).toBeTruthy();
});