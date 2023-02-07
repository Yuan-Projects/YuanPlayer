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