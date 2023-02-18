import { PlayListOptions } from "../../core/playlist.d";
// @ts-ignore
import itemTpl from './playlistItem.ejs';
import './playlist.scss';

function getClass(Base) {
  return class YuanPlayerPlayList extends Base {
    constructor(options: PlayListOptions) {
      options.cssSelector = {
        ...options.cssSelector,
        item: '.music-item-container',
        shuffle: '.yuanplayer-yuan-shuffle',
      };
      options.stateClass = {
        ...options.stateClass,
        currentItem: 'active',
      };
      super(options);

      this.renderUI();
      this.on('modechange', this.renderModeIcon.bind(this));
      this.on('shuffledchanged', () => {
        this.renderShuffleIcon();
        this.container.querySelector('.yuanplayer-yuan-playlist').innerHTML = this.list.map(item => itemTpl({ track: item })).join('');
      })
    }
    renderUI() {
      const container = this.container;

      const playlistContainer = document.createElement('div');
      playlistContainer.classList.add('yuanplay-playlist-container')
  
      const itemList = document.createElement('div');
      itemList.classList.add('yuanplayer-yuan-playlist');
      itemList.innerHTML = this.list.map(item => itemTpl({ track: item })).join('');
      playlistContainer.appendChild(itemList);

      const opContainer = document.createElement('div');
      opContainer.classList.add('operation-container');
      const previousButton = document.createElement('span');
      previousButton.textContent ='skip_previous';
      previousButton.classList.add('material-symbols-outlined');
      opContainer.appendChild(previousButton);

      previousButton.addEventListener('click', () => {
        this.previous();
      });
      const nextButton = document.createElement('span');
      nextButton.textContent ='skip_next';
      nextButton.classList.add('material-symbols-outlined');
      nextButton.addEventListener('click', () => {
        this.next();
      });
      opContainer.appendChild(nextButton);

      const modeContainer = document.createElement('span');
      modeContainer.classList.add('yuanplayer-mode-container');
      modeContainer.classList.add('material-symbols-outlined');
      opContainer.appendChild(modeContainer);
  
      modeContainer.addEventListener('click', () => {
        this.switchModes();
      });

      const shuffleButton = document.createElement('span');
      shuffleButton.textContent = 'shuffle';
      shuffleButton.classList.add('material-symbols-outlined');
      shuffleButton.classList.add('yuanplayer-yuan-shuffle');
      opContainer.appendChild(shuffleButton);
  
      shuffleButton.addEventListener('click', () => {
        //this.switchModes();// todo
      })

      playlistContainer.appendChild(opContainer);
  
      container.appendChild(playlistContainer);
      this.updateHighlight();

      this.renderModeIcon();
    }

    renderModeIcon() {
      const element = this.container.querySelector('.yuanplayer-mode-container');
      if (!element) return;
      let text = '';
      // 'off' | 'one' | 'all'
      switch(Base.modes[this.modeIndex]) {
        case 'one':
          text = 'repeat_one_on';
          break;
        case 'all':
          text = 'repeat_on';
          break;
        case 'off':
        default:
          text = 'repeat';
          break;
      }
      element.textContent = text;
    }
    renderShuffleIcon() {
      const element = this.container.querySelector('.yuanplayer-yuan-shuffle');
      if (!element) return;
      let text = 'shuffle';
      if (this.shuffled) {
        text = 'shuffle_on';
      }
      element.textContent = text;
    }
  
    updateHighlight() {
      const playlistCOntainer = this.container.querySelector('.yuanplay-playlist-container');
      if (!playlistCOntainer) return ;
      playlistCOntainer.querySelector('.active')?.classList.remove('active');
      playlistCOntainer.querySelectorAll('.music-item-container')[this.index].classList.add('active');
    }
  }
}

export default getClass;