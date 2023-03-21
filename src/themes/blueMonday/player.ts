import type { YuanPlayerOptions } from '../../core/player.d';
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
      options.stateClass = {
        seeking: 'yuan-seeking-bg'
      };
      super(options);
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
      div.innerHTML = playerTpl();
      this.container.appendChild(div);

      // If current browser support flex wrapping, use flexbox layout
      // Some old browsers does not support this feature, such as Android 4.2 default browsers
      if (document.createElement("p").style.flexWrap === '') {
        div.querySelector('.yuan-interface')?.classList.add('flexbox');
      }

      const cclist = div.querySelector('.cclist') as HTMLDivElement;
      const ccbtn = div.querySelector('.yuan-closed-caption') as HTMLElement;
      cclist.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        if (target.tagName !== 'INPUT') return false;
        const value = (target as HTMLInputElement).value;
        this.setActiveCC(value);
        cclist.innerHTML = '';
        this.updateCCButton();
      });

      ccbtn.addEventListener('click', () => {
        this.showList();
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