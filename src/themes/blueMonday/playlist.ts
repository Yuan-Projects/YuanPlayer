import { PlayListOptions } from "../../core/playlist.d";
// @ts-ignore
import tpl from './playlist.ejs';
// @ts-ignore
import itemTpl from './playlistItem.ejs';

function getClass(Base) {
  return class YuanPlayerPlayList extends Base {
    constructor(options: PlayListOptions) {
      super(options);
  
      this.on('playMusicAtIndex', (index) => {
        this.updateHighlight();
      });
      this.renderUI();
      this.on('modeChanged', this.renderModeIcon.bind(this));
      this.on('shuffledChanged', () => {
        this.updateShuffleIcon();
        this.container.querySelector('.yuanplayer-bluemonday-playlist').innerHTML = tpl({tracks: this.list});
        this.updateHighlight();
      });
      this.on('trackRemoved', (trackItemId) => {
        const ele = this.container.querySelector(`a[data-trackid="${trackItemId}"]`).parentNode.parentNode;
        ele.parentNode.removeChild(ele);
        if (this.list.length === 0) {
          this.container.querySelector('.yuan-playlist').innerHTML = '<div class="yuan-playlist-empty">The playlist is empty.</div>';
        }
        this.updateHighlight();
      });
      this.on('trackAdded', (trackItem) => {
        if (this.list.length === 1) {
          this.container.querySelector('.yuan-playlist').removeChild(this.container.querySelector('.yuan-playlist-empty'));
        }
        const ul = this.container.querySelector('.yuan-playlist ul');
        const li = document.createElement('li');
        li.innerHTML = itemTpl({index: this.list.length - 1, track: trackItem});
        ul.appendChild(li);
      });

      const previousButton = this.player.container.querySelector('.yuan-previous');
      previousButton?.addEventListener('click', () => {
        this.playPreviousTrack();
      });
      const nextButton = this.player.container.querySelector('.yuan-next');
      nextButton?.addEventListener('click', () => {
        this.playNextTrack();
      });
      const repeatButton = this.player.container.querySelector('.yuan-repeat');
      repeatButton?.addEventListener('click', () => {
        this.toggleRepeatAllMode();
      });
      const shuffleButton = this.player.container.querySelector('.yuan-shuffle');
      shuffleButton?.addEventListener('click', () => {
        if (this.shuffled) {
          this.restore();
        } else {
          this.shuffle();
        }
      });
    }
    renderUI() {
      const div = document.createElement('div');
      div.className = 'yuanplayer-bluemonday-playlist';
      
      div.innerHTML = tpl({tracks: this.list});
      this.container.appendChild(div);

      div.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        if (target?.classList?.contains('yuan-playlist-item')) {
          if (target.classList.contains('yuan-playlist-current')) {
            if (this.player.isPlaying() === false) {
              this.player.play();
            }
            return;
          }
          this.playTrackById(target.getAttribute('data-trackid') || '');
        }
        if (target?.classList?.contains('yuan-playlist-item-remove')) {
          this.remove(target.parentNode?.querySelector('.yuan-playlist-item')?.getAttribute('data-trackid'));
        }
      });
      this.updateHighlight();
    }
    toggleRepeatAllMode() {
      if (Base.modes[this.modeIndex] === 'all') {
        this.setMode('off');
      } else {
        this.setMode('all');
      }
    }

    updateShuffleIcon() {
      if (!this.player) return;
      const playerContainer = this.player.container;
      const audioContainer = playerContainer.querySelector('.yuan-audio');
      if (this.shuffled) {
        audioContainer.classList.add('yuan-state-shuffled');
      } else {
        audioContainer.classList.remove('yuan-state-shuffled');
      }
    }

    renderModeIcon() {
      if (!this.player) return;
      const playerContainer = this.player.container;
      const audioContainer = playerContainer.querySelector('.yuan-audio');
      if (Base.modes[this.modeIndex] === 'all') {
        audioContainer.classList.add('yuan-state-looped');
      } else {
        audioContainer.classList.remove('yuan-state-looped');
      }
    }
  
    updateHighlight() {
      const playlistCOntainer = this.container.querySelector('.yuan-playlist');
      if (!playlistCOntainer) return ;
      const highlightEl = playlistCOntainer.querySelector('li.yuan-playlist-current');
      if (highlightEl) {
        highlightEl.classList.remove('yuan-playlist-current');
        highlightEl.querySelector('a.yuan-playlist-current').classList.remove('yuan-playlist-current');
      }
      const newHighlightEl = playlistCOntainer.querySelectorAll('li')[this.index];
      if (newHighlightEl) {
        newHighlightEl.classList.add('yuan-playlist-current');
        newHighlightEl.querySelector('a.yuan-playlist-item').classList.add('yuan-playlist-current');
      }
    }
  }
}

export default getClass;