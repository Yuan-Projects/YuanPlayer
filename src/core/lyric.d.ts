export interface LyricOptions {
  theme: string
  lyric: string
  mediaObject: Object,
  container: HTMLElement
}

export interface LyricObject {
  timeArray: Array<any>;
  lyricArray: Array<any>;
}