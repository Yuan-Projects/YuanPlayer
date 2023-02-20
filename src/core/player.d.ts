export interface CSSSelector {
  videoPlay?: string
  play?: string
  pause?: string
  stop?: string
  seekBar?: string
  playBar?: string
  mute?: string
  unmute?: string
  volumeBar?: string
  volumeBarValue?: string
  volumeMax?: string
  volumeValue?: string
  playbackRateBar?: string
  playbackRateBarValue?: string
  currentTime?: string
  duration?: string
  title?: string
  fullScreen?: string
  restoreScreen?: string
  repeat?: string
  repeatOff?: string
  gui?: string
  noSolution?: string
  shuffle?: string
}

export interface PlayerStateClass{
  playing?: string
  seeking?: string
  muted?: string
  looped?: string
  fullScreen?: string
  noVolume?: string
}

export interface MediaItem {
  poster?: string
  title?: string
  duration?: string | number
  track?: Array<object>
  src: string | Array<string>
}

export interface YuanPlayerOptions {
  useStateClassSkin?: boolean
  nativeControls?: boolean
  container: string | HTMLElement
  media: MediaItem
  cssSelectorAncestor?: string
  cssSelector?: CSSSelector
  stateClass?: PlayerStateClass
}