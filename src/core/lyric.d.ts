export interface LyricOptions {
  lyric: string
  mediaElement: object,
  container: HTMLElement
  cssSelector?: object
  cssSelectorAncestor: string
}

export interface LyricObject {
  timeArray: Array<any>;
  lyricArray: Array<any>;
}