import { PlayListBaseOptions } from "./playlist.d";
import PlayListBase from "./playlist-base";
import './playlist.scss';

export default class YuanPlayerPlayList extends PlayListBase {
  constructor(options: PlayListBaseOptions) {
    super(options);

    this.on('playMusicAtIndex', (index) => {
      this.playAtIndex(index);
      this.updateHighlight();
    });
    this.renderUI();
    this.on('modeChanged', this.renderModeIcon.bind(this));
  }
  renderUI() {
    const container = this.container;

    const playlistContainer = document.createElement('div');
    playlistContainer.classList.add('yuanplay-playlist-container')

    const itemList = document.createElement('div');
    this.list.forEach((item, index) => {
      const div = document.createElement('div');
      div.classList.add('music-item-container')
      if (item.imgUrl) {
        const imgEle = document.createElement('img');
        imgEle.classList.add('imgurl')
        imgEle.src = item.imgUrl;
        div.appendChild(imgEle);
      }
      const titleEle = document.createElement('span');
      titleEle.textContent = item.title;
      div.appendChild(titleEle);

      if (item.artist) {
        const artistEle = document.createTextNode(item.artist);
        artistEle.textContent = item.artist;
        div.appendChild(artistEle);
      }

      itemList.appendChild(div);

      div.addEventListener('click', () => {
        this.index = index;
        this.playAtIndex(index);
        this.updateHighlight();
      });
    });
    playlistContainer.appendChild(itemList);

    const opContainer = document.createElement('div');
    opContainer.classList.add('operation-container');
    const previousButton = document.createElement('button');
    previousButton.textContent ='Previous';
    opContainer.appendChild(previousButton);

    previousButton.addEventListener('click', () => {
      if (this.index === 0) return false;
      this.playAtIndex(--this.index);
    });
    const nextButton = document.createElement('button');
    nextButton.textContent ='next';
    nextButton.addEventListener('click', () => {
      if (this.index === this.list.length - 1) return false;
      this.playAtIndex(++this.index);
    });
    opContainer.appendChild(nextButton);

    const modeContainer = document.createElement('span');
    modeContainer.classList.add('yuanplayer-mode-container');
    modeContainer.classList.add('material-symbols-outlined');
    opContainer.appendChild(modeContainer);

    modeContainer.addEventListener('click', () => {
      this.switchModes();
    })

    playlistContainer.appendChild(opContainer);

    container.appendChild(playlistContainer);
    this.updateHighlight();

    this.renderModeIcon();
  }

  playAtIndex(index) {
    this.player.setMedia(this.list[index].source);
    this.player.mediaObject.load();
    this.player.play();
    this.updateHighlight();
  }

  renderModeIcon() {
    const element = this.container.querySelector('.yuanplayer-mode-container');
    if (!element) return;
    let text = '';
    // 'none' | 'single' | 'random' | 'order'
    switch(PlayListBase.modes[this.modeIndex]) {
      case 'single':
        text = 'repeat_one_on';
        break;
      case 'random':
        text = 'shuffle_on';
        break;
      case 'order':
        text = 'repeat_on';
        break;
      case 'none':
      default:
        text = 'repeat';
        break;
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