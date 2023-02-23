export function isArray(vArg: any) {
  if (Array.isArray) {
    return Array.isArray(vArg);
  }
  return Object.prototype.toString.call(vArg) === "[object Array]";
};

export const isHtml5AudioSupported = function () {
  return document.createElement("audio").play;
};

export const innerText = function(element: HTMLElement, text: string) {
  (typeof element.textContent !== 'undefined') ? (element.textContent = text) : (element.innerText = text);
}

export function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
    return v.toString(16);
  });
}

/**
 * http://stackoverflow.com/questions/171251#16178864
 * Recursively merge properties and return new object
 * obj1 &lt;- obj2 [ &lt;- ... ]
 */
export function merge(...args) {
  let dst = {} ,src, p;

  while (args.length > 0) {
    src = args.splice(0, 1)[0];
    if (Object.prototype.toString.call(src) == '[object Object]') {
      for (p in src) {
        if (src.hasOwnProperty(p)) {
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
  }
  return false;
}