export interface CSSSelector {
  duration: string
  durationTime: string
  currentTime: string
}

export interface YuanPlayerOptions {
  useNativeControl: boolean
  container: string | HTMLElement
  cssSelector?: CSSSelector
}