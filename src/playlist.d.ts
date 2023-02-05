export interface PlayListItem {
  id?: string | number
  title?: string
  artist?: string
  source: Array<any>
  lyric: string
}

export interface PlayListBaseOptions {
  container: HTMLElement
  //mediaObject: Object
  player: any
  loop: 'none' | 'single' | 'random' | 'order'
  list: Array<PlayListItem>
}