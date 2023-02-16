export interface CSSSelector {
  duration: string
  durationTime: string
  currentTime: string
}

export interface MediaItem {
  poster?: string
  title?: string
  duration?: string | number
  track?: Array<object>
  src: string | Array<string>
}

export interface YuanPlayerOptions {
  nativeControls?: boolean
  container: string | HTMLElement
  media: MediaItem
  cssSelector?: CSSSelector
}