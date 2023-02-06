export interface CSSSelector {
  duration: string
  durationTime: string
  currentTime: string
}

export type PlayerControls = "system" | "default" | boolean;

export interface YuanPlayerOptions {
  controls: PlayerControls
  container: string | HTMLElement
  cssSelector?: CSSSelector
}