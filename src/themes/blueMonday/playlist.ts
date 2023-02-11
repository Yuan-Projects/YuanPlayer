import { PlayListOptions } from "../../core/playlist.d";
// @ts-ignore
import tpl from './playlist.ejs';

function getClass(Base) {
  return class YuanPlayerPlayList extends Base {
    constructor(options: PlayListOptions) {
      super(options);
  
      this.on('playMusicAtIndex', (index) => {
        this.updateHighlight();
      });
      this.renderUI();
      this.on('modeChanged', this.renderModeIcon.bind(this));

      const previousButton = this.player.container.querySelector('.jp-previous');
      previousButton?.addEventListener('click', () => {
        this.playPreviousTrack();
      });
      const nextButton = this.player.container.querySelector('.jp-next');
      nextButton?.addEventListener('click', () => {
        this.playNextTrack();
      });
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
          this.index = target.getAttribute('data-index');
          this.playAtIndex(this.index);
        }
      });
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
      const highlightEl = playlistCOntainer.querySelector('li.jp-playlist-current');
      if (highlightEl) {
        highlightEl.classList.remove('jp-playlist-current');
        highlightEl.querySelector('a.jp-playlist-current').classList.remove('jp-playlist-current');
      }
      const newHighlightEl = playlistCOntainer.querySelectorAll('li')[this.index];
      if (newHighlightEl) {
        newHighlightEl.classList.add('jp-playlist-current');
        newHighlightEl.querySelector('a.jp-playlist-item').classList.add('jp-playlist-current');
      }
    }
  }
}

export default getClass;