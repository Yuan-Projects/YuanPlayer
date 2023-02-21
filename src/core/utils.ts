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
  // @ts-ignore
  return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  );
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
    if (toString.call(src) == '[object Object]') {
      for (p in src) {
        if (src.hasOwnProperty(p)) {
          if (toString.call(src[p]) == '[object Object]') {
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