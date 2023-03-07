import { isFullScreenEnabled } from '../../core/utils';
import type { CSSSelector, YuanPlayerOptions } from '../../core/player.d';
// @ts-ignore
import playerTpl from './player.ejs';
import './player.scss';

/**
 * The higher-order function receives YuanPlayerUI class as the argument
 * and returns a new class which supports GUI.
 * @param Base - YuanPlayerUI class
 * @returns - A new class
 */
function getClass(Base) {
  return class YuanPlayer extends Base {
    constructor(options: YuanPlayerOptions) {
      options.useStateClassSkin = true;
      super(options);
      if (!this.nativeControls) {
        this.renderPlayerUI();
        this.addEvents();
      }
    }
  
    renderPlayerUI() {
      const div = document.createElement('div');
      if (this.cssSelectorAncestor) {
        const substr = this.cssSelectorAncestor.substring(1);
        if (this.cssSelectorAncestor.indexOf('#') === 0) {
          div.id = substr;
        } else {
          div.classList.add(substr);
        }
      }
      div.classList.add('yuanplayer-bluemonday-player');
      div.innerHTML = playerTpl();
      this.container.appendChild(div);

      // If current browser support flex wrapping, use flexbox layout
      // Some old browsers does not support this feature, such as Android 4.2 default browsers
      if (document.createElement("p").style.flexWrap === '') {
        div.querySelector('.yuan-interface')?.classList.add('flexbox');
      }
    }
    addEvents() {
      this.on('setmedia', () => {
        const fullScreenBtn = this.container?.querySelector(this.cssSelector.fullScreen);
        if (!fullScreenBtn || !isFullScreenEnabled()) return;
        if (this.mediaElement?.tagName.toLowerCase() === 'video') {
          fullScreenBtn.classList.remove('hidden');
        } else {
          fullScreenBtn.classList.add('hidden');
        }
      });
    }
  }
}

export default getClass;