import { test, expect } from '@playwright/test';
import videoList from '../tests/video-list.js';

const testURL = './tests/index.html';

// Theme: BlueMonday - video
test('BlueMonday-video: click the second play/pause button', async ({ page }) => {
  await page.goto(testURL);

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
  await page.goto(testURL);

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
  await page.goto(testURL);

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
  await page.goto(testURL);

  // Select the video tag by its selector
  const mediaTag = await page.locator('//*[@id="blueMondayPlayerContainer2"]/div[1]/video');
  //const nextBtn = await page.locator('//*[@id="yuan_container_b4545927-2009-42ab-bc31-769a2d12e526"]/div/div[1]/div[2]/div[2]/div');
  const volumeBar = await page.waitForSelector('#blueMondayPlayerContainer2 .yuan-volume-bar');

  let volume = await mediaTag.evaluate((node) => (node as HTMLMediaElement).volume);
  const volumeWidth = await volumeBar.evaluate((node) => (node as HTMLElement).clientWidth);
  await expect(volume).toBe(1);

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
  await page.goto(testURL);

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

test('BlueMonday-video: click the volume max button', async ({ page }) => {
  await page.goto(testURL);

  // Select the video tag by its selector
  const mediaTag = await page.locator('//*[@id="blueMondayPlayerContainer2"]/div[1]/video');
  const maxBtn = await page.waitForSelector('#blueMondayPlayerContainer2 .yuan-volume-max');

  let volume = await mediaTag.evaluate((node) => (node as HTMLMediaElement).volume);
  await expect(volume).toBe(1);
  const muted = await mediaTag.evaluate((node) => (node as HTMLMediaElement).muted);
  await expect(muted).toBeFalsy();

  // Click the button.
  await maxBtn.click();

  volume = await mediaTag.evaluate((node) => (node as HTMLMediaElement).volume);
  await expect(volume).toBe(1);

  const volumeBar = await page.waitForSelector('#blueMondayPlayerContainer2 .yuan-volume-bar');
  const volumeWidth = await volumeBar.evaluate((node) => (node as HTMLElement).clientWidth);
  await volumeBar.click({
    position: {
      x: volumeWidth / 2,
      y: 1
    }
  });
  volume = await mediaTag.evaluate((node) => (node as HTMLMediaElement).volume);
  await expect(volume).not.toBe(1);

  await maxBtn.click();
  volume = await mediaTag.evaluate((node) => (node as HTMLMediaElement).volume);
  await expect(volume).toBe(1);
});

test('BlueMonday-video: click the repeat button once', async ({ page }) => {
  await page.goto(testURL);

  // Select the video tag by its selector
  const mediaTag = await page.locator('//*[@id="blueMondayPlayerContainer2"]/div[1]/video');
  const repeatBtn = await page.waitForSelector('#blueMondayPlayerContainer2 .yuan-repeat');

  // Click the button.
  await repeatBtn.click();

  const hasRepeatOneClass = await repeatBtn.evaluate((node) => (node as HTMLElement).classList.contains('yuan-repeat-one'));
  const mediaSrc = await mediaTag.evaluate((node) => (node as HTMLMediaElement).currentSrc);
  await expect(mediaSrc).toBe(videoList[0].src[0]);
  await expect(hasRepeatOneClass).toBeTruthy();
  
  await mediaTag.dispatchEvent('ended');
  await expect(await mediaTag.evaluate((node) => (node as HTMLMediaElement).currentSrc)).toBe(videoList[0].src[0]);
  await expect(await repeatBtn.evaluate((node) => (node as HTMLElement).classList.contains('yuan-repeat-one'))).toBeTruthy();
});

test('BlueMonday-video: click the repeat button 2 times', async ({ page }) => {
  await page.goto(testURL);

  // Select the video tag by its selector
  const mediaTag = await page.locator('//*[@id="blueMondayPlayerContainer2"]/div[1]/video');
  const repeatBtn = await page.waitForSelector('#blueMondayPlayerContainer2 .yuan-repeat');

  //const lastRemoveBtn = await page.waitForSelector('#blueMondayPlayerContainer2 .yuan-playlist-item:nth-child(5)');
  //await lastRemoveBtn.click();
  const lastItem = await page.waitForSelector('#blueMondayPlayerContainer2 .yuan-playlist-item:nth-child(5)');

  // Click the button.
  await repeatBtn.click();
  await repeatBtn.click();

  const hasRepeatOneClass = await repeatBtn.evaluate((node) => (node as HTMLElement).classList.contains('yuan-repeat-one'));
  const mediaSrc = await mediaTag.evaluate((node) => (node as HTMLMediaElement).currentSrc);
  await expect(mediaSrc).toBe(videoList[0].src[0]);
  await expect(hasRepeatOneClass).toBeFalsy();

  await lastItem.click();
  await mediaTag.dispatchEvent('ended');
  await expect(await mediaTag.evaluate((node) => (node as HTMLMediaElement).currentSrc)).toBe(videoList[0].src[0]);
});

test('BlueMonday-video: click the repeat button 3 times', async ({ page }) => {
  await page.goto(testURL);

  // Select the video tag by its selector
  const mediaTag = await page.locator('//*[@id="blueMondayPlayerContainer2"]/div[1]/video');
  const repeatBtn = await page.waitForSelector('#blueMondayPlayerContainer2 .yuan-repeat');

  const lastItem = await page.waitForSelector('#blueMondayPlayerContainer2 .yuan-playlist-item:nth-child(5)');

  // Click the button.
  await repeatBtn.click();
  await repeatBtn.click();
  await repeatBtn.click();

  const hasRepeatOneClass = await repeatBtn.evaluate((node) => (node as HTMLElement).classList.contains('yuan-repeat-one'));
  const mediaSrc = await mediaTag.evaluate((node) => (node as HTMLMediaElement).currentSrc);
  await expect(mediaSrc).toBe(videoList[0].src[0]);
  await expect(hasRepeatOneClass).toBeFalsy();

  await lastItem.click();
  await expect(await mediaTag.evaluate((node) => (node as HTMLMediaElement).currentSrc)).toBe(videoList[4].src[0]);
  await mediaTag.dispatchEvent('ended');
  await expect(await mediaTag.evaluate((node) => (node as HTMLMediaElement).currentSrc)).toBe(videoList[4].src[0]);
});

test('BlueMonday-video: click the shuffle button', async ({ page }) => {
  await page.goto(testURL);

  // Select the video tag by its selector
  const mediaTag = await page.locator('//*[@id="blueMondayPlayerContainer2"]/div[1]/video');
  const shuffleBtn = await page.waitForSelector('#blueMondayPlayerContainer2 .yuan-shuffle');
  const listItems = await page.locator('#blueMondayPlayerContainer2 .yuan-playlist-item');

  await expect(shuffleBtn).toBeTruthy();
  await expect(listItems).toHaveCount(5);
  await expect(await listItems.nth(0)).toContainText(videoList[0].title);
  await shuffleBtn.click();
  await shuffleBtn.click();
  await expect(await listItems.nth(0)).toContainText(videoList[0].title);
});

test('BlueMonday-video: click the fullscreen button', async ({ page }) => {
  await page.goto(testURL);

  // Select the video tag by its selector
  const mediaTag = await page.locator('//*[@id="blueMondayPlayerContainer2"]/div[1]/video');
  const fullscreenBtn = await page.waitForSelector('#blueMondayPlayerContainer2 .yuan-full-screen');
  
  const outerHTML = await fullscreenBtn.evaluate((node) => node.outerHTML);
  console.log('fullscreenBtn:', outerHTML)
  const isBtnVisible = await (await page.waitForSelector('#blueMondayPlayerContainer2 .yuan-full-screen')).isVisible();
  const listItems = await page.locator('#blueMondayPlayerContainer2 .yuanplayer-bluemonday-playlist');

  await expect(fullscreenBtn).toBeTruthy();
  await expect(listItems).toBeVisible();
  expect(isBtnVisible).toBeTruthy();
  /* Fullscreen API is not supported by Playwright now, it may works on some browsers though*/
  /*
  if (isBtnVisible) {
    await fullscreenBtn.click();
    await expect(listItems).toBeHidden();

    await fullscreenBtn.click();
    await expect(listItems).toBeVisible();
  }
  */
});

test('BlueMonday-video: click the second track', async ({ page }) => {
  await page.goto(testURL);

  // Select the video tag by its selector
  const mediaTag = await page.locator('//*[@id="blueMondayPlayerContainer2"]/div[1]/video');
  const secondItem = await page.waitForSelector('#blueMondayPlayerContainer2 .yuan-playlist-item:nth-child(2)');

  let videoSrc = await mediaTag.evaluate((node) => (node as HTMLMediaElement).currentSrc);
  await expect(videoSrc).toBe(videoList[0].src[0]);

  await secondItem.click();

  videoSrc = await mediaTag.evaluate((node) => (node as HTMLMediaElement).currentSrc);
  await expect(videoSrc).toBe(videoList[1].src[0]);
});

test('BlueMonday-video: click the remove button', async ({ page }) => {
  await page.goto(testURL);

  // Select the video tag by its selector
  const mediaTag = await page.locator('//*[@id="blueMondayPlayerContainer2"]/div[1]/video');
  const firstRemoveBtn = await page.waitForSelector('#blueMondayPlayerContainer2 .yuan-playlist-item:nth-child(1) .yuan-playlist-item-remove');

  let videoSrc = await mediaTag.evaluate((node) => (node as HTMLMediaElement).currentSrc);
  await expect(videoSrc).toBe(videoList[0].src[0]);

  await firstRemoveBtn.click();

  videoSrc = await mediaTag.evaluate((node) => (node as HTMLMediaElement).currentSrc);
  await expect(videoSrc).toBe(videoList[1].src[0]);
});