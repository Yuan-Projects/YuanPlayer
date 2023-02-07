export interface PlayListItem {
  id?: string | number
  title?: string
  artist?: string
  imgUrl?: string
  source: Array<any>
  lyric: string
}

export interface PlayListOptions {
  container: HTMLElement
  //mediaObject: Object
  player: any
  lyricObj?: any
  loop: 'none' | 'single' | 'random' | 'order'
  list: Array<PlayListItem>
}