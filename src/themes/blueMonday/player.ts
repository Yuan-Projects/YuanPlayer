import type { CSSSelector, YuanPlayerOptions } from '../../core/player.d';
// @ts-ignore
import playerTpl from './player.ejs';
import './player.scss';

function getClass(Base) {
  return class YuanPlayer extends Base {
    constructor(options: YuanPlayerOptions) {
      options.useStateClassSkin = true;
      super(options);
      if (!this.nativeControls) {
        this.renderPlayerUI();
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
    }
  }
}

export default getClass;