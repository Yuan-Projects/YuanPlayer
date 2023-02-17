export interface PlayListItem {
  id?: string | number
  title?: string
  artist?: string
  imgUrl?: string
  source: Array<any>
  lyric?: string
}

export interface CSSSelector {
  remove?: string
  next?: string
  previous?: string
  shuffle?: string
  item?: string
}

export interface PlayListOptions {
  container: HTMLElement
  player: any
  lyricObj?: any
  loop?: 'off' | 'one' | 'all'
  list: Array<PlayListItem>
  autoPlay?: boolean
  enableRemoveControls?: boolean
  cssSelector?: CSSSelector
}