import { PlayListBaseOptions } from "./playlist.d";
import PlayListBase from "./playlist-base";
import './playlist.scss';

export default class YuanPlayerPlayList extends PlayListBase {
  constructor(options: PlayListBaseOptions) {
    super(options);

    this.on('playMusicAtIndex', (index) => {
      this.playAtIndex(index);
      this.updateHighlight();
    })
    this.renderUI();
  }
  renderUI() {
    const container = this.container;

    const playlistContainer = document.createElement('div');
    playlistContainer.classList.add('yuanplay-playlist-container')

    this.list.forEach((item, index) => {
      const div = document.createElement('div');
      div.classList.add('music-item-container')
      div.textContent = item.title;
      playlistContainer.appendChild(div);

      div.addEventListener('click', () => {
        this.index = index;
        this.playAtIndex(index);
        this.updateHighlight();
      });
    })

    container.appendChild(playlistContainer);
    this.updateHighlight();
  }

  playAtIndex(index) {
    this.player.setMedia(this.list[index].source);
    this.player.mediaObject.load();
    this.player.play();
  }

  updateHighlight() {
    const playlistCOntainer = this.container.querySelector('.yuanplay-playlist-container');
    if (!playlistCOntainer) return ;
    playlistCOntainer.querySelector('.active')?.classList.remove('active');
    playlistCOntainer.querySelectorAll('.music-item-container')[this.index].classList.add('active');
  }
}