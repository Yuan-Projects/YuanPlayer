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
      options.playbackRates = [0.5, 1.0, 2];
      options.cssSelector = {
        closedCaptionList: '.cclist',
        qualityList: '.qltlist',
        playrateList: ".speedlist"
      }
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
      if (!con) {
        div.innerHTML = this.mediaElement.tagName === 'AUDIO' ? playerTpl() : playerVideoTpl();
        this.updateVolume();
        this.updateFullScreenButton();
        // If current browser support flex wrapping, use flexbox layout
        // Some old browsers does not support this feature, such as Android 4.2 default browsers
        if (document.createElement("p").style.flexWrap === '') {
          div.querySelector('.yuan-interface')?.classList.add('flexbox');
        }
      }

      // clear closed caption list
      const cclist = div.querySelector('.cclist') as HTMLDivElement;
      cclist.innerHTML = '';
      // clear quality list
      const qltlist = div.querySelector('.qltlist') as HTMLDivElement;
      qltlist.innerHTML = '';
      const speedlist = div.querySelector('.speedlist') as HTMLDivElement;
      speedlist.innerHTML = '';
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

      // If current browser support flex wrapping, use flexbox layout
      // Some old browsers does not support this feature, such as Android 4.2 default browsers
      if (document.createElement("p").style.flexWrap === '') {
        div.querySelector('.yuan-interface')?.classList.add('flexbox');
      }

      this.addEventListener(div, 'click', (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        const ccDomList = target.querySelectorAll('input[name="cc"]');
        const qltyDomList = target.querySelectorAll('input[name="quality"]');
        const rateDomList = target.querySelectorAll('input[name="speed"]');
        if (ccDomList.length === 1) {
          const value = (ccDomList[0] as HTMLInputElement).value;
          this.setActiveCC(value);
          this.updateCCButton();
        } else if (qltyDomList.length === 1) {
          const value = (qltyDomList[0] as HTMLInputElement).value;
          this.setHLSQuality(Number(value));
          this.updateQualityButton();
        } else if (rateDomList.length === 1) {
          const value = (rateDomList[0] as HTMLInputElement).value;
          this.setPlaybackRate(Number(value));
          this.updatePlaybackRateButton();
        }
      });
    }
    onShowClosedCaptionList() {
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
    onShowQualityList() {
      var list = this.getQualityList();
      var ul = document.createElement('ul');
      list.forEach(function(item, index) {
        var li = document.createElement('li');
        var label = document.createElement('label');
        label.textContent = item.label;
        var radio = document.createElement('input');
        radio.type = 'radio';
        radio.name = 'quality';
        radio.value = index;
        radio.checked = item.checked;
        label.appendChild(radio);
        li.appendChild(label);
        ul.appendChild(li);
      });
      const qltlist = this.container.querySelector('.qltlist') as HTMLDivElement;
      qltlist.innerHTML = "";
      qltlist.appendChild(ul);
      this.showGUIControls();
    }
    onShowPlayrateList() {
      var list = this.getPlayrateList();
      var ul = document.createElement('ul');
      list.forEach((item) => {
        var li = document.createElement('li');
        var label = document.createElement('label');
        label.textContent = item == 1 ? 'Normal' : item;
        var radio = document.createElement('input');
        radio.type = 'radio';
        radio.name = 'speed';
        radio.value = item;
        radio.checked = item === this.mediaElement.playbackRate;
        label.appendChild(radio);
        li.appendChild(label);
        ul.appendChild(li);
      });
      const speedlist = this.container.querySelector('.speedlist') as HTMLDivElement;
      speedlist.innerHTML = "";
      speedlist.appendChild(ul);
      this.showGUIControls();
    }
  }
}

export default getClass;