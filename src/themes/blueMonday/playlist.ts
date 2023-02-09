import { PlayListOptions } from "../../core/playlist.d";
// @ts-ignore
import tpl from './playlist.ejs';

function getClass(Base) {
  return class YuanPlayerPlayList extends Base {
    constructor(options: PlayListOptions) {
      super(options);
  
      this.on('playMusicAtIndex', (index) => {
        this.playAtIndex(index);
        this.updateHighlight();
      });
      this.renderUI();
      this.on('modeChanged', this.renderModeIcon.bind(this));
    }
    renderUI() {
      const div = document.createElement('div');
      div.textContent = 'playlist';
      
      div.innerHTML = tpl({tracks: this.list});
      this.container.appendChild(div);

      div.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        if (target?.classList?.contains('jp-playlist-item')) {
          if (target.classList.contains('jp-playlist-current')) {
            // do nothing
            return;
          }
          this.playAtIndex(target.getAttribute('data-index'));
        }
      })
    }
  
    playAtIndex(index) {
      index = parseInt(index);
      this.index = index;
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
      switch(Base.modes[this.modeIndex]) {
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
      const playlistCOntainer = this.container.querySelector('.jp-playlist');
      if (!playlistCOntainer) return ;
      playlistCOntainer.querySelector('.jp-playlist-current')?.classList.remove('jp-playlist-current');
      playlistCOntainer.querySelector(`[data-index="${this.index}"]`).classList.add('jp-playlist-current');
    }
  }
}

export default getClass;