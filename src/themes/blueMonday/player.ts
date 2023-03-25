import type { YuanPlayerOptions } from '../../core/player.d';
// @ts-ignore
import playerTpl from './player.ejs';
// @ts-ignore
import playerVideoTpl from './player-video.ejs';
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
      options.stateClass = {
        seeking: 'yuan-seeking-bg'
      };
      super(options);
      this.on('setmedia', this.updateGUI);
    }

    private updateGUI = () => {
      if (!this.mediaElement) return false;
      const mediaType = this.mediaElement.tagName.toLowerCase();
      const div = this.container.querySelector(this.cssSelectorAncestor);
      const con = div.querySelector(`.yuan-${mediaType}`);
      if (con) return;
      div.innerHTML = this.mediaElement.tagName === 'AUDIO' ? playerTpl() : playerVideoTpl();
      this.updateVolume();
      this.updateFullScreenButton();
      // If current browser support flex wrapping, use flexbox layout
      // Some old browsers does not support this feature, such as Android 4.2 default browsers
      if (document.createElement("p").style.flexWrap === '') {
        div.querySelector('.yuan-interface')?.classList.add('flexbox');
      }
    }
  
    protected onReady() {
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
      div.innerHTML = this.mediaElement.tagName === 'AUDIO' ? playerTpl() : playerVideoTpl();
      //this.container.appendChild(div);
      this.mediaElement.parentNode.appendChild(div);
      this.mediaElement.parentNode.style.position = 'relative';
      this.mediaElement.parentNode.style.minHeight = '78px';

      // If current browser support flex wrapping, use flexbox layout
      // Some old browsers does not support this feature, such as Android 4.2 default browsers
      if (document.createElement("p").style.flexWrap === '') {
        div.querySelector('.yuan-interface')?.classList.add('flexbox');
      }

      this.addEventListener(div, 'click', (e) => {
        const div = this.container.querySelector(this.cssSelectorAncestor);
        const target = e.target as HTMLElement;
        if (target.tagName === 'INPUT') {
          const value = (target as HTMLInputElement).value;
          this.setActiveCC(value);
          const cclist = div.querySelector('.cclist') as HTMLDivElement;
          cclist.innerHTML = '';
          this.updateCCButton();
        } else if (this.isMatchedWithSelector(target, '.yuan-closed-caption')) {
          this.showList();
        }
      });
    }
    showList() {
      var list = this.getCCList();
      var ul = document.createElement('ul');
      list.forEach(function(item) {
        var li = document.createElement('li');
        var label = document.createElement('label');
        label.textContent = item.label;
        var radio = document.createElement('input');
        radio.type = 'radio';
        radio.name = 'cc';
        radio.value = item.label;
        radio.checked = item.checked;
        label.appendChild(radio);
        li.appendChild(label);
        ul.appendChild(li);
      });
      const cclist = this.container.querySelector('.cclist') as HTMLDivElement;
      cclist.innerHTML = "";
      cclist.appendChild(ul);
    }
  }
}

export default getClass;