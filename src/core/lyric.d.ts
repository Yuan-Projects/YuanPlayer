export interface LyricOptions {
  lyric: string
  mediaElement: object
  container: HTMLElement
  cssSelector?: object
  cssSelectorAncestor: string
  player: object
}

export interface LyricObject {
  timeArray: Array<any>;
  lyricArray: Array<any>;
}