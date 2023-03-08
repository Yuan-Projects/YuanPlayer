export function isArray(vArg: any) {
  if (Array.isArray) {
    return Array.isArray(vArg);
  }
  return Object.prototype.toString.call(vArg) === "[object Array]";
}

export const isHtml5AudioSupported = function () {
  return document.createElement("audio").play;
};

export const innerText = function(element: HTMLElement, text: string) {
  (typeof element.textContent !== 'undefined') ? (element.textContent = text) : (element.innerText = text);
}

export function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
    return v.toString(16);
  });
}

/**
 * http://stackoverflow.com/questions/171251#16178864
 * Recursively merge properties and return new object
 * obj1 &lt;- obj2 [ &lt;- ... ]
 */
export function merge(...args) {
  const dst = {};
  let src, p;

  while (args.length > 0) {
    src = args.splice(0, 1)[0];
    if (Object.prototype.toString.call(src) == '[object Object]') {
      for (p in src) {
        if (src.hasOwnProperty && src.hasOwnProperty(p)) {
          if (Object.prototype.toString.call(src[p]) == '[object Object]') {
            dst[p] = merge(dst[p] || {}, src[p]);
          } else {
            dst[p] = src[p];
          }
        }
      }
    }
  }

  return dst;
}

export function trunc(x: number) {
  if ('trunc' in Math) {
    return Math.trunc(x);
  }
  // @ts-ignore
  return x < 0 ? Math.ceil(x) : Math.floor(x);
}

export function matches(element, selectors) {
  if (element.matches) {
    return element.matches(selectors);
  } else if (element.msMatchesSelector) {
    return element.msMatchesSelector(selectors);
  } else if (element.webkitMatchesSelector) {
    return element.webkitMatchesSelector(selectors);
  }
  return false;
}

export function isHLSNativelySupported() {
  const videoElement = document.createElement('video');
  return videoElement.canPlayType('application/x-mpegURL') || videoElement.canPlayType('application/vnd.apple.mpegURL');
}

export function isHLSJSSupported() {
  // @ts-ignore
  return typeof Hls === 'function' && Hls.isSupported();
}

export function createElement(tag, attributes = {}) {
  const element = document.createElement(tag);
  for (const attr in attributes) {
    if (attributes.hasOwnProperty(attr)) {
      if (attr === 'style') {
        element.style.cssText = attributes[attr];
      } else {
        element[attr] = attributes[attr];
      }
    }
  }
  return element;
}

export function includes(arr, searchElement) {
  // @ts-ignore
  if (Array.prototype.includes) {
    return arr.includes(searchElement);
  }
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === searchElement) {
      return true;
    }
  }
  return false;
}

// Check if the browser supports the Fullscreen API
export function isFullScreenEnabled() {
  // @ts-ignore
  return !!(document.fullscreenEnabled || document.mozFullScreenEnabled || document.msFullscreenEnabled || document.webkitSupportsFullscreen || document.webkitFullscreenEnabled || document.createElement('video').webkitRequestFullScreen);
}

// Checks if the document is currently in fullscreen mode
export function isFullScreen() {
  // @ts-ignore
  return !!(document.fullScreen || document.webkitIsFullScreen || document.mozFullScreen || document.msFullscreenElement || document.fullscreenElement);
}

export function exitFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  // @ts-ignore
  } else if (document.mozCancelFullScreen) {
    // @ts-ignore
    document.mozCancelFullScreen();
    // @ts-ignore
  } else if (document.webkitCancelFullScreen) {
    // @ts-ignore
    document.webkitCancelFullScreen();
    // @ts-ignore
  } else if (document.msExitFullscreen) {
    // @ts-ignore
    document.msExitFullscreen();
  }
}

export function requestFullscreen(element) {
  if (element.requestFullscreen) {
    element.requestFullscreen();
  } else if (element.mozRequestFullScreen) {
    element.mozRequestFullScreen();
  } else if (element.webkitRequestFullScreen) {
    // Safari 5.1 only allows proper fullscreen on the video element. This also works fine on other WebKit browsers as the following CSS (set in styles.css) hides the default controls that appear again, and 
    // ensures that our custom controls are visible:
    // figure[data-fullscreen=true] video::-webkit-media-controls { display:none !important; }
    // figure[data-fullscreen=true] .controls { z-index:2147483647; }
    element.webkitRequestFullScreen();
  } else if (element.msRequestFullscreen) {
    element.msRequestFullscreen();
  }
}

export function getFullScreenElement() {
  // @ts-ignore
  return document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement;
}

export function debounce(fn, limit) {
  let timer;
  const ans= function (...args) {
    // @ts-ignore
    const context = this;
    clearTimeout(timer);
    timer = setTimeout(function () {
      fn.call(context, ...args);
    }, limit);
  };
  ans.timer = () => {
    return timer;
  };
  return ans;
}