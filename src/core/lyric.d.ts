export interface LyricOptions {
  lyric: string
  mediaObject: object,
  container: HTMLElement
  cssSelector?: object
  cssSelectorAncestor: string
}

export interface LyricObject {
  timeArray: Array<any>;
  lyricArray: Array<any>;
}